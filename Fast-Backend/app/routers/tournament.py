from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
import os

from .. import crud_tournament, schemas, models
from ..database import get_db
from ..dependencies import get_current_user
from ..utils import save_upload_file

router = APIRouter(
    prefix="/tournament",
    tags=["tournament"],
    responses={404: {"description": "Not found"}},
)



# Tournament Image endpoints
@router.post("/images/", response_model=schemas.TournamentImage)
async def create_tournament_image(
    title: str = Form(...),
    description: Optional[str] = Form(None),
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user)
):
    # Save the uploaded image
    image_path = await save_upload_file(image, "tournament_images")
    
    # Create the tournament image record
    image_data = schemas.TournamentImageCreate(
        title=title,
        description=description,
        image_path=image_path
    )
    return crud_tournament.create_tournament_image(db=db, image=image_data)

@router.get("/images/", response_model=List[schemas.TournamentImage])
def read_tournament_images(
    skip: int = 0, 
    limit: int = 100, 
    active_only: bool = True,
    db: Session = Depends(get_db)
):
    images = crud_tournament.get_tournament_images(db, skip=skip, limit=limit, active_only=active_only)
    return images

@router.get("/images/{image_id}", response_model=schemas.TournamentImage)
def read_tournament_image(
    image_id: int, 
    db: Session = Depends(get_db)
):
    db_image = crud_tournament.get_tournament_image(db, image_id=image_id)
    if db_image is None:
        raise HTTPException(status_code=404, detail="Image not found")
    return db_image

@router.put("/images/{image_id}", response_model=schemas.TournamentImage)
async def update_tournament_image(
    image_id: int,
    title: str = Form(...),
    description: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user)
):
    db_image = crud_tournament.get_tournament_image(db, image_id=image_id)
    if db_image is None:
        raise HTTPException(status_code=404, detail="Image not found")
    
    # If a new image is provided, save it
    image_path = db_image.image_path
    if image:
        image_path = await save_upload_file(image, "tournament_images")
    
    # Update the image record
    image_data = schemas.TournamentImageCreate(
        title=title,
        description=description,
        image_path=image_path
    )
    return crud_tournament.update_tournament_image(db=db, image_id=image_id, image_data=image_data)

@router.delete("/images/{image_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_tournament_image(
    image_id: int, 
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user)
):
    db_image = crud_tournament.get_tournament_image(db, image_id=image_id)
    if db_image is None:
        raise HTTPException(status_code=404, detail="Image not found")
    
    # Delete the image file if it exists
    try:
        file_path = os.path.join("static", db_image.image_path)
        if os.path.exists(file_path):
            os.remove(file_path)
    except Exception as e:
        # Log the error but continue with database deletion
        print(f"Error deleting file: {e}")
    
    # Delete from database
    crud_tournament.delete_tournament_image(db=db, image_id=image_id)
    return None

# Tournament Schedule endpoints
@router.post("/schedules/", response_model=schemas.TournamentSchedule)
def create_tournament_schedule(
    schedule: schemas.TournamentScheduleCreate, 
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user)
):
    return crud_tournament.create_tournament_schedule(db=db, schedule=schedule)

@router.get("/schedules/", response_model=List[schemas.TournamentSchedule])
def read_tournament_schedules(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    schedules = crud_tournament.get_tournament_schedules(db, skip=skip, limit=limit)
    return schedules

@router.get("/schedules/by-date/{date}", response_model=List[schemas.TournamentSchedule])
def read_tournament_schedules_by_date(
    date: date, 
    db: Session = Depends(get_db)
):
    schedules = crud_tournament.get_tournament_schedules_by_date(db, date=date)
    return schedules

@router.get("/schedules/{schedule_id}", response_model=schemas.TournamentSchedule)
def read_tournament_schedule(
    schedule_id: int, 
    db: Session = Depends(get_db)
):
    db_schedule = crud_tournament.get_tournament_schedule(db, schedule_id=schedule_id)
    if db_schedule is None:
        raise HTTPException(status_code=404, detail="Schedule not found")
    return db_schedule

@router.put("/schedules/{schedule_id}", response_model=schemas.TournamentSchedule)
def update_tournament_schedule(
    schedule_id: int, 
    schedule: schemas.TournamentScheduleUpdate, 
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user)
):
    db_schedule = crud_tournament.get_tournament_schedule(db, schedule_id=schedule_id)
    if db_schedule is None:
        raise HTTPException(status_code=404, detail="Schedule not found")
    return crud_tournament.update_tournament_schedule(db=db, schedule_id=schedule_id, schedule_data=schedule)

