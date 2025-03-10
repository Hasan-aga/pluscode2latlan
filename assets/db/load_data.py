import sqlite3

DB_PATH = "geonames.db"
DATA_FILE = "/Users/hasanaga/Downloads/cities15000.txt"

def create_db():
    """Create the geonames table if it does not exist."""
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS geonames (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            latitude REAL,
            longitude REAL
        )
    """)
    conn.commit()
    conn.close()

def load_data():
    """Load data from cities1000.txt into the SQLite database."""
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    with open(DATA_FILE, "r", encoding="utf-8") as file:
        for line in file:
            columns = line.strip().split("\t")
            if len(columns) >= 7:  # Ensure the row has enough columns
                name = columns[1]  # Primary name
                latitude = float(columns[4])
                longitude = float(columns[5])
                cur.execute("INSERT INTO geonames (name, latitude, longitude) VALUES (?, ?, ?)", 
                            (name, latitude, longitude))
    
    conn.commit()
    conn.close()
    print("Data successfully loaded.")

if __name__ == "__main__":
    create_db()
    load_data()
