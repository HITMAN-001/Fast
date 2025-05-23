from sqlalchemy import create_engine, event, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import SQLAlchemyError
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

SQLALCHEMY_DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/fastapi_db"

try:
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        pool_pre_ping=True,  # Enable connection health checks
        pool_size=5,         # Set a reasonable pool size
        max_overflow=10      # Allow up to 10 connections beyond pool_size
    )
    # Test the connection
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
    logger.info("Successfully connected to the database")
except SQLAlchemyError as e:
    logger.error(f"Database connection error: {str(e)}")
    raise

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Set search_path for all connections
@event.listens_for(engine, 'connect')
def set_search_path(dbapi_connection, connection_record):
    try:
        with dbapi_connection.cursor() as cursor:
            cursor.execute('SET search_path TO public')
    except Exception as e:
        logger.error(f"Error setting search_path: {str(e)}")
        raise

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
