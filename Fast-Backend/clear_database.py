"""
Utility script to clear all tables in the PostgreSQL database used by Fast-Backend.
USAGE: Run this script directly with your Python interpreter.
"""

from app.database import SessionLocal
from app.models import User  # Import your models

def clear_all_tables():
    db = SessionLocal()
    try:
        # Delete all users
        db.query(User).delete()
        db.commit()
        print("All tables cleared successfully.")
    except Exception as e:
        db.rollback()
        print(f"Error while clearing tables: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    clear_all_tables()
