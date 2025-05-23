import sqlite3
import os
from pathlib import Path

def run_migrations():
    """Update all existing users to be verified and active"""
    # Get the database path
    db_path = Path(__file__).parent / "fast.db"
    
    if not os.path.exists(db_path):
        print(f"Database file not found at {db_path}")
        return
    
    try:
        # Connect to the database
        connection = sqlite3.connect(db_path)
        cursor = connection.cursor()
        
        # Update all users to be verified and active
        cursor.execute("""
            UPDATE users
            SET is_verified = 1, is_active = 1
            WHERE 1=1;
        """)
        
        # Get the count of updated rows
        updated_rows = cursor.rowcount
        
        connection.commit()
        print(f"Migration completed successfully! {updated_rows} users updated.")
    except Exception as e:
        print(f"Error during migration: {e}")
        raise
    finally:
        connection.close()

if __name__ == "__main__":
    run_migrations()
