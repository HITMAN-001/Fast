import sqlite3
import os
from pathlib import Path

def run_migrations():
    """Add password reset token fields to the users table"""
    # Get the database path
    db_path = Path(__file__).parent / "fast.db"
    
    if not os.path.exists(db_path):
        print(f"Database file not found at {db_path}")
        return
    
    try:
        # Connect to the database
        connection = sqlite3.connect(db_path)
        cursor = connection.cursor()
        
        # Check if password_reset_token column exists
        cursor.execute("PRAGMA table_info(users)")
        columns = cursor.fetchall()
        column_names = [column[1] for column in columns]
        
        # Add password_reset_token column if it doesn't exist
        if "password_reset_token" not in column_names:
            print("Adding password_reset_token column...")
            cursor.execute("ALTER TABLE users ADD COLUMN password_reset_token TEXT")
        
        # Add password_reset_token_expires column if it doesn't exist
        if "password_reset_token_expires" not in column_names:
            print("Adding password_reset_token_expires column...")
            cursor.execute("ALTER TABLE users ADD COLUMN password_reset_token_expires TIMESTAMP")
        
        connection.commit()
        print("Migration completed successfully!")
    except Exception as e:
        print(f"Error during migration: {e}")
        raise
    finally:
        connection.close()

if __name__ == "__main__":
    run_migrations()
