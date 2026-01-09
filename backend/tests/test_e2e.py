"""
End-to-end tests for the full stack todo application.
These tests verify the complete functionality of the API.
"""
import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool
from uuid import uuid4
from datetime import datetime
from unittest.mock import patch

from main import app
from database.database import get_session
from models.user import User
from models.task import Task
from auth.jwt import create_access_token
from core.config import settings


# Create an in-memory SQLite database for testing
@pytest.fixture(name="session")
def session_fixture():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session


@pytest.fixture(name="client")
def client_fixture(session: Session):
    def get_session_override():
        return session

    app.dependency_overrides[get_session] = get_session_override
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()


def test_full_auth_and_task_workflow(client: TestClient, session: Session):
    """Test the complete workflow: register → login → create task → get tasks → update → delete"""

    # Step 1: Register a new user
    email = f"testuser_{uuid4().hex[:8]}@example.com"
    password = "securepassword123"

    response = client.post("/api/auth/register", json={
        "email": email,
        "password": password
    })

    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

    token = data["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Step 2: Verify user was created in database
    user = session.exec(SQLModel.select(User).where(User.email == email)).first()
    assert user is not None
    assert user.email == email

    # Step 3: Create a task
    task_data = {
        "title": "Test task",
        "description": "This is a test task"
    }

    response = client.post("/api/tasks", json=task_data, headers=headers)
    assert response.status_code == 200

    created_task = response.json()
    assert created_task["title"] == task_data["title"]
    assert created_task["description"] == task_data["description"]
    assert created_task["completed"] is False
    assert "id" in created_task

    task_id = created_task["id"]

    # Step 4: Get the task by ID
    response = client.get(f"/api/tasks/{task_id}", headers=headers)
    assert response.status_code == 200

    retrieved_task = response.json()
    assert retrieved_task["id"] == task_id
    assert retrieved_task["title"] == task_data["title"]

    # Step 5: Get all tasks for the user
    response = client.get("/api/tasks", headers=headers)
    assert response.status_code == 200

    tasks = response.json()
    assert len(tasks) == 1
    assert tasks[0]["id"] == task_id

    # Step 6: Update the task
    update_data = {
        "completed": True,
        "title": "Updated task title"
    }

    response = client.put(f"/api/tasks/{task_id}", json=update_data, headers=headers)
    assert response.status_code == 200

    updated_task = response.json()
    assert updated_task["id"] == task_id
    assert updated_task["completed"] is True
    assert updated_task["title"] == "Updated task title"

    # Step 7: Delete the task
    response = client.delete(f"/api/tasks/{task_id}", headers=headers)
    assert response.status_code == 200

    # Verify task was deleted
    response = client.get(f"/api/tasks/{task_id}", headers=headers)
    assert response.status_code == 404


def test_user_isolation(client: TestClient, session: Session):
    """Test that users can only access their own tasks"""

    # Create first user
    email1 = f"user1_{uuid4().hex[:8]}@example.com"
    password1 = "password1"

    response = client.post("/api/auth/register", json={
        "email": email1,
        "password": password1
    })
    assert response.status_code == 200
    token1 = response.json()["access_token"]
    headers1 = {"Authorization": f"Bearer {token1}"}

    # Create second user
    email2 = f"user2_{uuid4().hex[:8]}@example.com"
    password2 = "password2"

    response = client.post("/api/auth/register", json={
        "email": email2,
        "password": password2
    })
    assert response.status_code == 200
    token2 = response.json()["access_token"]
    headers2 = {"Authorization": f"Bearer {token2}"}

    # User 1 creates a task
    task_data = {"title": "User 1 task", "description": "Task for user 1"}
    response = client.post("/api/tasks", json=task_data, headers=headers1)
    assert response.status_code == 200
    task_id = response.json()["id"]

    # User 2 should not be able to access user 1's task
    response = client.get(f"/api/tasks/{task_id}", headers=headers2)
    assert response.status_code == 404

    # User 2 should see no tasks
    response = client.get("/api/tasks", headers=headers2)
    assert response.status_code == 200
    assert len(response.json()) == 0

    # User 1 should still see their task
    response = client.get("/api/tasks", headers=headers1)
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["id"] == task_id


def test_unauthorized_access(client: TestClient):
    """Test that unauthorized requests are rejected"""

    # Try to access tasks endpoint without token
    response = client.get("/api/tasks")
    assert response.status_code == 401

    # Try to create a task without token
    response = client.post("/api/tasks", json={"title": "Test"})
    assert response.status_code == 401

    # Try with invalid token
    headers = {"Authorization": "Bearer invalid_token"}
    response = client.get("/api/tasks", headers=headers)
    assert response.status_code == 401


if __name__ == "__main__":
    pytest.main([__file__])