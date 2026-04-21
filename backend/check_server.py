"""
Run this from your backend folder to diagnose startup errors:
    cd backend
    python check_server.py
"""
import sys
print("Python:", sys.version)

errors = []

try:
    from flask import Flask
    print("OK  flask")
except Exception as e:
    errors.append(f"MISSING flask: {e}")

try:
    from flask_cors import CORS
    print("OK  flask_cors")
except Exception as e:
    errors.append(f"MISSING flask_cors: {e}")

try:
    from flask_bcrypt import Bcrypt
    print("OK  flask_bcrypt")
except Exception as e:
    errors.append(f"MISSING flask_bcrypt: {e}")

try:
    import pandas as pd
    print("OK  pandas")
except Exception as e:
    errors.append(f"MISSING pandas: {e}")

try:
    import numpy as np
    print("OK  numpy")
except Exception as e:
    errors.append(f"MISSING numpy: {e}")

try:
    import sklearn
    print("OK  sklearn")
except Exception as e:
    errors.append(f"MISSING sklearn: {e}")

try:
    import mysql.connector
    print("OK  mysql.connector")
except Exception as e:
    errors.append(f"MISSING mysql.connector: {e}")

try:
    from train import SubCropRecommender
    print("OK  train.py / SubCropRecommender")
except Exception as e:
    errors.append(f"ERROR in train.py: {e}")

try:
    import pickle, os
    with open("subcrop_recommender.pkl", "rb") as f:
        m = pickle.load(f)
    print("OK  subcrop_recommender.pkl loaded")
except Exception as e:
    errors.append(f"ERROR loading subcrop_recommender.pkl: {e}")

try:
    import pickle, os
    with open("market_price_model.pkl", "rb") as f:
        m = pickle.load(f)
    print("OK  market_price_model.pkl loaded, type:", type(m).__name__)
except Exception as e:
    errors.append(f"ERROR loading market_price_model.pkl: {e}")

for enc_file in ["market_price_encoders.pkl", "market_encoders.pkl"]:
    try:
        with open(enc_file, "rb") as f:
            e = pickle.load(f)
        print(f"OK  {enc_file} loaded, keys: {list(e.keys())[:6]}")
        break
    except Exception as ex:
        errors.append(f"ERROR loading {enc_file}: {ex}")

print("\n" + "="*50)
if errors:
    print("ERRORS FOUND:")
    for err in errors:
        print("  !", err)
    print("\nFix these errors first, then restart server.py")
else:
    print("ALL OK — server.py should start cleanly")
    print("If CORS still fails, the old Flask process is still running.")
    print("Kill it: find the terminal with the old 'python server.py' and press Ctrl+C")