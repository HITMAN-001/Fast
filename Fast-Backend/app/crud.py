from sqlalchemy.orm import Session
from . import models, schemas, security

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    # Ensure we're getting the latest data
    db.flush()
    users = db.query(models.User).offset(skip).limit(limit).all()
    return users

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = security.get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        hashed_password=hashed_password,
        birthdate=user.birthdate,
        is_salaried=user.is_salaried,
        address=user.address
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db: Session, user_id: int, user: schemas.UserCreate):
    db_user = get_user(db, user_id)
    if db_user:
        db_user.email = user.email
        db_user.hashed_password = security.get_password_hash(user.password)
        db_user.birthdate = user.birthdate
        db_user.is_salaried = user.is_salaried
        db_user.address = user.address
        db.commit()
        db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: int):
    db_user = get_user(db, user_id)
    if db_user:
        db.delete(db_user)
        db.commit()
        return True
    return False
