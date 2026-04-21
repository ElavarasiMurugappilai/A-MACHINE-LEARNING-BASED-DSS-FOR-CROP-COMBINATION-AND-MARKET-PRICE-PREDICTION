from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import pickle
import numpy as np
import mysql.connector
from flask_bcrypt import Bcrypt
from datetime import datetime, timedelta
import pandas as pd
import re
import os
from train import SubCropRecommender
from database.db_connection import get_db_connection, close_db_connection

app = Flask(__name__)
bcrypt = Bcrypt(app)

# ── CORS: blanket allow all origins ──────────────────────────────────────────
CORS(app, supports_credentials=True)

# ── Manual CORS headers on every response (belt-and-suspenders) ──────────────
@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"]      = request.headers.get("Origin", "*")
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Methods"]     = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"]     = "Content-Type, Authorization"
    return response

@app.route("/predict_prices", methods=["OPTIONS"])
@app.route("/predict",        methods=["OPTIONS"])
@app.route("/login",          methods=["OPTIONS"])
@app.route("/signup",         methods=["OPTIONS"])
@app.route("/health",         methods=["OPTIONS"])
def options_handler():
    return make_response("", 204)

# ── NPK Valid Ranges ──────────────────────────────────────────────────────────
NPK_RANGES = {
    "N":           (0,   140),
    "P":           (0,   145),
    "K":           (0,   205),
    "temperature": (0,    50),
    "humidity":    (0,   100),
    "ph":          (0,    14),
    "rainfall":    (0,   500),
}

# ── Name normalizers ──────────────────────────────────────────────────────────
def normalize_market(name):
    name = str(name).strip()
    name = re.sub(r'\s*\(.*?\)\s*', '', name).strip()
    return name

def normalize_commodity(name):
    name = str(name).strip()
    aliases = {
        "Apple": "Apple", "Banana": "Banana",
        "Custard Apple (Sharifa)": "Custard Apple (Sharifa)",
        "Fig(Anjura/Anjeer)": "Fig(Anjura/Anjeer)",
        "Guava": "Guava", "Maize": "Maize", "Papaya": "Papaya",
        "Pear(Marasebu)": "Pear(Marasebu)", "Pineapple": "Pineapple",
        "Plum": "Plum", "Pomegranate": "Pomegranate", "Tomato": "Tomato",
        "Custard Apple": "Custard Apple (Sharifa)",
        "Fig": "Fig(Anjura/Anjeer)",
        "Pear": "Pear(Marasebu)", "Pear (Marasebu)": "Pear(Marasebu)",
        "Karbuja(Musk Melon)": "Pineapple", "Water Melon": "Pineapple",
        "Onion": "Tomato", "Potato": "Tomato", "Brinjal": "Tomato",
        "Green Chilli": "Tomato", "Ginger(Green)": "Tomato",
        "Bottle gourd": "Tomato", "Pumpkin": "Tomato",
        "Coconut": "Pomegranate", "Coffee": "Pomegranate",
        "Cotton": "Pomegranate", "Black Pepper": "Pomegranate",
        "Cardamoms": "Pomegranate", "Cocoa": "Pomegranate",
        "Grapes": "Pomegranate",
        "Sugarcane": "Maize", "Jowar": "Maize",
        "Bajra(Pearl Millet/Cumbu)": "Maize",
        "Foxtail Millet(Navane)": "Maize", "Rice": "Maize",
        "Soyabean": "Maize", "Groundnut": "Maize", "Jute": "Maize",
        "Turmeric": "Maize", "Sesamum(Sesame,Gingelly,Til)": "Maize",
        "Black Gram Dal (Urd Dal)": "Maize",
        "Bengal Gram(Gram)(Whole)": "Maize",
        "Green Gram (Moong)(Whole)": "Maize",
        "Lentil (Masur)(Whole)": "Maize",
        "Kabuli Channa(Chickpeas-White)": "Maize",
        "Moath Dal": "Maize", "Cowpea (Lobia/Karamani)": "Maize",
        "Pegeon Pea (Arhar Fali)": "Maize",
        "Lemon": "Guava", "Orange": "Guava",
        "Ber(Zizyphus/Borehannu)": "Guava", "Chakotha": "Guava",
        "Jack Fruit": "Papaya", "Mango": "Papaya",
        "Chikoos(Sapota)": "Papaya",
        "Cherry": "Plum", "Apricot(Jardalu/Khumani)": "Plum",
        "Kinnow": "Apple",
    }
    return aliases.get(name, name)


