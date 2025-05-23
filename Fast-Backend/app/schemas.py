from datetime import date, datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str
    birthdate: Optional[date] = None
    is_salaried: bool = False
    address: Optional[str] = None

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    password: Optional[str] = None # For changing password
    birthdate: Optional[date] = None
    is_salaried: Optional[bool] = None
    address: Optional[str] = None
    is_active: Optional[bool] = None # Allow admin to activate/deactivate

class UserLogin(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool
    is_verified: bool
    birthdate: Optional[date] = None
    is_salaried: bool
    address: Optional[str] = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class PasswordResetRequest(BaseModel):
    email: EmailStr

class PasswordReset(BaseModel):
    token: str
    new_password: str


# Tournament Image Schemas
class TournamentImageBase(BaseModel):
    title: str
    description: Optional[str] = None

class TournamentImageCreate(TournamentImageBase):
    image_path: str

class TournamentImage(TournamentImageBase):
    id: int
    image_path: str
    upload_date: datetime
    is_active: bool

    class Config:
        from_attributes = True


# Tournament Schedule Schemas
class TournamentScheduleBase(BaseModel):
    date: date
    time: str
    category: str
    round: str
    court: str
    players: str

class TournamentScheduleCreate(TournamentScheduleBase):
    pass

class TournamentScheduleUpdate(TournamentScheduleBase):
    pass

class TournamentSchedule(TournamentScheduleBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Tournament Schemas
class TournamentBase(BaseModel):
    name: str
    start_date: date
    end_date: date
    location: str
    description: Optional[str] = None

class TournamentCreate(TournamentBase):
    pass

class TournamentUpdate(TournamentBase):
    is_active: Optional[bool] = None

class Tournament(TournamentBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Tournament Result Schemas
class TournamentResultBase(BaseModel):
    tournament_id: int
    category: str
    winner: str
    runner_up: str
    score: str
    date: date

class TournamentResultCreate(TournamentResultBase):
    pass

class TournamentResultUpdate(TournamentResultBase):
    pass

class TournamentResult(TournamentResultBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# News Article Schemas
class NewsArticleBase(BaseModel):
    title: str
    content: str
    summary: Optional[str] = None
    category: str
    author: str

class NewsArticleCreate(NewsArticleBase):
    image_path: Optional[str] = None
    is_featured: bool = False

class NewsArticleUpdate(NewsArticleBase):
    image_path: Optional[str] = None
    is_featured: Optional[bool] = None

class NewsArticle(NewsArticleBase):
    id: int
    image_path: Optional[str] = None
    is_featured: bool
    publication_date: datetime
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Newsletter Subscriber Schemas
class NewsletterSubscriberBase(BaseModel):
    name: str
    email: EmailStr
    player_category: Optional[str] = None
    interests: Optional[str] = None

class NewsletterSubscriberCreate(NewsletterSubscriberBase):
    pass

class NewsletterSubscriberUpdate(NewsletterSubscriberBase):
    is_active: Optional[bool] = None

class NewsletterSubscriber(NewsletterSubscriberBase):
    id: int
    is_active: bool
    subscription_date: datetime
    last_updated: datetime

    class Config:
        from_attributes = True
