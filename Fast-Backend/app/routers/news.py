from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import os

from .. import crud_news, schemas, models
from ..database import get_db
from ..dependencies import get_current_user
from ..utils import save_upload_file

router = APIRouter(
    prefix="/news",
    tags=["news"],
    responses={404: {"description": "Not found"}},
)



# News Article endpoints
@router.post("/articles/", response_model=schemas.NewsArticle)
async def create_news_article(
    title: str = Form(...),
    content: str = Form(...),
    summary: Optional[str] = Form(None),
    category: str = Form(...),
    author: str = Form(...),
    is_featured: bool = Form(False),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user)
):
    # Save the uploaded image if provided
    image_path = None
    if image:
        image_path = await save_upload_file(image, "news_images")
    
    # Create the news article record
    article_data = schemas.NewsArticleCreate(
        title=title,
        content=content,
        summary=summary,
        category=category,
        author=author,
        is_featured=is_featured,
        image_path=image_path
    )
    return crud_news.create_news_article(db=db, article=article_data)

@router.get("/articles/", response_model=List[schemas.NewsArticle])
def read_news_articles(
    skip: int = 0, 
    limit: int = 100, 
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    articles = crud_news.get_news_articles(db, skip=skip, limit=limit, category=category)
    return articles

@router.get("/articles/featured/", response_model=List[schemas.NewsArticle])
def read_featured_news_articles(
    limit: int = 5, 
    db: Session = Depends(get_db)
):
    articles = crud_news.get_featured_news_articles(db, limit=limit)
    return articles

@router.get("/articles/search/", response_model=List[schemas.NewsArticle])
def search_news_articles(
    q: str = Query(..., min_length=3),
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    articles = crud_news.search_news_articles(db, search_term=q, skip=skip, limit=limit)
    return articles

@router.get("/articles/{article_id}", response_model=schemas.NewsArticle)
def read_news_article(
    article_id: int, 
    db: Session = Depends(get_db)
):
    db_article = crud_news.get_news_article(db, article_id=article_id)
    if db_article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    return db_article

@router.put("/articles/{article_id}", response_model=schemas.NewsArticle)
async def update_news_article(
    article_id: int,
    title: str = Form(...),
    content: str = Form(...),
    summary: Optional[str] = Form(None),
    category: str = Form(...),
    author: str = Form(...),
    is_featured: bool = Form(False),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user)
):
    db_article = crud_news.get_news_article(db, article_id=article_id)
    if db_article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    
    # Save the uploaded image if provided
    image_path = db_article.image_path
    if image:
        # Delete old image if it exists
        if db_article.image_path:
            try:
                old_image_path = os.path.join("static", db_article.image_path)
                if os.path.exists(old_image_path):
                    os.remove(old_image_path)
            except Exception as e:
                print(f"Error deleting old image: {e}")
        
        # Save new image
        image_path = await save_upload_file(image, "news_images")
    
    # Update the article record
    article_data = schemas.NewsArticleUpdate(
        title=title,
        content=content,
        summary=summary,
        category=category,
        author=author,
        is_featured=is_featured,
        image_path=image_path
    )
    return crud_news.update_news_article(db=db, article_id=article_id, article_data=article_data)

@router.delete("/articles/{article_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_news_article(
    article_id: int, 
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user)
):
    db_article = crud_news.get_news_article(db, article_id=article_id)
    if db_article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    
    # Delete the image file if it exists
    if db_article.image_path:
        try:
            file_path = os.path.join("static", db_article.image_path)
            if os.path.exists(file_path):
                os.remove(file_path)
        except Exception as e:
            # Log the error but continue with database deletion
            print(f"Error deleting file: {e}")
    
    # Delete from database
    crud_news.delete_news_article(db=db, article_id=article_id)
    return None

# Newsletter Subscriber endpoints
@router.post("/newsletter/subscribe/", response_model=schemas.NewsletterSubscriber)
def subscribe_to_newsletter(
    subscriber: schemas.NewsletterSubscriberCreate, 
    db: Session = Depends(get_db)
):
    db_subscriber = crud_news.create_newsletter_subscriber(db=db, subscriber=subscriber)
    if db_subscriber is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already subscribed"
        )
    return db_subscriber

@router.get("/newsletter/subscribers/", response_model=List[schemas.NewsletterSubscriber])
def read_newsletter_subscribers(
    skip: int = 0, 
    limit: int = 100, 
    active_only: bool = True,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user)
):
    subscribers = crud_news.get_newsletter_subscribers(db, skip=skip, limit=limit, active_only=active_only)
    return subscribers

@router.get("/newsletter/subscribers/{subscriber_id}", response_model=schemas.NewsletterSubscriber)
def read_newsletter_subscriber(
    subscriber_id: int, 
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user)
):
    db_subscriber = crud_news.get_newsletter_subscriber(db, subscriber_id=subscriber_id)
    if db_subscriber is None:
        raise HTTPException(status_code=404, detail="Subscriber not found")
    return db_subscriber

@router.put("/newsletter/subscribers/{subscriber_id}", response_model=schemas.NewsletterSubscriber)
def update_newsletter_subscriber(
    subscriber_id: int, 
    subscriber: schemas.NewsletterSubscriberUpdate, 
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user)
):
    db_subscriber = crud_news.get_newsletter_subscriber(db, subscriber_id=subscriber_id)
    if db_subscriber is None:
        raise HTTPException(status_code=404, detail="Subscriber not found")
    return crud_news.update_newsletter_subscriber(db=db, subscriber_id=subscriber_id, subscriber_data=subscriber)

@router.post("/newsletter/unsubscribe/{email}")
def unsubscribe_from_newsletter(
    email: str, 
    db: Session = Depends(get_db)
):
    success = crud_news.unsubscribe_newsletter(db=db, email=email)
    if not success:
        raise HTTPException(status_code=404, detail="Email not found in subscription list")
    return {"message": "Successfully unsubscribed"}

@router.delete("/newsletter/subscribers/{subscriber_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_newsletter_subscriber(
    subscriber_id: int, 
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user)
):
    db_subscriber = crud_news.get_newsletter_subscriber(db, subscriber_id=subscriber_id)
    if db_subscriber is None:
        raise HTTPException(status_code=404, detail="Subscriber not found")
    crud_news.update_newsletter_subscriber(
        db=db, 
        subscriber_id=subscriber_id, 
        subscriber_data=schemas.NewsletterSubscriberUpdate(
            name=db_subscriber.name,
            email=db_subscriber.email,
            player_category=db_subscriber.player_category,
            interests=db_subscriber.interests,
            is_active=False
        )
    )
    return None
