"""
Migration script to add email verification fields to the User table.
Run this script to update your database schema.
"""

from app.database import engine
from sqlalchemy import text

def run_migrations():
    # Add new columns to the users table
    with engine.connect() as connection:
        try:
            # Add email verification columns
            connection.execute(text("""
                ALTER TABLE users 
                ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE,
                ADD COLUMN IF NOT EXISTS verification_token VARCHAR,
                ADD COLUMN IF NOT EXISTS verification_token_expires TIMESTAMP;
            """))
            
            # Update existing users to be verified
            connection.execute(text("""
                UPDATE users 
                SET is_verified = TRUE 
                WHERE is_verified IS NULL;
            """))
            
            connection.commit()
            print("Migration completed successfully!")
        except Exception as e:
            print(f"Error during migration: {e}")
            raise

if __name__ == "__main__":
    run_migrations() 