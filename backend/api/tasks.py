from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List
from database.database import get_session
from models.task import Task, TaskCreate, TaskUpdate
from schemas.task import TaskRead
from auth.dependencies import get_current_user
import uuid

router = APIRouter()

@router.get("/", response_model=List[TaskRead])
def get_tasks(
    current_user: dict = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Get all tasks for the current user."""
    user_id = current_user["user_id"]

    # Query tasks filtered by user_id to ensure user can only access their own tasks
    # Convert user_id to string to match the database format
    tasks = session.exec(
        select(Task).where(Task.user_id == str(user_id))
    ).all()

    return tasks


@router.post("/", response_model=TaskRead)
def create_task(
    task: TaskCreate,
    current_user: dict = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Create a new task for the current user."""
    user_id = current_user["user_id"]

    # Create task with the authenticated user's ID
    # Convert user_id to string to match the database format
    db_task = Task(
        **task.dict(),
        user_id=str(user_id)
    )

    session.add(db_task)
    session.commit()
    session.refresh(db_task)

    return db_task


@router.get("/{task_id}", response_model=TaskRead)
def get_task(
    task_id: str,  # Changed from UUID to str to handle string IDs properly
    current_user: dict = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Get a specific task by ID."""
    user_id = current_user["user_id"]

    # Query for the task with the given ID that belongs to the current user
    task = session.exec(
        select(Task).where(Task.id == str(task_id), Task.user_id == str(user_id))
    ).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found or you don't have permission to access it"
        )

    return task


@router.put("/{task_id}", response_model=TaskRead)
def update_task(
    task_id: str,  # Changed from UUID to str to handle string IDs properly
    task_update: TaskUpdate,
    current_user: dict = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Update a specific task by ID."""
    user_id = current_user["user_id"]

    # Find the task that belongs to the current user
    db_task = session.exec(
        select(Task).where(Task.id == str(task_id), Task.user_id == str(user_id))
    ).first()

    if not db_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found or you don't have permission to update it"
        )

    # Update the task with the provided values
    update_data = task_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_task, field, value)

    session.add(db_task)
    session.commit()
    session.refresh(db_task)

    return db_task


@router.delete("/{task_id}")
def delete_task(
    task_id: str,  # Changed from UUID to str to handle string IDs properly
    current_user: dict = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Delete a specific task by ID."""
    user_id = current_user["user_id"]

    # Find the task that belongs to the current user
    task = session.exec(
        select(Task).where(Task.id == str(task_id), Task.user_id == str(user_id))
    ).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found or you don't have permission to delete it"
        )

    session.delete(task)
    session.commit()

    return {"success": True}