

import os
import glob
import pickle
import re
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_percentage_error
from sklearn.preprocessing import LabelEncoder

# Delete ALL old pkl files that could be stale
for f in ["market_price_model.pkl", "market_price_encoders.pkl", "market_encoders.pkl"]:
    if os.path.exists(f):
        os.remove(f)
        print(f"Deleted old: {f}")

def normalize_market(name):
    name = str(name).strip()
    name = re.sub(r'\s*\(.*?\)\s*', '', name).strip()
    return name

files = glob.glob("*_past3years.csv")
print(f"\nFound {len(files)} CSV files")

dfs = []
for f in files:
    try:
        df = pd.read_csv(f)
        if "Commodity" in df.columns and "Modal Price" in df.columns:
            dfs.append(df)
            print(f"Loaded: {f}")
    except Exception as e:
        print(f"Skipped {f}: {e}")

if not dfs:
    raise ValueError("No valid CSV files found. Make sure *_past3years.csv files are present.")

combined = pd.concat(dfs, ignore_index=True)

combined["Modal Price"] = pd.to_numeric(combined["Modal Price"], errors="coerce")
combined["Min Price"] = pd.to_numeric(combined["Min Price"], errors="coerce")
combined["Max Price"] = pd.to_numeric(combined["Max Price"], errors="coerce")
combined["Date"] = pd.to_datetime(combined["Date"], errors="coerce")

combined = combined.dropna(subset=["Modal Price", "Date"])

if "Market" not in combined.columns:
    combined["Market"] = "Unknown"

if "State" not in combined.columns:
    combined["State"] = "Unknown"

combined = combined[combined["Modal Price"] > 0]
combined["Market_norm"] = combined["Market"].apply(normalize_market)
combined["Month"] = combined["Date"].dt.month
combined["DayOfYear"] = combined["Date"].dt.dayofyear
combined["Season"] = combined["Month"].map(
    lambda m: 0 if m in [12, 1, 2] else (1 if m in [3, 4, 5] else (2 if m in [6, 7, 8] else 3))
)

combined["Price_Range"] = (
    combined["Max Price"].fillna(combined["Modal Price"])
    - combined["Min Price"].fillna(combined["Modal Price"])
).clip(lower=0)

le_commodity = LabelEncoder()
le_market = LabelEncoder()
le_state = LabelEncoder()

combined["commodity_enc"] = le_commodity.fit_transform(combined["Commodity"].astype(str))
combined["market_enc"] = le_market.fit_transform(combined["Market_norm"].astype(str))
combined["state_enc"] = le_state.fit_transform(combined["State"].astype(str))

FEATURES = [
    "commodity_enc",
    "market_enc",
    "state_enc",
    "Month",
    "DayOfYear",
    "Season",
    "Price_Range"
]

X = combined[FEATURES].fillna(0)
y = combined["Modal Price"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

print("\nTraining model...")
model = RandomForestRegressor(
    n_estimators=150,
    random_state=42,
    n_jobs=-1
)
model.fit(X_train, y_train)

preds = model.predict(X_test)
accuracy = (1 - mean_absolute_percentage_error(y_test, preds)) * 100

print(f"Accuracy: {accuracy:.2f}%")
print(f"Features model was trained with: {FEATURES}")

# Save model directly
with open("market_price_model.pkl", "wb") as f:
    pickle.dump(model, f)

# Save encoders
encoders = {
    "le_commodity": le_commodity,
    "le_market": le_market,
    "le_state": le_state,
    "features": FEATURES,
    "known_commodities": list(le_commodity.classes_),
    "known_markets": list(le_market.classes_),
    "known_states": list(le_state.classes_),
}

with open("market_price_encoders.pkl", "wb") as f:
    pickle.dump(encoders, f)

print("\nSaved: market_price_model.pkl")
print("Saved: market_price_encoders.pkl")
print(f"Total commodities: {len(le_commodity.classes_)}")
print(f"Total markets: {len(le_market.classes_)}")
print(f"Total states: {len(le_state.classes_)}")
print("\nNow restart server.py")