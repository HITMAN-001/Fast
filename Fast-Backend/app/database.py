from sqlalchemy import create_engine, event
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/fastapi_db"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Set search_path for all connections
@event.listens_for(engine, 'connect')
def set_search_path(dbapi_connection, connection_record):
    with dbapi_connection.cursor() as cursor:
        cursor.execute('SET search_path TO public')

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
