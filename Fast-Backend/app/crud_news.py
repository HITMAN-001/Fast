from sqlalchemy.orm import Session
from datetime import datetime
from typing import List, Optional
from . import models, schemas

# News Article CRUD operations
def create_news_article(db: Session, article: schemas.NewsArticleCreate):
    db_article = models.NewsArticle(
        title=article.title,
        content=article.content,
        summary=article.summary,
        image_path=article.image_path,
        category=article.category,
        author=article.author,
        is_featured=article.is_featured,
        publication_date=datetime.utcnow()
    )
    db.add(db_article)
    db.commit()
    db.refresh(db_article)
    return db_article

def get_news_article(db: Session, article_id: int):
    return db.query(models.NewsArticle).filter(models.NewsArticle.id == article_id).first()

def get_news_articles(db: Session, skip: int = 0, limit: int = 100, category: Optional[str] = None):
    query = db.query(models.NewsArticle)
    if category:
        query = query.filter(models.NewsArticle.category == category)
    return query.order_by(models.NewsArticle.publication_date.desc()).offset(skip).limit(limit).all()

def get_featured_news_articles(db: Session, limit: int = 5):
    return db.query(models.NewsArticle).filter(models.NewsArticle.is_featured == True).order_by(models.NewsArticle.publication_date.desc()).limit(limit).all()

def search_news_articles(db: Session, search_term: str, skip: int = 0, limit: int = 100):
    search_pattern = f"%{search_term}%"
    return db.query(models.NewsArticle).filter(
        (models.NewsArticle.title.ilike(search_pattern)) | 
        (models.NewsArticle.content.ilike(search_pattern)) | 
        (models.NewsArticle.summary.ilike(search_pattern))
    ).order_by(models.NewsArticle.publication_date.desc()).offset(skip).limit(limit).all()

def update_news_article(db: Session, article_id: int, article_data: schemas.NewsArticleUpdate):
    db_article = get_news_article(db, article_id)
    if db_article:
        update_data = article_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_article, key, value)
        # db_article.updated_at will be handled by SQLAlchemy's onupdate
        db.commit()
        db.refresh(db_article)
    return db_article

def delete_news_article(db: Session, article_id: int):
    db_article = get_news_article(db, article_id)
    if db_article:
        db.delete(db_article)
        db.commit()
        return True
    return False

# Newsletter Subscriber CRUD operations
def create_newsletter_subscriber(db: Session, subscriber: schemas.NewsletterSubscriberCreate):
    # Check if email already exists
    existing_subscriber = db.query(models.NewsletterSubscriber).filter(
        models.NewsletterSubscriber.email == subscriber.email
    ).first()
    
    if existing_subscriber:
        # If subscriber exists but is inactive, reactivate them
        if not existing_subscriber.is_active:
            existing_subscriber.is_active = True
            existing_subscriber.name = subscriber.name
            existing_subscriber.player_category = subscriber.player_category
            existing_subscriber.interests = subscriber.interests
            existing_subscriber.last_updated = datetime.utcnow()
            db.commit()
            db.refresh(existing_subscriber)
            return existing_subscriber
        # If already active, return None to indicate duplicate
        return None
    
    # Create new subscriber
    db_subscriber = models.NewsletterSubscriber(
        name=subscriber.name,
        email=subscriber.email,
        player_category=subscriber.player_category,
        interests=subscriber.interests,
        is_active=True,
        subscription_date=datetime.utcnow()
    )
    db.add(db_subscriber)
    db.commit()
    db.refresh(db_subscriber)
    return db_subscriber

def get_newsletter_subscriber(db: Session, subscriber_id: int):
    return db.query(models.NewsletterSubscriber).filter(models.NewsletterSubscriber.id == subscriber_id).first()

def get_newsletter_subscriber_by_email(db: Session, email: str):
    return db.query(models.NewsletterSubscriber).filter(models.NewsletterSubscriber.email == email).first()

def get_newsletter_subscribers(db: Session, skip: int = 0, limit: int = 100, active_only: bool = True):
    query = db.query(models.NewsletterSubscriber)
    if active_only:
        query = query.filter(models.NewsletterSubscriber.is_active == True)
    return query.order_by(models.NewsletterSubscriber.subscription_date.desc()).offset(skip).limit(limit).all()

def update_newsletter_subscriber(db: Session, subscriber_id: int, subscriber_data: schemas.NewsletterSubscriberUpdate):
    db_subscriber = get_newsletter_subscriber(db, subscriber_id)
    if db_subscriber:
        update_data = subscriber_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_subscriber, key, value)
        # db_subscriber.last_updated will be handled by SQLAlchemy's onupdate
        db.commit()
        db.refresh(db_subscriber)
    return db_subscriber

def unsubscribe_newsletter(db: Session, email: str):
    db_subscriber = get_newsletter_subscriber_by_email(db, email)
    if db_subscriber:
        db_subscriber.is_active = False
        db_subscriber.last_updated = datetime.utcnow()
        db.commit()
        db.refresh(db_subscriber)
        return True
    return False
