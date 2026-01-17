from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from uuid import UUID
import asyncio
import openai
from sqlmodel import Session, select
from datetime import datetime
import json
import httpx
import sys
import os

# Temporarily modify the path to import models from the parent directory
phase3_ai_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # phase-3-ai directory
original_sys_path = sys.path[:]
sys.path.insert(0, phase3_ai_dir)

try:
    # Import models from the parent's database directory
    from database.models import Conversation, Message, Task
    from core.config import settings
finally:
    # Restore original path
    sys.path[:] = original_sys_path

# Now import from the local backend database module using importlib to avoid relative import issues
import importlib.util
import os

db_module_path = os.path.join(os.path.dirname(__file__), 'database', 'database.py')
spec = importlib.util.spec_from_file_location("backend_database", db_module_path)
db_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(db_module)

get_session = db_module.get_session
initialize_engine = db_module.initialize_engine
initialize_engine(settings)


import sys
import os

def get_todo_handler():
    """
    Helper function to get the TodoMCPHandler, with graceful fallback if MCP SDK is not available.
    """
    # Add the parent directory to path to access mcp module
    current_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # phase-3-ai directory
    original_path = sys.path[:]
    sys.path.insert(0, current_dir)

    try:
        from mcp.server import TodoMCPHandler
        handler = TodoMCPHandler()

        # Restore original path
        sys.path[:] = original_path

        return handler, True
    except ImportError as e:
        # Restore original path
        sys.path[:] = original_path
        return None, False

