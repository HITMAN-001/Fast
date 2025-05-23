# Import cache configuration first
import sys
import os

# Add parent directory to path to import pycache_config
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
import pycache_config

from sqlalchemy import create_engine, text
from app.database import SQLALCHEMY_DATABASE_URL
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_db():
    try:
        # Create engine without checking tables
        engine = create_engine(SQLALCHEMY_DATABASE_URL)
        
        # SQL to create the users table
        create_table_sql = """
        DROP TABLE IF EXISTS users;
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            hashed_password VARCHAR(255) NOT NULL,
            is_active BOOLEAN DEFAULT FALSE,
            is_verified BOOLEAN DEFAULT FALSE,
            verification_token VARCHAR(255),
            verification_token_expires TIMESTAMP,
            password_reset_token VARCHAR(255),
            password_reset_token_expires TIMESTAMP,
            birthdate DATE,
            is_salaried BOOLEAN DEFAULT FALSE,
            address VARCHAR(255)
        );
        """
        
        # Execute the SQL
        with engine.connect() as conn:
            conn.execute(text(create_table_sql))
            conn.commit()
        
        logger.info("Database tables created successfully!")
        return True
    except Exception as e:
        logger.error(f"Error creating database tables: {str(e)}")
        return False

if __name__ == "__main__":
    init_db()
