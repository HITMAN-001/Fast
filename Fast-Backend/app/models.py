from sqlalchemy import Boolean, Column, Integer, String, Date
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    birthdate = Column(Date, nullable=True)
    is_salaried = Column(Boolean, default=False)
    address = Column(String, nullable=True)
