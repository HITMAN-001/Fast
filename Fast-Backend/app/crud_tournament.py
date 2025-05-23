from sqlalchemy.orm import Session
from datetime import datetime, date
from typing import List, Optional
from . import models, schemas

# Tournament Image CRUD operations
def create_tournament_image(db: Session, image: schemas.TournamentImageCreate):
    db_image = models.TournamentImage(
        title=image.title,
        image_path=image.image_path,
        description=image.description,
        upload_date=datetime.utcnow(),
        is_active=True
    )
    db.add(db_image)
    db.commit()
    db.refresh(db_image)
    return db_image

def get_tournament_image(db: Session, image_id: int):
    return db.query(models.TournamentImage).filter(models.TournamentImage.id == image_id).first()

def get_tournament_images(db: Session, skip: int = 0, limit: int = 100, active_only: bool = True):
    query = db.query(models.TournamentImage)
    if active_only:
        query = query.filter(models.TournamentImage.is_active == True)
    return query.offset(skip).limit(limit).all()

def update_tournament_image(db: Session, image_id: int, image_data: schemas.TournamentImageCreate): # Assuming TournamentImageUpdate schema might be similar or image_data is a Pydantic model
    db_image = get_tournament_image(db, image_id)
    if db_image:
        update_data = image_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_image, key, value)
        # Note: models.TournamentImage doesn't have an 'updated_at' with onupdate.
        # If modification time tracking is needed, it should be added to the model or handled here explicitly if desired.
        db.commit()
        db.refresh(db_image)
    return db_image

def delete_tournament_image(db: Session, image_id: int):
    db_image = get_tournament_image(db, image_id)
    if db_image:
        db.delete(db_image)
        db.commit()
        return True
    return False

# Tournament Schedule CRUD operations
def create_tournament_schedule(db: Session, schedule: schemas.TournamentScheduleCreate):
    db_schedule = models.TournamentSchedule(
        date=schedule.date,
        time=schedule.time,
        category=schedule.category,
        round=schedule.round,
        court=schedule.court,
        players=schedule.players
    )
    db.add(db_schedule)
    db.commit()
    db.refresh(db_schedule)
    return db_schedule

def get_tournament_schedule(db: Session, schedule_id: int):
    return db.query(models.TournamentSchedule).filter(models.TournamentSchedule.id == schedule_id).first()

def get_tournament_schedules(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.TournamentSchedule).order_by(models.TournamentSchedule.date).offset(skip).limit(limit).all()

def get_tournament_schedules_by_date(db: Session, date: date):
    return db.query(models.TournamentSchedule).filter(models.TournamentSchedule.date == date).all()

def update_tournament_schedule(db: Session, schedule_id: int, schedule_data: schemas.TournamentScheduleUpdate):
    db_schedule = get_tournament_schedule(db, schedule_id)
    if db_schedule:
        update_data = schedule_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_schedule, key, value)
        # db_schedule.updated_at will be handled by SQLAlchemy's onupdate
        db.commit()
        db.refresh(db_schedule)
    return db_schedule

def delete_tournament_schedule(db: Session, schedule_id: int):
    db_schedule = get_tournament_schedule(db, schedule_id)
    if db_schedule:
        db.delete(db_schedule)
        db.commit()
        return True
    return False

# Tournament CRUD operations
def create_tournament(db: Session, tournament: schemas.TournamentCreate):
    db_tournament = models.Tournament(
        name=tournament.name,
        start_date=tournament.start_date,
        end_date=tournament.end_date,
        location=tournament.location,
        description=tournament.description,
        is_active=True
    )
    db.add(db_tournament)
    db.commit()
    db.refresh(db_tournament)
    return db_tournament

def get_tournament(db: Session, tournament_id: int):
    return db.query(models.Tournament).filter(models.Tournament.id == tournament_id).first()

def get_tournaments(db: Session, skip: int = 0, limit: int = 100, active_only: bool = True):
    query = db.query(models.Tournament)
    if active_only:
        query = query.filter(models.Tournament.is_active == True)
    return query.order_by(models.Tournament.start_date.desc()).offset(skip).limit(limit).all()

def update_tournament(db: Session, tournament_id: int, tournament_data: schemas.TournamentUpdate):
    db_tournament = get_tournament(db, tournament_id)
    if db_tournament:
        update_data = tournament_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_tournament, key, value)
        # db_tournament.updated_at will be handled by SQLAlchemy's onupdate
        db.commit()
        db.refresh(db_tournament)
    return db_tournament

def delete_tournament(db: Session, tournament_id: int):
    db_tournament = get_tournament(db, tournament_id)
    if db_tournament:
        db.delete(db_tournament)
        db.commit()
        return True
    return False

# Tournament Result CRUD operations
def create_tournament_result(db: Session, result: schemas.TournamentResultCreate):
    db_result = models.TournamentResult(
        tournament_id=result.tournament_id,
        category=result.category,
        winner=result.winner,
        runner_up=result.runner_up,
        score=result.score,
        date=result.date
    )
    db.add(db_result)
    db.commit()
    db.refresh(db_result)
    return db_result

def get_tournament_result(db: Session, result_id: int):
    return db.query(models.TournamentResult).filter(models.TournamentResult.id == result_id).first()

def get_tournament_results(db: Session, tournament_id: Optional[int] = None, skip: int = 0, limit: int = 100):
    query = db.query(models.TournamentResult)
    if tournament_id:
        query = query.filter(models.TournamentResult.tournament_id == tournament_id)
    return query.order_by(models.TournamentResult.date.desc()).offset(skip).limit(limit).all()

def update_tournament_result(db: Session, result_id: int, result_data: schemas.TournamentResultUpdate):
    db_result = get_tournament_result(db, result_id)
    if db_result:
        update_data = result_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_result, key, value)
        # db_result.updated_at will be handled by SQLAlchemy's onupdate
        db.commit()
        db.refresh(db_result)
    return db_result

def delete_tournament_result(db: Session, result_id: int):
    db_result = get_tournament_result(db, result_id)
    if db_result:
        db.delete(db_result)
        db.commit()
        return True
    return False
