import sqlite3

DB_PATH = "geonames.db"
DATA_FILE = "/Users/hasanaga/Downloads/cities15000.txt"

def create_db():
    """Create the geonames and alternative_names tables if they do not exist."""
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
    cur.execute("""
        CREATE TABLE IF NOT EXISTS alternative_names (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            geoname_id INTEGER,
            alternative_name TEXT,
            FOREIGN KEY (geoname_id) REFERENCES geonames(id)
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

                # Insert primary name into geonames table
                cur.execute("INSERT INTO geonames (name, latitude, longitude) VALUES (?, ?, ?)",
                            (name, latitude, longitude))
                geoname_id = cur.lastrowid  # Get the ID of the inserted row

                # Insert alternative names into alternative_names table
                alternative_names = columns[3].split(',')  # Split the alternative names
                for alt_name in alternative_names:
                    cur.execute("INSERT INTO alternative_names (geoname_id, alternative_name) VALUES (?, ?)",
                                (geoname_id, alt_name.strip()))

    conn.commit()
    conn.close()
    print("Data successfully loaded.")

if __name__ == "__main__":
    create_db()
    load_data()
