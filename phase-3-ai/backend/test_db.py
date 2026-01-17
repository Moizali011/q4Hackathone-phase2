import sys
import os

# Add the parent directory to path to access the database models
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # phase-3-ai directory
sys.path.insert(0, parent_dir)

# Import the same components used in main.py
from database.models import Conversation, Message, Task
from core.config import settings

# Import database session using the same approach as main.py
import importlib.util
db_module_path = os.path.join(os.path.dirname(__file__), 'database', 'database.py')
spec = importlib.util.spec_from_file_location("backend_database", db_module_path)
db_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(db_module)

get_session = db_module.get_session
initialize_engine = db_module.initialize_engine
initialize_engine(settings)

print("All imports successful!")

# Try to create a session and do a basic operation
try:
    with next(get_session()) as session:
        print("Database session created successfully!")

        # Try to query something simple
        # Just test if the session is working
        print("Session test passed!")
except Exception as e:
    print(f"Database session error: {e}")
    import traceback
    traceback.print_exc()