app = FastAPI(title="Phase-3 AI Chatbot API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    user_id: str
    message: str
    conversation_id: Optional[str] = None


class ChatResponse(BaseModel):
    conversation_id: str
    response: str
    tool_calls: Optional[List[Dict[str, Any]]] = None


@app.post("/api/{user_id}/chat", response_model=ChatResponse)
async def chat_endpoint(
    user_id: str,
    request: ChatRequest,
    session: Session = Depends(get_session)
):
    """
    Main chat endpoint that handles conversation with the AI assistant.
    Always returns a conversation_id, response, and optional tool call metadata.
    """
    try:
        # Get or create conversation
        conversation_id = request.conversation_id
        if conversation_id:
            try:
                conv_uuid = UUID(conversation_id)
                conversation = session.exec(
                    select(Conversation).where(
                        Conversation.id == conv_uuid,
                        Conversation.user_id == user_id
                    )
                ).first()

                if not conversation:
                    # Create new conversation if not found
                    conversation = Conversation(user_id=user_id)
                    session.add(conversation)
                    session.commit()
                    session.refresh(conversation)
                    conversation_id = str(conversation.id)
            except ValueError:
                # Invalid UUID, create new conversation
                conversation = Conversation(user_id=user_id)
                session.add(conversation)
                session.commit()
                session.refresh(conversation)
                conversation_id = str(conversation.id)
        else:
            # Create new conversation
            conversation = Conversation(user_id=user_id)
            session.add(conversation)
            session.commit()
            session.refresh(conversation)
            conversation_id = str(conversation.id)

        # Add user message to conversation
        user_message = Message(
            conversation_id=UUID(conversation_id),
            role="user",
            content=request.message,
            user_id=user_id
        )
        session.add(user_message)
        session.commit()

        # Get conversation history
        conversation_history = session.exec(
            select(Message)
            .where(Message.conversation_id == UUID(conversation_id))
            .order_by(Message.timestamp)
        ).all()

        # Format history for OpenAI
        messages = []

        # Add system message with stored prompt if available
        if conversation.system_prompt:
            messages.append({"role": "system", "content": conversation.system_prompt})
        else:
            # Default system prompt for the AI assistant
            messages.append({
                "role": "system",
                "content": """You are a versatile AI Task Assistant that can help users manage any type of task.
                You can help users add, list, complete, delete, update, and organize tasks of any kind.
                Be flexible and accommodate any type of task the user wants to create - work, personal, reminders, projects, etc.
                Always be polite, confirm important actions, and offer helpful suggestions.
                Use the provided tools to interact with the task database.
                Never hallucinate task details - always use the tools to get current information.
                If a user wants to do something that doesn't match a specific tool, try to interpret their request as a task management action.
                Be creative in interpreting user requests as task management operations."""
            })

        # Add conversation history
        for msg in conversation_history:
            messages.append({
                "role": msg.role,
                "content": msg.content
            })

        # Mock AI processing - analyze user input and determine appropriate action
        user_input = request.message.lower()

        # Determine the appropriate action based on user input
        if "add" in user_input or "create" in user_input or "new" in user_input:
            # Extract potential task title from user input
            import re
            # Look for phrases like "add task to..." or "create task to..." or just extract the intent
            task_match = re.search(r'(?:add|create|make|new)\s+(?:a\s+|an\s+|the\s+)?(?:task|todo|reminder|note|item)\s+(?:to|for|about|that|which)?\s*(.+?)(?:\.|$)', user_input)

            if task_match:
                task_title = task_match.group(1).strip()
            else:
                # Extract everything after common verbs
                task_match = re.search(r'(?:add|create|make)\s+(.+?)(?:\.|$)', user_input)
                if task_match:
                    task_title = task_match.group(1).strip()
                else:
                    task_title = user_input.replace("add ", "").replace("create ", "").replace("make ", "").strip()

            if task_title:
                # Add the task using the MCP handler
                try:
                    from mcp.server import TodoMCPHandler
                    handler = TodoMCPHandler()

                    result = handler.add_task(
                        user_id=user_id,
                        title=task_title,
                        description=f"Task created from chat: {request.message}"
                    )

                    assistant_response = result.get("message", f"I've added the task: {task_title}")
                    tool_call_results = [{
                        "name": "add_task",
                        "arguments": {"title": task_title},
                        "result": result
                    }]
                except Exception as e:
                    assistant_response = f"I'm sorry, I had trouble adding that task. Error: {str(e)}"
                    tool_call_results = []
            else:
                assistant_response = "I'm not sure what task you'd like me to add. Could you please specify what you'd like to do?"
                tool_call_results = []

        elif "show" in user_input or "list" in user_input or "my task" in user_input or "what" in user_input:
            # List the user's tasks
            try:
                from mcp.server import TodoMCPHandler
                handler = TodoMCPHandler()

                # Determine if user wants all, completed, or pending tasks
                status = "all"
                if "completed" in user_input:
                    status = "completed"
                elif "pending" in user_input or "incomplete" in user_input:
                    status = "pending"

                tasks = handler.list_tasks(user_id=user_id, status=status)

                if tasks:
                    if status == "completed":
                        assistant_response = f"You have {len(tasks)} completed tasks:\n" + "\n".join([f"- {task['title']}" for task in tasks])
                    elif status == "pending":
                        assistant_response = f"You have {len(tasks)} pending tasks:\n" + "\n".join([f"- {task['title']}" for task in tasks[:5]])  # Limit to 5 to avoid spam
                        if len(tasks) > 5:
                            assistant_response += f"\n\n...and {len(tasks) - 5} more tasks."
                    else:
                        assistant_response = f"You have {len(tasks)} tasks total:\n" + "\n".join([f"- {task['title']}" for task in tasks[:5]])  # Limit to 5 to avoid spam
                        if len(tasks) > 5:
                            assistant_response += f"\n\n...and {len(tasks) - 5} more tasks."
                else:
                    if status == "completed":
                        assistant_response = "You don't have any completed tasks."
                    elif status == "pending":
                        assistant_response = "You don't have any pending tasks."
                    else:
                        assistant_response = "You don't have any tasks yet. Try adding one!"

                tool_call_results = [{
                    "name": "list_tasks",
                    "arguments": {"status": status},
                    "result": tasks
                }]
            except Exception as e:
                assistant_response = f"I'm sorry, I had trouble retrieving your tasks. Error: {str(e)}"
                tool_call_results = []

        elif "complete" in user_input or "done" in user_input or "finish" in user_input:
            # Find potential task to complete
            try:
                from mcp.server import TodoMCPHandler
                handler = TodoMCPHandler()

                # First, get all pending tasks to match against
                pending_tasks = handler.list_tasks(user_id=user_id, status="pending")

                matched_task = None
                user_input_lower = user_input.lower()

                # Try to match the input with existing task titles
                for task in pending_tasks:
                    if task['title'].lower() in user_input_lower or \
                       any(word in task['title'].lower() for word in user_input_lower.split()):
                        matched_task = task
                        break

                if matched_task:
                    result = handler.complete_task(user_id=user_id, task_id=str(matched_task['id']))
                    assistant_response = result.get("message", f"I've marked '{matched_task['title']}' as completed!")

                    tool_call_results = [{
                        "name": "complete_task",
                        "arguments": {"task_id": str(matched_task['id'])},
                        "result": result
                    }]
                else:
                    # If no specific task matched, ask user for clarification
                    if pending_tasks:
                        task_list = "\n".join([f"- {task['title']}" for task in pending_tasks[:3]])
                        assistant_response = f"I couldn't identify which task you want to complete. Here are some of your pending tasks:\n{task_list}\n\nCould you be more specific?"
                    else:
                        assistant_response = "You don't have any pending tasks to complete."
                    tool_call_results = []
            except Exception as e:
                assistant_response = f"I'm sorry, I had trouble completing that task. Error: {str(e)}"
                tool_call_results = []

        elif "priority" in user_input or "urgent" in user_input or "important" in user_input:
            # Handle priority-related requests
            try:
                from mcp.server import TodoMCPHandler
                handler = TodoMCPHandler()

                # Get all tasks to match against
                all_tasks = handler.list_tasks(user_id=user_id, status="all")

                # Determine the priority level
                priority = "normal"
                if "high" in user_input or "urgent" in user_input or "important" in user_input or "critical" in user_input:
                    priority = "high"
                elif "low" in user_input or "not urgent" in user_input:
                    priority = "low"

                # Look for tasks in the input
                matched_task = None
                user_input_lower = user_input.lower()

                for task in all_tasks:
                    if task['title'].lower() in user_input_lower or \
                       any(word in task['title'].lower() for word in user_input_lower.split()):
                        matched_task = task
                        break

                if matched_task:
                    # Update the task with priority info (this would require extending the update function)
                    # For now, let's just acknowledge the request
                    assistant_response = f"I've noted that '{matched_task['title']}' is a {priority} priority task. This feature will be fully implemented in the next version."
                    tool_call_results = []
                else:
                    # If no specific task, just acknowledge the priority concept
                    assistant_response = f"I understand you're concerned about priorities. You can mark tasks as high, medium, or low priority. For example, say 'Set groceries task to high priority'."
                    tool_call_results = []
            except Exception as e:
                assistant_response = f"I'm sorry, I had trouble processing that priority request. Error: {str(e)}"
                tool_call_results = []

        elif "search" in user_input or "find" in user_input or "look for" in user_input:
            # Handle search requests
            try:
                from mcp.server import TodoMCPHandler
                handler = TodoMCPHandler()

                # Get all tasks to search through
                all_tasks = handler.list_tasks(user_id=user_id, status="all")

                # Extract search term (anything after "search for", "find", "look for", etc.)
                import re
                search_pattern = r'(?:search for|find|look for|show me|where is)\s+(.+?)(?:\.|$)'
                search_match = re.search(search_pattern, user_input, re.IGNORECASE)

                if search_match:
                    search_term = search_match.group(1).strip()

                    # Find tasks matching the search term
                    matching_tasks = []
                    for task in all_tasks:
                        if search_term.lower() in task['title'].lower() or \
                           (task['description'] and search_term.lower() in task['description'].lower()):
                            matching_tasks.append(task)

                    if matching_tasks:
                        task_list = "\n".join([f"- {task['title']}" for task in matching_tasks[:5]])  # Limit to 5
                        assistant_response = f"I found {len(matching_tasks)} task(s) matching '{search_term}':\n{task_list}"
                        if len(matching_tasks) > 5:
                            assistant_response += f"\n\n...and {len(matching_tasks) - 5} more tasks."
                    else:
                        assistant_response = f"I couldn't find any tasks matching '{search_term}'."
                else:
                    # If no specific search term, ask for clarification
                    assistant_response = "What would you like me to search for? For example, say 'Find tasks about shopping' or 'Search for meeting'."

                tool_call_results = []
            except Exception as e:
                assistant_response = f"I'm sorry, I had trouble searching for tasks. Error: {str(e)}"
                tool_call_results = []

        elif "due" in user_input or "date" in user_input or "deadline" in user_input or "by " in user_input:
            # Handle due date-related requests
            try:
                from mcp.server import TodoMCPHandler
                handler = TodoMCPHandler()

                # Get all tasks to match against
                all_tasks = handler.list_tasks(user_id=user_id, status="all")

                # Look for tasks in the input
                matched_task = None
                user_input_lower = user_input.lower()

                for task in all_tasks:
                    if task['title'].lower() in user_input_lower or \
                       any(word in task['title'].lower() for word in user_input_lower.split()):
                        matched_task = task
                        break

                if matched_task:
                    # Extract date information (simplified parsing)
                    import re
                    date_pattern = r'\b\d{1,2}[/-]\d{1,2}[/-]?\d{2,4}\b|\b\d{4}-\d{2}-\d{2}\b|\b(today|tomorrow|monday|tuesday|wednesday|thursday|friday|saturday|sunday|week|month)\b'
                    date_match = re.search(date_pattern, user_input_lower)

                    if date_match:
                        due_date = date_match.group()
                        assistant_response = f"I've noted that '{matched_task['title']}' is due {due_date}. This feature will be fully implemented in the next version."
                    else:
                        assistant_response = f"I understand you want to set a due date for '{matched_task['title']}'. Please specify a date like 'due tomorrow' or 'deadline March 15'."
                    tool_call_results = []
                else:
                    # If no specific task, just acknowledge the due date concept
                    assistant_response = f"I understand you're concerned about due dates. You can set deadlines for tasks. For example, say 'Set groceries task due tomorrow'."
                    tool_call_results = []
            except Exception as e:
                assistant_response = f"I'm sorry, I had trouble processing that due date request. Error: {str(e)}"
                tool_call_results = []

        elif "delete" in user_input or "remove" in user_input or "cancel" in user_input:
            # Find potential task to delete
            try:
                from mcp.server import TodoMCPHandler
                handler = TodoMCPHandler()

                # First, get all tasks to match against
                all_tasks = handler.list_tasks(user_id=user_id, status="all")

                matched_task = None
                user_input_lower = user_input.lower()

                # Try to match the input with existing task titles
                for task in all_tasks:
                    if task['title'].lower() in user_input_lower or \
                       any(word in task['title'].lower() for word in user_input_lower.split()):
                        matched_task = task
                        break

                if matched_task:
                    result = handler.delete_task(user_id=user_id, task_id=str(matched_task['id']))
                    assistant_response = result.get("message", f"I've deleted the task: {matched_task['title']}")

                    tool_call_results = [{
                        "name": "delete_task",
                        "arguments": {"task_id": str(matched_task['id'])},
                        "result": result
                    }]
                else:
                    # If no specific task matched, ask user for clarification
                    if all_tasks:
                        task_list = "\n".join([f"- {task['title']}" for task in all_tasks[:3]])
                        assistant_response = f"I couldn't identify which task you want to delete. Here are some of your tasks:\n{task_list}\n\nCould you be more specific?"
                    else:
                        assistant_response = "You don't have any tasks to delete."
                    tool_call_results = []
            except Exception as e:
                assistant_response = f"I'm sorry, I had trouble deleting that task. Error: {str(e)}"
                tool_call_results = []

        else:
            # Generic response for unrecognized commands
            assistant_response = f"I understand you said: '{request.message}'. I can help you add, list, complete, or delete tasks. For example, you can say 'Add a task to buy groceries' or 'Show me my tasks'."
            tool_call_results = []

        # Add assistant response to conversation
        assistant_message = Message(
            conversation_id=UUID(conversation_id),
            role="assistant",
            content=assistant_response,
            user_id=user_id
        )
        session.add(assistant_message)
        session.commit()

        return ChatResponse(
            conversation_id=conversation_id,
            response=assistant_response,
            tool_calls=tool_call_results if tool_call_results else None
        )

    except Exception as e:
        # Never expose raw errors to the user
        print(f"Error in chat endpoint: {str(e)}")  # Log the actual error for debugging
        return ChatResponse(
            conversation_id=request.conversation_id or "",
            response="I'm sorry, I encountered an issue processing your request. Could you try again?",
            tool_calls=None
        )


@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "phase-3-ai-chatbot"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)  # Different port to avoid conflict with main backend