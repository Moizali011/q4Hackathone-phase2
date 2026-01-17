import sys
import os

# Add the parent directory to path to simulate the same environment as main.py
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # phase-3-ai directory
sys.path.insert(0, parent_dir)

# Test the individual imports that are needed
print("Testing individual imports...")

try:
    from database.models import Conversation, Message, Task
    print("+ database.models imported successfully")
except Exception as e:
    print(f"- database.models import failed: {e}")

try:
    from core.config import settings
    print("+ core.config imported successfully")
except Exception as e:
    print(f"- core.config import failed: {e}")

try:
    from database.database import get_session, initialize_engine
    print("+ database.database imported successfully")
except Exception as e:
    print(f"- database.database import failed: {e}")

try:
    from mcp.server import TodoMCPHandler
    print("+ mcp.server.TodoMCPHandler imported successfully")
except ImportError as e:
    print(f"? mcp.server.TodoMCPHandler import failed (expected): {e}")
except Exception as e:
    print(f"- mcp.server.TodoMCPHandler import failed unexpectedly: {e}")

# Test creating a handler if import succeeds
try:
    handler = TodoMCPHandler()
    print("+ TodoMCPHandler instantiated successfully")
except NameError:
    print("? TodoMCPHandler not available (expected)")
except Exception as e:
    print(f"- TodoMCPHandler instantiation failed: {e}")