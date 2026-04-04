import mysql.connector
from mysql.connector import Error

def get_db_connection():
    try:
        print(">>> trying mysql connection", flush=True)
        connection = mysql.connector.connect(
            host='127.0.0.1',
            port=3306,
            user='root',
            password='ElaMysql@123',
            database='crop_dss'
        )
        print(">>> mysql connected", flush=True)
        return connection
    except Error as err:
        print(">>> Database Connection Error:", err, flush=True)
        return None

def close_db_connection(connection, cursor=None):
    if cursor:
        cursor.close()
    if connection and connection.is_connected():
        connection.close()