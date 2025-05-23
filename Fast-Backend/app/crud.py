from sqlalchemy.orm import Session
from . import models, schemas, security
from datetime import datetime, timedelta
import secrets
import logging

logger = logging.getLogger(__name__)

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    users = db.query(models.User).offset(skip).limit(limit).all()
    return users

def create_user(db: Session, user: schemas.UserCreate):
    try:
        logger.info(f"Attempting to create user with email: {user.email}")
        
        # Email validation is handled by Pydantic's EmailStr in schemas.UserCreate
        
        # Check if user already exists
        existing_user = get_user_by_email(db, user.email)
        if existing_user:
            logger.error(f"User with email {user.email} already exists")
            return None # Return None, main.py's endpoint will raise HTTPException
        
        hashed_password = security.get_password_hash(user.password)
        db_user = models.User(
            email=user.email,
            hashed_password=hashed_password,
            is_verified=True, # Assuming email verification is deprecated as per main.py comment
            is_active=True
        )
        
        # Add optional fields if provided in UserCreate schema
        if user.birthdate:
            db_user.birthdate = user.birthdate
        # is_salaried has a default in UserCreate, so it will always be present
        db_user.is_salaried = user.is_salaried 
        if user.address:
            db_user.address = user.address
            
        logger.info(f"Adding user to database: {user.email}")
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        logger.info(f"Created new user: {user.email}")
        return db_user
    except Exception as e:
        logger.error(f"Error creating user {user.email}: {str(e)}")
        db.rollback()
        return None # Return None, main.py's endpoint will raise HTTPException

def update_user(db: Session, user_id: int, user_update: schemas.UserUpdate):
    db_user = get_user(db, user_id)
    if not db_user:
        return None

    update_data = user_update.model_dump(exclude_unset=True)

    if "password" in update_data and update_data["password"]:
        hashed_password = security.get_password_hash(update_data["password"])
        db_user.hashed_password = hashed_password
        # Remove password from update_data to avoid direct assignment later
        del update_data["password"]

    for field, value in update_data.items():
        setattr(db_user, field, value)
    
    db.commit()
    db.refresh(db_user)
    logger.info(f"User {user_id} updated successfully.")
    return db_user

def create_password_reset_token(db: Session, email: str):
    """Create a password reset token for a user"""
    user = get_user_by_email(db, email)
    if not user:
        logger.warning(f"Password reset requested for non-existent email: {email}")
        return None
    
    # Generate reset token
    reset_token = secrets.token_urlsafe(32)
    token_expires = datetime.utcnow() + timedelta(hours=1)  # Shorter expiry for security
    
    user.password_reset_token = reset_token
    user.password_reset_token_expires = token_expires
    db.commit()
    db.refresh(user)
    logger.info(f"Password reset token created for user: {email}")
    return reset_token

def verify_password_reset_token(db: Session, token: str):
    """Verify if a password reset token is valid"""
    user = db.query(models.User).filter(
        models.User.password_reset_token == token,
        models.User.password_reset_token_expires > datetime.utcnow()
    ).first()
    
    return user

def reset_password(db: Session, token: str, new_password: str):
    """Reset a user's password using a valid token"""
    user = verify_password_reset_token(db, token)
    if not user:
        logger.warning(f"Invalid or expired password reset token: {token}")
        return False
    
    user.hashed_password = security.get_password_hash(new_password)
    user.password_reset_token = None
    user.password_reset_token_expires = None
    db.commit()
    db.refresh(user)
    logger.info(f"Password reset successful for user: {user.email}")
    return True

def delete_user(db: Session, user_id: int):
    db_user = get_user(db, user_id)
    if db_user:
        db.delete(db_user)
        db.commit()
        logger.info(f"User deleted: {db_user.email}")
        return True
    logger.warning(f"Attempted to delete non-existent user ID: {user_id}")
    return False
