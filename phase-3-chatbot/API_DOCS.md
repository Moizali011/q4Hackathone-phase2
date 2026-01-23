# Phase 3 Chatbot Todo API Documentation

This document describes the API endpoints for the Phase 3 Chatbot Todo application backend.

## Table of Contents
- [Overview](#overview)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
  - [Authentication Endpoints](#authentication-endpoints)
  - [Task Management Endpoints](#task-management-endpoints)
  - [OAuth Endpoints](#oauth-endpoints)
  - [Utility Endpoints](#utility-endpoints)
- [Request/Response Examples](#requestresponse-examples)
- [Error Handling](#error-handling)

## Overview

The Phase 3 Chatbot Todo API is a RESTful API built with FastAPI that provides authentication and task management functionality for the chatbot-enhanced todo application. All endpoints are protected by JWT authentication, except for registration and login endpoints.

**Base URL**: `http://localhost:8000` (default)

## Authentication

All API requests (except authentication endpoints) require a JWT token in the Authorization header:

```
Authorization: Bearer <your-access-token>
```

## API Endpoints

### Authentication Endpoints

#### Register a new user
- **POST** `/api/auth/register`
- **Description**: Creates a new user account
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securePassword123"
  }
  ```
- **Response**:
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer"
  }
  ```
- **Status Codes**:
  - 200: Successfully registered
  - 409: Email already registered

#### Login
- **POST** `/api/auth/login`
- **Description**: Authenticates user and returns access token
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securePassword123"
  }
  ```
- **Response**:
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer"
  }
  ```
- **Status Codes**:
  - 200: Successfully logged in
  - 401: Incorrect email or password

### Task Management Endpoints

#### Get all tasks
- **GET** `/api/tasks`
- **Description**: Retrieves all tasks for the authenticated user
- **Authentication**: Required
- **Response**:
  ```json
  [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "user_id": "550e8400-e29b-41d4-a716-446655440001",
      "title": "Sample task",
      "description": "Sample description",
      "completed": false,
      "created_at": "2023-10-01T12:00:00Z",
      "updated_at": "2023-10-01T12:00:00Z"
    }
  ]
  ```
- **Status Codes**:
  - 200: Successfully retrieved tasks

#### Create a new task
- **POST** `/api/tasks`
- **Description**: Creates a new task for the authenticated user
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "title": "New task",
    "description": "Task description (optional)",
    "completed": false
  }
  ```
- **Response**:
  ```json
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "user_id": "550e8400-e29b-41d4-a716-446655440001",
    "title": "New task",
    "description": "Task description (optional)",
    "completed": false,
    "created_at": "2023-10-01T12:00:00Z",
    "updated_at": "2023-10-01T12:00:00Z"
  }
  ```
- **Status Codes**:
  - 200: Successfully created task

#### Get a specific task
- **GET** `/api/tasks/{task_id}`
- **Description**: Retrieves a specific task by ID
- **Authentication**: Required
- **Path Parameters**:
  - `task_id`: UUID of the task to retrieve
- **Response**:
  ```json
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "user_id": "550e8400-e29b-41d4-a716-446655440001",
    "title": "Sample task",
    "description": "Sample description",
    "completed": false,
    "created_at": "2023-10-01T12:00:00Z",
    "updated_at": "2023-10-01T12:00:00Z"
  }
  ```
- **Status Codes**:
  - 200: Successfully retrieved task
  - 404: Task not found or no permission

#### Update a task
- **PUT** `/api/tasks/{task_id}`
- **Description**: Updates a specific task by ID
- **Authentication**: Required
- **Path Parameters**:
  - `task_id`: UUID of the task to update
- **Request Body**:
  ```json
  {
    "title": "Updated task title (optional)",
    "description": "Updated description (optional)",
    "completed": true
  }
  ```
- **Response**:
  ```json
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "user_id": "550e8400-e29b-41d4-a716-446655440001",
    "title": "Updated task title",
    "description": "Updated description",
    "completed": true,
    "created_at": "2023-10-01T12:00:00Z",
    "updated_at": "2023-10-01T13:00:00Z"
  }
  ```
- **Status Codes**:
  - 200: Successfully updated task
  - 404: Task not found or no permission

#### Delete a task
- **DELETE** `/api/tasks/{task_id}`
- **Description**: Deletes a specific task by ID
- **Authentication**: Required
- **Path Parameters**:
  - `task_id`: UUID of the task to delete
- **Response**:
  ```json
  {
    "success": true
  }
  ```
- **Status Codes**:
  - 200: Successfully deleted task
  - 404: Task not found or no permission

### OAuth Endpoints

#### Google OAuth Login
- **GET** `/api/auth/oauth/google/login`
- **Description**: Initiates Google OAuth login flow
- **Response**:
  ```json
  {
    "auth_url": "https://accounts.google.com/o/oauth2/auth?..."
  }
  ```

#### GitHub OAuth Login
- **GET** `/api/auth/oauth/github/login`
- **Description**: Initiates GitHub OAuth login flow
- **Response**:
  ```json
  {
    "auth_url": "https://github.com/login/oauth/authorize?..."
  }
  ```

### Utility Endpoints

#### Health Check
- **GET** `/health`
- **Description**: Checks the health of the API
- **Response**:
  ```json
  {
    "status": "healthy"
  }
  ```

#### Root Endpoint
- **GET** `/`
- **Description**: Returns API information
- **Response**:
  ```json
  {
    "message": "Phase 3 Chatbot Todo API is running",
    "allowed_origins": ["http://localhost:3000", ...]
  }
  ```

## Request/Response Examples

### Creating a Task
```bash
curl -X POST http://localhost:8000/api/tasks \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Buy groceries",
    "description": "Milk, bread, eggs, and fruits"
  }'
```

### Getting All Tasks
```bash
curl -X GET http://localhost:8000/api/tasks \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Updating a Task
```bash
curl -X PUT http://localhost:8000/api/tasks/TASK_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "completed": true
  }'
```

### Deleting a Task
```bash
curl -X DELETE http://localhost:8000/api/tasks/TASK_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Error Handling

The API returns standard HTTP status codes and error messages:

- **400 Bad Request**: Invalid request format
- **401 Unauthorized**: Missing or invalid authentication
- **404 Not Found**: Resource not found
- **409 Conflict**: Resource already exists (e.g., email already registered)
- **500 Internal Server Error**: Server error

Error response format:
```json
{
  "detail": "Error message description"
}
```