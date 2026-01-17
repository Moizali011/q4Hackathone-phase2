import sys
import os

# Add the parent directory to path to access the database models
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # phase-3-ai directory
sys.path.insert(0, parent_dir)

# Import the same components used in main.py
from database.models import Conversation, Message, Task
from core.config import settings
from sqlmodel import Session, select

# Import database session using the same approach as main.py
import importlib.util
db_module_path = os.path.join(os.path.dirname(__file__), 'database', 'database.py')
spec = importlib.util.spec_from_file_location("backend_database", db_module_path)
db_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(db_module)

get_session = db_module.get_session
initialize_engine = db_module.initialize_engine
initialize_engine(settings)

print("Starting database test...")

# Simulate the first part of the chat endpoint
user_id = "testuser"
request_conversation_id = None

try:
    print("Creating database session...")
    with next(get_session()) as session:
        print("Session created successfully")

        # Try to execute the same query as in the chat endpoint
        print("Executing query...")
        # Get or create conversation (similar to what happens in the chat endpoint)
        conversation_id = request_conversation_id
        if conversation_id:
            print("Trying to get existing conversation...")
            # This would be the code path when conversation_id is provided
        else:
            print("Creating new conversation...")
            # Create new conversation (this is the path taken when conversation_id is None)
            from uuid import uuid4
            from datetime import datetime

            # Create conversation object
            conversation = Conversation(user_id=user_id)

            # Add to session - this might cause the error
            session.add(conversation)
            session.commit()
            session.refresh(conversation)

            print(f"Created conversation with ID: {conversation.id}")

            # Now try to add a message
            user_message = Message(
                conversation_id=conversation.id,
                role="user",
                content="Test message",
                user_id=user_id
            )

            session.add(user_message)
            session.commit()

            print("Added test message successfully!")

except Exception as e:
    print(f"Database operation error: {e}")
    import traceback
    traceback.print_exc()