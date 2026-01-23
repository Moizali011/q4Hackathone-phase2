from sqlmodel import SQLModel
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.database import engine
from models.user import User
from models.task import Task

def init_db():
    """Initialize the database and create tables."""
    SQLModel.metadata.create_all(engine)

if __name__ == "__main__":
    init_db()