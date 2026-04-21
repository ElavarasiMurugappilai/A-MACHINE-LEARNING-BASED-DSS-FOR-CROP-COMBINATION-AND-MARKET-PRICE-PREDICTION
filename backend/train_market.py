"""
train_market.py
Run this ONCE from inside the backend folder:
    cd backend
    python train_market.py
"""

import pandas as pd
import numpy as np
import glob
import pickle
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import r2_score, mean_absolute_percentage_error


ALL_FRONTEND_COMMODITIES = [
    "Apple", "Apricot(Jardalu/Khumani)", "Bajra(Pearl Millet/Cumbu)", "Banana",
    "Bengal Gram(Gram)(Whole)", "Ber(Zizyphus/Borehannu)", "Black Gram Dal (Urd Dal)",
    "Black Pepper", "Bottle gourd", "Cardamoms", "Chakotha", "Cherry",
    "Chikoos(Sapota)", "Cocoa", "Coconut", "Coffee", "Cotton",
    "Cowpea (Lobia/Karamani)", "Custard Apple (Sharifa)", "Fig(Anjura/Anjeer)",
    "Foxtail Millet(Navane)", "Ginger(Green)", "Grapes", "Green Gram (Moong)(Whole)",
    "Groundnut", "Guava", "Jack Fruit", "Jowar", "Jute",
    "Kabuli Channa(Chickpeas-White)", "Karbuja(Musk Melon)", "Kinnow", "Lemon",
    "Lentil (Masur)(Whole)", "Maize", "Mango", "Moath Dal", "Orange", "Papaya",
    "Pear(Marasebu)", "Pegeon Pea (Arhar Fali)", "Pineapple", "Plum", "Pomegranate",
    "Pumpkin", "Rice", "Sesamum(Sesame,Gingelly,Til)", "Soyabean", "Sugarcane",
    "Tomato", "Turmeric", "Water Melon",
]

BASE_PRICES = {
    "Apple": 6000, "Apricot(Jardalu/Khumani)": 12000, "Bajra(Pearl Millet/Cumbu)": 1800,
    "Banana": 2500, "Bengal Gram(Gram)(Whole)": 5500, "Ber(Zizyphus/Borehannu)": 3000,
    "Black Gram Dal (Urd Dal)": 6000, "Black Pepper": 45000, "Bottle gourd": 600,
    "Cardamoms": 80000, "Chakotha": 2000, "Cherry": 15000, "Chikoos(Sapota)": 2500,
    "Cocoa": 20000, "Coconut": 1500, "Coffee": 18000, "Cotton": 6000,
    "Cowpea (Lobia/Karamani)": 4500, "Custard Apple (Sharifa)": 6000,
    "Fig(Anjura/Anjeer)": 8000, "Foxtail Millet(Navane)": 2500, "Ginger(Green)": 5000,
    "Grapes": 4500, "Green Gram (Moong)(Whole)": 7000, "Groundnut": 5500,
    "Guava": 2000, "Jack Fruit": 1500, "Jowar": 2000, "Jute": 4000,
    "Kabuli Channa(Chickpeas-White)": 7500, "Karbuja(Musk Melon)": 1200,
    "Kinnow": 3000, "Lemon": 4000, "Lentil (Masur)(Whole)": 5500,
    "Maize": 1800, "Mango": 3000, "Moath Dal": 5000, "Orange": 3500,
    "Papaya": 1200, "Pear(Marasebu)": 4000, "Pegeon Pea (Arhar Fali)": 6500,
    "Pineapple": 2500, "Plum": 5000, "Pomegranate": 8000, "Pumpkin": 900,
    "Rice": 2200, "Sesamum(Sesame,Gingelly,Til)": 7000, "Soyabean": 4500,
    "Sugarcane": 350, "Tomato": 1500, "Turmeric": 8000, "Water Melon": 800,
}

TN_MARKETS = [
    "Tiruchengode", "Ammapet(Uzhavar Sandhai )",
    "Usilampatty", "Sivakasi(Uzhavar Sandhai )", "Kumbakonam"
]


def load_real_csvs():
    all_files = glob.glob("*.csv")
    all_files = [f for f in all_files if "Crop_recommendation" not in f
                 and "subcrop" not in f.lower()
                 and "accuracy" not in f.lower()
                 and "market_price" not in f.lower()]
    dfs = []
    loaded_commodities = set()
    for f in all_files:
        try:
            df = pd.read_csv(f)
            required = ['Commodity', 'Market', 'Modal Price', 'Date']
            if all(col in df.columns for col in required):
                df['Modal Price'] = pd.to_numeric(df['Modal Price'], errors='coerce')
                df['Min Price']   = pd.to_numeric(df['Min Price'],   errors='coerce') if 'Min Price' in df.columns else df['Modal Price']
                df['Max Price']   = pd.to_numeric(df['Max Price'],   errors='coerce') if 'Max Price' in df.columns else df['Modal Price']
                df['Date']        = pd.to_datetime(df['Date'],       errors='coerce')
                df = df.dropna(subset=['Modal Price', 'Date'])
                df = df[df['Modal Price'] > 0]
                if len(df) > 0:
                    dfs.append(df)
                    loaded_commodities.update(df['Commodity'].unique())
                    print(f"  Loaded: {f} ({len(df)} rows)")
        except Exception as e:
            print(f"  Skipped {f}: {e}")
    return dfs, loaded_commodities


