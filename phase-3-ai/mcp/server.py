from mcp import stdio_server, Server, jsonrpc
from mcp.types import CallToolResult, TextContent, Tool
from sqlmodel import create_engine, Session, select
from database.models import Task, Message, Conversation
from backend.core.config import settings
from typing import Dict, Any, List
import json
from uuid import UUID


class TodoMCPHandler:
    def __init__(self):
        self.engine = create_engine(settings.DATABASE_URL)

    def add_task(self, user_id: str, title: str, description: str = None) -> Dict[str, Any]:
        """MCP tool to add a new task"""
        with Session(self.engine) as session:
            task = Task(
                title=title,
                description=description,
                user_id=user_id,
                completed=False
            )
            session.add(task)
            session.commit()
            session.refresh(task)

            return {
                "success": True,
                "task_id": str(task.id),
                "message": f"Task '{task.title}' added successfully"
            }

    def list_tasks(self, user_id: str, status: str = None) -> List[Dict[str, Any]]:
        """MCP tool to list tasks for a user"""
        with Session(self.engine) as session:
            query = select(Task).where(Task.user_id == user_id)

            if status == "completed":
                query = query.where(Task.completed == True)
            elif status == "pending":
                query = query.where(Task.completed == False)
            elif status == "all":
                pass  # Show all tasks
            else:
                # Default to showing all tasks
                pass

            tasks = session.exec(query).all()

            return [
                {
                    "id": str(task.id),
                    "title": task.title,
                    "description": task.description,
                    "completed": task.completed,
                    "created_at": task.created_at.isoformat()
                }
                for task in tasks
            ]

    def complete_task(self, user_id: str, task_id: str) -> Dict[str, Any]:
        """MCP tool to mark a task as completed"""
        with Session(self.engine) as session:
            task = session.exec(
                select(Task).where(Task.id == UUID(task_id), Task.user_id == user_id)
            ).first()

            if not task:
                return {
                    "success": False,
                    "message": "Task not found or you don't have permission to modify it"
                }

            task.completed = True
            session.add(task)
            session.commit()

            return {
                "success": True,
                "message": f"Task '{task.title}' marked as completed"
            }

    def delete_task(self, user_id: str, task_id: str) -> Dict[str, Any]:
        """MCP tool to delete a task"""
        with Session(self.engine) as session:
            task = session.exec(
                select(Task).where(Task.id == UUID(task_id), Task.user_id == user_id)
            ).first()

            if not task:
                return {
                    "success": False,
                    "message": "Task not found or you don't have permission to delete it"
                }

            session.delete(task)
            session.commit()

            return {
                "success": True,
                "message": f"Task '{task.title}' deleted successfully"
            }

    def update_task(self, user_id: str, task_id: str, title: str = None, description: str = None, completed: bool = None) -> Dict[str, Any]:
        """MCP tool to update a task"""
        with Session(self.engine) as session:
            task = session.exec(
                select(Task).where(Task.id == UUID(task_id), Task.user_id == user_id)
            ).first()

            if not task:
                return {
                    "success": False,
                    "message": "Task not found or you don't have permission to modify it"
                }

            if title is not None:
                task.title = title
            if description is not None:
                task.description = description
            if completed is not None:
                task.completed = completed

            session.add(task)
            session.commit()

            return {
                "success": True,
                "message": f"Task '{task.title}' updated successfully"
            }


def create_mcp_server():
    handler = TodoMCPHandler()

    async def handle_request(server: Server):
        # Define MCP tools
        @server.tools.register(
            name="add_task",
            description="Add a new task to the user's task list",
            input_schema={
                "type": "object",
                "properties": {
                    "user_id": {"type": "string", "description": "The user ID"},
                    "title": {"type": "string", "description": "The task title"},
                    "description": {"type": "string", "description": "Optional task description"}
                },
                "required": ["user_id", "title"]
            }
        )
        async def add_task_tool(params: Dict[str, Any]) -> CallToolResult:
            result = handler.add_task(
                params["user_id"],
                params["title"],
                params.get("description")
            )
            return CallToolResult(content=[TextContent(type="text", text=json.dumps(result))])

        @server.tools.register(
            name="list_tasks",
            description="List all tasks for the user",
            input_schema={
                "type": "object",
                "properties": {
                    "user_id": {"type": "string", "description": "The user ID"},
                    "status": {"type": "string", "enum": ["all", "completed", "pending"], "description": "Filter tasks by status"}
                },
                "required": ["user_id"]
            }
        )
        async def list_tasks_tool(params: Dict[str, Any]) -> CallToolResult:
            result = handler.list_tasks(
                params["user_id"],
                params.get("status", "all")
            )
            return CallToolResult(content=[TextContent(type="text", text=json.dumps(result))])

        @server.tools.register(
            name="complete_task",
            description="Mark a task as completed",
            input_schema={
                "type": "object",
                "properties": {
                    "user_id": {"type": "string", "description": "The user ID"},
                    "task_id": {"type": "string", "description": "The task ID to complete"}
                },
                "required": ["user_id", "task_id"]
            }
        )
        async def complete_task_tool(params: Dict[str, Any]) -> CallToolResult:
            result = handler.complete_task(params["user_id"], params["task_id"])
            return CallToolResult(content=[TextContent(type="text", text=json.dumps(result))])

        @server.tools.register(
            name="delete_task",
            description="Delete a task",
            input_schema={
                "type": "object",
                "properties": {
                    "user_id": {"type": "string", "description": "The user ID"},
                    "task_id": {"type": "string", "description": "The task ID to delete"}
                },
                "required": ["user_id", "task_id"]
            }
        )
        async def delete_task_tool(params: Dict[str, Any]) -> CallToolResult:
            result = handler.delete_task(params["user_id"], params["task_id"])
            return CallToolResult(content=[TextContent(type="text", text=json.dumps(result))])

        @server.tools.register(
            name="update_task",
            description="Update a task",
            input_schema={
                "type": "object",
                "properties": {
                    "user_id": {"type": "string", "description": "The user ID"},
                    "task_id": {"type": "string", "description": "The task ID to update"},
                    "title": {"type": "string", "description": "New title (optional)"},
                    "description": {"type": "string", "description": "New description (optional)"},
                    "completed": {"type": "boolean", "description": "New completion status (optional)"}
                },
                "required": ["user_id", "task_id"]
            }
        )
        async def update_task_tool(params: Dict[str, Any]) -> CallToolResult:
            result = handler.update_task(
                params["user_id"],
                params["task_id"],
                params.get("title"),
                params.get("description"),
                params.get("completed")
            )
            return CallToolResult(content=[TextContent(type="text", text=json.dumps(result))])

    return server