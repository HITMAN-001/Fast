from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pathlib import Path
from typing import List, Dict, Any, Optional
from jinja2 import Environment, FileSystemLoader
import os
from dotenv import load_dotenv
import logging
from fastapi import HTTPException

load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Email configuration
conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME", "your-email@gmail.com"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD", "your-app-password"),
    MAIL_FROM=os.getenv("MAIL_FROM", "your-email@gmail.com"),
    MAIL_PORT=int(os.getenv("MAIL_PORT", 587)),
    MAIL_SERVER=os.getenv("MAIL_SERVER", "smtp.gmail.com"),
    MAIL_FROM_NAME=os.getenv("MAIL_FROM_NAME", "MKTA Tennis Academy"),
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    TEMPLATE_FOLDER=Path(__file__).parent / 'templates'
)

# Initialize Jinja2 environment
template_loader = FileSystemLoader(searchpath=str(Path(__file__).parent / 'templates'))
template_env = Environment(loader=template_loader)

# Get frontend URL from environment or use default
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

# Get backend URL from environment or use default
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")

async def send_email(email_to: str, subject: str, template_name: str, template_data: Dict[str, Any]) -> bool:
    """Generic function to send emails with templates"""
    try:
        # Load and render email template
        template = template_env.get_template(f'{template_name}.html')
        html_content = template.render(**template_data)
        
        # Create message
        message = MessageSchema(
            subject=subject,
            recipients=[email_to],
            body=html_content,
            subtype="html"
        )
        
        # Send email
        fm = FastMail(conf)
        await fm.send_message(message)
        logger.info(f"Email sent successfully to {email_to}")
        return True
    except Exception as e:
        logger.error(f"Failed to send email to {email_to}: {str(e)}")
        return False

async def send_verification_email(email_to: str, verification_token: str) -> bool:
    """Send verification email to user"""
    try:
        # Create verification link - use backend URL for direct verification
        # This allows users to verify by just clicking the link
        verification_link = f"{BACKEND_URL}/verify-email/{verification_token}"
        
        # Also create a frontend link as a backup
        frontend_verification_link = f"{FRONTEND_URL}/verify-email/{verification_token}"
        
        logger.info(f"Sending verification email to {email_to} with token {verification_token[:10]}...")
        
        template_data = {
            "verification_link": verification_link,
            "frontend_verification_link": frontend_verification_link,
            "user_email": email_to
        }
        
        return await send_email(
            email_to=email_to,
            subject="Verify your email address",
            template_name="verification_email",
            template_data=template_data
        )
    except Exception as e:
        logger.error(f"Error in send_verification_email: {str(e)}")
        return False

async def send_password_reset_email(email_to: str, reset_token: str) -> bool:
    """Send password reset email to user"""
    # Create reset link - use frontend URL
    reset_link = f"{FRONTEND_URL}/reset-password/{reset_token}"
    
    template_data = {
        "reset_link": reset_link,
        "user_email": email_to
    }
    
    return await send_email(
        email_to=email_to,
        subject="Reset your password",
        template_name="password_reset_email",
        template_data=template_data
    )