import mysql.connector

try:
    conn = mysql.connector.connect(
        host="127.0.0.1",
        port=3306,
        user="root",
        password="ElaMysql@123",   # same password here too
        database="crop_dss"
    )

    if conn.is_connected():
        print("✅ Python to MySQL connection successful")
    else:
        print("❌ Connected object created, but not connected")

except Exception as e:
    print("❌ Connection failed:", e)