# ── Load crop/subcrop model ───────────────────────────────────────────────────
try:
    with open("subcrop_recommender.pkl", "rb") as f:
        crop_model = pickle.load(f)
    print("OK crop model loaded")
except FileNotFoundError:
    print("ERROR: subcrop_recommender.pkl not found")
    crop_model = None

# ── Load market price model ───────────────────────────────────────────────────
price_model    = None
price_encoders = None

try:
    with open("market_price_model.pkl", "rb") as f:
        raw = pickle.load(f)
    if isinstance(raw, dict) and "model" in raw:
        price_model = raw["model"]
        print("OK market model loaded (dict bundle — retrain recommended)")
    else:
        price_model = raw
        print("OK market model loaded (direct)")

    enc_file = "market_price_encoders.pkl" if os.path.exists("market_price_encoders.pkl") else "market_encoders.pkl"
    with open(enc_file, "rb") as f:
        price_encoders = pickle.load(f)
    print(f"OK encoders loaded from {enc_file}")
    print("   features:", price_encoders.get("features", price_encoders.get("feature_cols", "?")))

except FileNotFoundError as e:
    print(f"ERROR market model: {e}  -- run python train_market.py")


def get_enc_list(k1, k2):
    if price_encoders is None: return []
    return price_encoders.get(k1, price_encoders.get(k2, []))


# ── Health ────────────────────────────────────────────────────────────────────
@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "crop_model":    crop_model is not None,
        "price_model":   price_model is not None,
        "commodities":   get_enc_list("known_commodities", "commodities_list"),
        "markets":       get_enc_list("known_markets", "markets_list"),
    })


