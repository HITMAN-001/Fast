from datetime import date
from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    email: EmailStr
    birthdate: date | None = None
    is_salaried: bool = False
    address: str | None = None

class UserCreate(UserBase):
    password: str

class UserLogin(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: str | None = None