@router.delete("/schedules/{schedule_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_tournament_schedule(
    schedule_id: int, 
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user)
):
    db_schedule = crud_tournament.get_tournament_schedule(db, schedule_id=schedule_id)
    if db_schedule is None:
        raise HTTPException(status_code=404, detail="Schedule not found")
    crud_tournament.delete_tournament_schedule(db=db, schedule_id=schedule_id)
    return None

# Tournament endpoints
@router.post("/", response_model=schemas.Tournament)
def create_tournament(
    tournament: schemas.TournamentCreate, 
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user)
):
    return crud_tournament.create_tournament(db=db, tournament=tournament)

@router.get("/", response_model=List[schemas.Tournament])
def read_tournaments(
    skip: int = 0, 
    limit: int = 100, 
    active_only: bool = True,
    db: Session = Depends(get_db)
):
    tournaments = crud_tournament.get_tournaments(db, skip=skip, limit=limit, active_only=active_only)
    return tournaments

@router.get("/{tournament_id}", response_model=schemas.Tournament)
def read_tournament(
    tournament_id: int, 
    db: Session = Depends(get_db)
):
    db_tournament = crud_tournament.get_tournament(db, tournament_id=tournament_id)
    if db_tournament is None:
        raise HTTPException(status_code=404, detail="Tournament not found")
    return db_tournament

@router.put("/{tournament_id}", response_model=schemas.Tournament)
def update_tournament(
    tournament_id: int, 
    tournament: schemas.TournamentUpdate, 
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user)
):
    db_tournament = crud_tournament.get_tournament(db, tournament_id=tournament_id)
    if db_tournament is None:
        raise HTTPException(status_code=404, detail="Tournament not found")
    return crud_tournament.update_tournament(db=db, tournament_id=tournament_id, tournament_data=tournament)

@router.delete("/{tournament_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_tournament(
    tournament_id: int, 
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user)
):
    db_tournament = crud_tournament.get_tournament(db, tournament_id=tournament_id)
    if db_tournament is None:
        raise HTTPException(status_code=404, detail="Tournament not found")
    crud_tournament.delete_tournament(db=db, tournament_id=tournament_id)
    return None

# Tournament Result endpoints
@router.post("/results/", response_model=schemas.TournamentResult)
def create_tournament_result(
    result: schemas.TournamentResultCreate, 
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user)
):
    # Verify the tournament exists
    db_tournament = crud_tournament.get_tournament(db, tournament_id=result.tournament_id)
    if db_tournament is None:
        raise HTTPException(status_code=404, detail="Tournament not found")
    return crud_tournament.create_tournament_result(db=db, result=result)

@router.get("/results/", response_model=List[schemas.TournamentResult])
def read_tournament_results(
    tournament_id: Optional[int] = None,
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    results = crud_tournament.get_tournament_results(db, tournament_id=tournament_id, skip=skip, limit=limit)
    return results

@router.get("/results/{result_id}", response_model=schemas.TournamentResult)
def read_tournament_result(
    result_id: int, 
    db: Session = Depends(get_db)
):
    db_result = crud_tournament.get_tournament_result(db, result_id=result_id)
    if db_result is None:
        raise HTTPException(status_code=404, detail="Tournament result not found")
    return db_result

@router.put("/results/{result_id}", response_model=schemas.TournamentResult)
def update_tournament_result(
    result_id: int, 
    result: schemas.TournamentResultUpdate, 
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user)
):
    # Verify the tournament exists
    db_tournament = crud_tournament.get_tournament(db, tournament_id=result.tournament_id)
    if db_tournament is None:
        raise HTTPException(status_code=404, detail="Tournament not found")
    
    db_result = crud_tournament.get_tournament_result(db, result_id=result_id)
    if db_result is None:
        raise HTTPException(status_code=404, detail="Tournament result not found")
    
    return crud_tournament.update_tournament_result(db=db, result_id=result_id, result_data=result)

@router.delete("/results/{result_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_tournament_result(
    result_id: int, 
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user)
):
    db_result = crud_tournament.get_tournament_result(db, result_id=result_id)
    if db_result is None:
        raise HTTPException(status_code=404, detail="Tournament result not found")
    crud_tournament.delete_tournament_result(db=db, result_id=result_id)
    return None