# ── Crop Recommendation ───────────────────────────────────────────────────────
@app.route("/predict", methods=["POST"])
def predict():
    if not crop_model:
        return jsonify({"error": "Crop model not loaded"}), 500

    data = request.json
    required = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]
    for f in required:
        if f not in data:
            return jsonify({"error": f"Missing field: {f}"}), 400

    try:
        vals = {f: float(data[f]) for f in required}
    except (ValueError, TypeError):
        return jsonify({"error": "All fields must be numeric"}), 400

    for f, v in vals.items():
        if v != v:
            return jsonify({"error": f"{f} is NaN"}), 400

    errs = []
    for f, v in vals.items():
        lo, hi = NPK_RANGES[f]
        if not (lo <= v <= hi):
            errs.append(f"{f} must be {lo}-{hi} (got {v})")
    if errs:
        return jsonify({"error": "Out of range", "details": errs}), 400

    print(f"  /predict N={vals['N']} P={vals['P']} K={vals['K']} "
          f"T={vals['temperature']} H={vals['humidity']} pH={vals['ph']} R={vals['rainfall']}")
    try:
        result = crop_model.recommend_sub_crops(
            vals["N"], vals["P"], vals["K"],
            vals["temperature"], vals["humidity"],
            vals["ph"], vals["rainfall"]
        )
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ── Market Price Prediction ───────────────────────────────────────────────────
@app.route("/predict_prices", methods=["POST"])
def predict_prices():
    if not price_model or not price_encoders:
        return jsonify({"error": "Market model not loaded. Run python train_market.py"}), 500

    data = request.json
    for f in ["state", "market", "commodity"]:
        if f not in data:
            return jsonify({"error": f"Missing: {f}"}), 400

    orig_c = data["commodity"]
    orig_m = data["market"]
    orig_s = data["state"]

    nc = normalize_commodity(orig_c)
    nm = normalize_market(orig_m)
    ns = orig_s.strip()

    print(f"  price: '{orig_c}'->'{nc}'  '{orig_m}'->'{nm}'")

    le_c  = price_encoders.get("le_commodity")
    le_m  = price_encoders.get("le_market")
    le_s  = price_encoders.get("le_state")
    kc    = get_enc_list("known_commodities", "commodities_list")
    km    = get_enc_list("known_markets",     "markets_list")
    ks    = get_enc_list("known_states",      "states_list")

    if nc not in kc: nc = kc[0] if kc else "Tomato"
    if nm not in km: nm = km[0] if km else "Tiruchengode"
    if ns not in ks: ns = ks[0] if ks else "Tamil Nadu"

    ce = int(le_c.transform([nc])[0])
    me = int(le_m.transform([nm])[0])
    se = int(le_s.transform([ns])[0])

    # Get exact feature columns the model was trained with
    feature_cols = price_encoders.get("features",
                   price_encoders.get("feature_cols",
                   ["commodity_enc","market_enc","state_enc","Month","DayOfYear","Season","Price_Range"]))

    today    = datetime.today()
    horizons = {"one_week":7,"one_month":30,"three_months":90,"six_months":180}
    predictions = {}

    for label, days in horizons.items():
        dates_list, prices_list = [], []
        step = max(1, days // 12)
        for d in range(step, days + 1, step):
            fd  = today + timedelta(days=d)
            mon = fd.month
            doy = fd.timetuple().tm_yday
            sea = 0 if mon in [12,1,2] else (1 if mon in [3,4,5] else (2 if mon in [6,7,8] else 3))

            # Map of ALL possible column names → values (handles any training format)
            pool = {
                "commodity_enc": ce, "Commodity_enc": ce,
                "market_enc":    me, "Market_enc":    me,
                "state_enc":     se, "State_enc":     se,
                "Month": mon,  "month": mon,
                "DayOfYear": doy, "day_of_year": doy,
                "Season": sea, "season": sea,
                "Price_Range": 0, "Price_Spread": 0,
                "Year": fd.year, "year": fd.year,
                "Week": fd.isocalendar()[1], "week": fd.isocalendar()[1],
                "Quarter": (mon-1)//3+1, "quarter": (mon-1)//3+1,
                "Min Price": 0, "Max Price": 0,
                "lag_1": 0, "lag_7": 0, "rolling_mean_7": 0,
            }
            row_vals = [pool.get(col, 0) for col in feature_cols]
            row = pd.DataFrame([row_vals], columns=feature_cols)

            p = float(price_model.predict(row)[0])
            dates_list.append(fd.strftime("%Y-%m-%d"))
            prices_list.append(round(max(p, 0), 2))

        predictions[label] = {"dates": dates_list, "predicted_prices": prices_list}

    return jsonify({
        "state": orig_s, "market": orig_m, "commodity": orig_c,
        "mapped_to": nc, "predictions": predictions,
    })


# ── Signup ────────────────────────────────────────────────────────────────────
@app.route("/signup", methods=["POST"])
def signup():
    db = get_db_connection()
    if db is None:
        return jsonify({"error": "Database connection failed"}), 500
    cursor = db.cursor()
    data = request.json
    hashed = bcrypt.generate_password_hash(data["password"]).decode("utf-8")
    try:
        cursor.execute(
            "INSERT INTO users (username, email, password) VALUES (%s, %s, %s)",
            (data["username"], data["email"], hashed)
        )
        db.commit()
        return jsonify({"message": "User registered successfully"}), 201
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 400
    finally:
        close_db_connection(db, cursor)


# ── Login ─────────────────────────────────────────────────────────────────────
@app.route("/login", methods=["POST"])
def login():
    db = get_db_connection()
    if db is None:
        return jsonify({"error": "Database connection failed"}), 500
    cursor = db.cursor()
    data = request.json
    try:
        cursor.execute("SELECT username, password FROM users WHERE email = %s", (data["email"],))
        user = cursor.fetchone()
        if not user or not bcrypt.check_password_hash(user[1], data["password"]):
            return jsonify({"message": "Invalid credentials"}), 401
        return jsonify({"message": "Login successful", "username": user[0]})
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 400
    finally:
        close_db_connection(db, cursor)


if __name__ == "__main__":
    app.run(debug=True, port=5000, use_reloader=False)