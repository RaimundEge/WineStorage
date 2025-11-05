# load old mongodb values into sqlite database

from pymongo import MongoClient
import sqlite3

# Connect to MongoDB
mongo_client = MongoClient('mongodb://blitz:27017/')
mongo_db = mongo_client['wine']
mongo_collection = mongo_db['temps']

# Connect to SQLite
sqlite_conn = sqlite3.connect('../temper/winetemps.db')
sqlite_cursor = sqlite_conn.cursor()

# Create table if not exists
sqlite_cursor.execute('DROP TABLE IF EXISTS Temps')
sqlite_cursor.execute('''
    CREATE TABLE Temps (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        value REAL,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
''')

# Load data from MongoDB and insert into SQLite
for document in mongo_collection.find():
    sqlite_cursor.execute('''
        INSERT INTO Temps (value,date)
        VALUES (?, ?)
    ''', (
        
        document.get('value'),
        document.get('time')
    ))

# Commit changes and close connections
sqlite_conn.commit()
sqlite_conn.close()
mongo_client.close()        
print("Data loaded from MongoDB to SQLite successfully.")
