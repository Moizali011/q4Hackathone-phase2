import sys
import os

# Add the parent directory to path to simulate the same environment as main.py
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # phase-3-ai directory
sys.path.insert(0, parent_dir)

try:
    from mcp.server import TodoMCPHandler
    print("SUCCESS: TodoMCPHandler imported successfully")

    # Try to instantiate it
    handler = TodoMCPHandler()
    print("SUCCESS: TodoMCPHandler instantiated successfully")
except Exception as e:
    print(f"ERROR: {str(e)}")
    import traceback
    traceback.print_exc()