def generate_synthetic_data(existing_commodities):
    missing = [c for c in ALL_FRONTEND_COMMODITIES if c not in existing_commodities]
    print(f"\nGenerating synthetic data for {len(missing)} missing commodities...")
    np.random.seed(42)
    dates = pd.date_range('2022-01-01', '2025-04-01', freq='W')
    all_rows = []
    for commodity in missing:
        base = BASE_PRICES.get(commodity, 2000)
        for market in TN_MARKETS[:3]:
            for i, date in enumerate(dates):
                seasonal = base * 0.15 * np.sin(2 * np.pi * (date.month - 3) / 12)
                trend    = base * 0.04 * (i / len(dates))
                noise    = base * 0.08 * np.random.randn()
                modal    = max(base * 0.4, base + seasonal + trend + noise)
                min_p    = modal * np.random.uniform(0.85, 0.95)
                max_p    = modal * np.random.uniform(1.05, 1.15)
                all_rows.append({
                    'S.No': i+1, 'Market': market, 'Commodity': commodity,
                    'Min Price': round(min_p), 'Max Price': round(max_p),
                    'Modal Price': round(modal),
                    'Date': date, 'State': 'Tamil Nadu'
                })
    df = pd.DataFrame(all_rows)
    print(f"  Generated {len(df)} rows for {len(missing)} commodities")
    return df


def get_season(month):
    if month in [12, 1, 2]:      return 0
    elif month in [3, 4, 5]:     return 1
    elif month in [6, 7, 8, 9]:  return 2
    else:                         return 3


def engineer_features(df):
    df = df.copy()
    df['Date']      = pd.to_datetime(df['Date'], errors='coerce')
    df['Month']     = df['Date'].dt.month
    df['Year']      = df['Date'].dt.year
    df['Week']      = df['Date'].dt.isocalendar().week.astype(int)
    df['Quarter']   = df['Date'].dt.quarter
    df['DayOfYear'] = df['Date'].dt.dayofyear
    df['Season']    = df['Month'].apply(get_season)
    df['Min Price'] = pd.to_numeric(df['Min Price'], errors='coerce').fillna(df['Modal Price'])
    df['Max Price'] = pd.to_numeric(df['Max Price'], errors='coerce').fillna(df['Modal Price'])
    df['Price_Spread'] = df['Max Price'] - df['Min Price']
    return df


def main():
    print("=" * 55)
    print("  MARKET PRICE MODEL TRAINING")
    print("=" * 55)

    print("\nStep 1: Loading real CSV files...")
    real_dfs, existing_commodities = load_real_csvs()
    print(f"Real commodities found: {sorted(existing_commodities)}")

    print("\nStep 2: Generating data for missing commodities...")
    synthetic_df = generate_synthetic_data(existing_commodities)

    print("\nStep 3: Combining data...")
    all_dfs = real_dfs + ([synthetic_df] if len(synthetic_df) > 0 else [])
    df = pd.concat(all_dfs, ignore_index=True)
    df['Date']        = pd.to_datetime(df['Date'], errors='coerce')
    df['Modal Price'] = pd.to_numeric(df['Modal Price'], errors='coerce')
    df = df.dropna(subset=['Modal Price', 'Date', 'Commodity', 'Market'])
    df = df[df['Modal Price'] > 0]
    print(f"Total rows: {len(df)} | Commodities: {df['Commodity'].nunique()} | Markets: {df['Market'].nunique()}")

    print("\nStep 4: Engineering features...")
    df = engineer_features(df)

    print("\nStep 5: Encoding...")
    le_commodity = LabelEncoder()
    le_market    = LabelEncoder()
    df['Commodity_enc'] = le_commodity.fit_transform(df['Commodity'].astype(str))
    df['Market_enc']    = le_market.fit_transform(df['Market'].astype(str))
    print(f"  Commodities: {len(le_commodity.classes_)} | Markets: {len(le_market.classes_)}")

    feature_cols = [
        'Commodity_enc', 'Market_enc',
        'Month', 'Year', 'Week', 'Quarter', 'DayOfYear',
        'Season', 'Price_Spread', 'Min Price', 'Max Price'
    ]
    X = df[feature_cols]
    y = df['Modal Price']
    mask = X.notna().all(axis=1) & y.notna()
    X, y = X[mask], y[mask]
    print(f"  Final rows: {len(X)}")

    print("\nStep 6: Training RandomForest (this takes 1-2 minutes)...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model = RandomForestRegressor(n_estimators=200, max_depth=15, min_samples_split=5, random_state=42, n_jobs=-1)
    model.fit(X_train, y_train)

    preds    = model.predict(X_test)
    r2       = r2_score(y_test, preds)
    mape     = mean_absolute_percentage_error(y_test, preds) * 100
    accuracy = max(0, 100 - mape)
    print(f"\n{'='*40}")
    print(f"  R2 Score : {r2:.4f}")
    print(f"  MAPE     : {mape:.2f}%")
    print(f"  Accuracy : {accuracy:.2f}%")
    print(f"{'='*40}")

    print("\nStep 7: Saving...")
    with open('market_price_model.pkl', 'wb') as f:
        pickle.dump({'model': model, 'feature_cols': feature_cols}, f)
    with open('market_encoders.pkl', 'wb') as f:
        pickle.dump({
            'le_commodity':     le_commodity,
            'le_market':        le_market,
            'commodities_list': list(le_commodity.classes_),
            'markets_list':     list(le_market.classes_),
        }, f)

    print("  Saved: market_price_model.pkl")
    print("  Saved: market_encoders.pkl")
    print("\nAll done! Every commodity in the frontend will now get predictions.")


if __name__ == '__main__':
    main()