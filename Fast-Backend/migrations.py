"""
Migration script to add new fields to the User table.
Run this script to update your database schema.
"""

from app.database import engine
from sqlalchemy import text

def run_migrations():
    # Add new columns to the users table
    with engine.connect() as connection:
        try:
            # Add birthdate column
            connection.execute(text("""
                ALTER TABLE users 
                ADD COLUMN IF NOT EXISTS birthdate DATE,
                ADD COLUMN IF NOT EXISTS is_salaried BOOLEAN DEFAULT FALSE,
                ADD COLUMN IF NOT EXISTS address VARCHAR;
            """))
            connection.commit()
            print("Migration completed successfully!")
        except Exception as e:
            print(f"Error during migration: {e}")
            raise

if __name__ == "__main__":
    run_migrations()
