from sqlalchemy import Boolean, Column, Integer, String, Date, DateTime, Text, ForeignKey, Float
from sqlalchemy.orm import relationship
from .database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=False)
    is_verified = Column(Boolean, default=False)
    password_reset_token = Column(String, nullable=True)
    password_reset_token_expires = Column(DateTime, nullable=True)
    birthdate = Column(Date, nullable=True)
    is_salaried = Column(Boolean, default=False)
    address = Column(String, nullable=True)


class TournamentImage(Base):
    __tablename__ = "tournament_images"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    image_path = Column(String, nullable=False)
    description = Column(String, nullable=True)
    upload_date = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)


class TournamentSchedule(Base):
    __tablename__ = "tournament_schedules"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False)
    time = Column(String, nullable=False)  # Stored as string for flexibility
    category = Column(String, nullable=False)
    round = Column(String, nullable=False)
    court = Column(String, nullable=False)
    players = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Tournament(Base):
    __tablename__ = "tournaments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    location = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    results = relationship("TournamentResult", back_populates="tournament")


class TournamentResult(Base):
    __tablename__ = "tournament_results"

    id = Column(Integer, primary_key=True, index=True)
    tournament_id = Column(Integer, ForeignKey("tournaments.id"))
    category = Column(String, nullable=False)
    winner = Column(String, nullable=False)
    runner_up = Column(String, nullable=False)
    score = Column(String, nullable=False)
    date = Column(Date, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    tournament = relationship("Tournament", back_populates="results")


class NewsArticle(Base):
    __tablename__ = "news_articles"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    summary = Column(String, nullable=True)
    image_path = Column(String, nullable=True)
    category = Column(String, nullable=False)
    author = Column(String, nullable=False)
    is_featured = Column(Boolean, default=False)
    publication_date = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class NewsletterSubscriber(Base):
    __tablename__ = "newsletter_subscribers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    player_category = Column(String, nullable=True)
    interests = Column(String, nullable=True)  # Stored as comma-separated values
    is_active = Column(Boolean, default=True)
    subscription_date = Column(DateTime, default=datetime.utcnow)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
