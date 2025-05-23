# Import cache configuration first
import sys
import os

# Add parent directory to path to import pycache_config
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import pycache_config

from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from . import models, schemas, crud, security, email_utils
from .database import engine, get_db
from datetime import timedelta
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Import routers
from .routers import tournament, news

# Create static directory if it doesn't exist
os.makedirs("static", exist_ok=True)
os.makedirs("static/tournament_images", exist_ok=True)
os.makedirs("static/news_images", exist_ok=True)

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files directory
app.mount("/static", StaticFiles(directory="static"), name="static")

# Include routers
app.include_router(tournament.router)
app.include_router(news.router)

# OAuth2 scheme for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/token")

# Import the get_current_user dependency
from .dependencies import get_current_user

@app.get("/")
def read_root():
    return {"message": "Work In Progress"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

# Register user
@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    try:
        logger.info(f"Registration attempt for email: {user.email}")
        
        # Check if email already exists
        db_user = crud.get_user_by_email(db, user.email)
        if db_user:
            logger.warning(f"Registration failed - email already exists: {user.email}")
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Simple email validation
        if '@' not in user.email or '.' not in user.email:
            logger.warning(f"Registration failed - invalid email format: {user.email}")
            raise HTTPException(status_code=400, detail="Invalid email format")
        
        # Create user (now automatically verified and active)
        new_user = crud.create_user(db=db, user=user)
        if not new_user:
            logger.error(f"Registration failed - user creation error: {user.email}")
            raise HTTPException(status_code=500, detail="Failed to create user")
        
        logger.info(f"User registered successfully: {user.email}")
        return new_user
        
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Unexpected error during registration: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred: {str(e)}"
        )

# The email verification endpoints have been removed as requested

# Login (token endpoint)
@app.post("/token", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, form_data.username)
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        logger.warning(f"Failed login attempt for email: {form_data.username}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Email verification check removed as requested
    
    access_token_expires = timedelta(minutes=security.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    logger.info(f"User logged in successfully: {form_data.username}")
    return {"access_token": access_token, "token_type": "bearer", "user_id": user.id}

# Get all users (protected)
@app.get("/users/", response_model=list[schemas.User])
def read_users(skip: int = 0, limit: int = 10, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    # Ensure we're getting the latest data
    db.commit()
    users = crud.get_users(db, skip=skip, limit=limit)
    return users

# Get user by ID (protected)
@app.get("/users/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

# Update user (protected)
@app.put("/users/{user_id}", response_model=schemas.User)
def update_user(user_id: int, user: schemas.UserUpdate, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    db_user = crud.update_user(db, user_id, user)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

# Request password reset
@app.post("/request-password-reset/")
async def request_password_reset(request: schemas.PasswordResetRequest, db: Session = Depends(get_db)):
    # Don't reveal if email exists for security reasons
    user = crud.get_user_by_email(db, request.email)
    if not user:
        logger.warning(f"Password reset requested for non-existent email: {request.email}")
        return {"message": "If your email is registered, a password reset link has been sent"}
    
    # Create password reset token
    reset_token = crud.create_password_reset_token(db, request.email)
    if not reset_token:
        return {"message": "Unable to create password reset token"}
    
    # Send password reset email
    email_sent = await email_utils.send_password_reset_email(
        email_to=request.email,
        reset_token=reset_token
    )
    
    if not email_sent:
        logger.error(f"Failed to send password reset email to {request.email}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send password reset email"
        )
    
    return {"message": "If your email is registered, a password reset link has been sent"}

# Reset password with token
@app.post("/reset-password/")
def reset_password(reset_data: schemas.PasswordReset, db: Session = Depends(get_db)):
    success = crud.reset_password(db, reset_data.token, reset_data.new_password)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired password reset token"
        )
    return {"message": "Password has been reset successfully"}

# Delete user (protected)
@app.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    success = crud.delete_user(db, user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return {"ok": True}
