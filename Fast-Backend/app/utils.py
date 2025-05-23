import os
import shutil
from uuid import uuid4
from fastapi import UploadFile

async def save_upload_file(upload_file: UploadFile, folder: str):
    """Saves an uploaded file to a specified folder within 'static' 
    and returns the relative path.

    Args:
        upload_file: The file to save, from FastAPI's UploadFile.
        folder: The subfolder within 'static' (e.g., 'news_images').

    Returns:
        The relative path to the saved file (e.g., 'news_images/unique_name.ext').
    """
    # Ensure the base static directory and the specific upload directory exist.
    # main.py also creates these, but this ensures the function is self-contained if used elsewhere.
    base_static_dir = "static"
    upload_dir = os.path.join(base_static_dir, folder)
    os.makedirs(upload_dir, exist_ok=True)
    
    # Generate unique filename to prevent overwrites and ensure clean names.
    file_extension = os.path.splitext(upload_file.filename)[1]
    unique_filename = f"{uuid4()}{file_extension}"
    file_path = os.path.join(upload_dir, unique_filename)
    
    # Save the file
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(upload_file.file, buffer)
    finally:
        await upload_file.close() # Important: Close the uploaded file resource.
    
    # Return the relative path suitable for storing in DB or generating URLs
    return os.path.join(folder, unique_filename)
