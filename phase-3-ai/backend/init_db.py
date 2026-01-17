from sqlmodel import SQLModel
import sys
import os

# Add the parent directory to path to access the database models
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # phase-3-ai directory
sys.path.insert(0, parent_dir)

# Import settings and models
from core.config import settings
from database.models import Conversation, Message, Task, AgentSession  # Import all models used by AI backend

# Import and initialize database engine using the same approach as main.py
import importlib.util
db_module_path = os.path.join(os.path.dirname(__file__), 'database', 'database.py')
spec = importlib.util.spec_from_file_location("backend_database", db_module_path)
db_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(db_module)

# Initialize the engine with settings
db_module.initialize_engine(settings)
engine = db_module.engine

def init_db():
    """Initialize the database and create tables for the AI backend."""
    SQLModel.metadata.create_all(engine)

if __name__ == "__main__":
    init_db()
    print("Database tables for AI backend created successfully!")