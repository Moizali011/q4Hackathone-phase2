# REST API Endpoints Specification

## API Base Path
All API endpoints are under `/api/`

## Authentication Requirements
- All endpoints require JWT token in Authorization header
- Format: `Authorization: Bearer <jwt_token>`
- 401 response for missing/invalid tokens
- User ID from token must match resource access requirements

## Endpoint Specifications

### Authentication Endpoints
```
POST /api/auth/register
- Request: { email: string, password: string }
- Response: { token: string, user: { id: string, email: string } }
- Errors: 400 (validation), 409 (email exists), 500 (server error)

POST /api/auth/login
- Request: { email: string, password: string }
- Response: { token: string, user: { id: string, email: string } }
- Errors: 400 (validation), 401 (invalid credentials), 500 (server error)

POST /api/auth/logout
- Request: (authenticated user)
- Response: { success: boolean }
- Errors: 401 (unauthorized), 500 (server error)
```

### Task Management Endpoints
```
GET /api/tasks
- Response: [{ id: string, title: string, description?: string, completed: boolean, created_at: string, updated_at: string }]
- Errors: 401 (unauthorized), 500 (server error)

POST /api/tasks
- Request: { title: string, description?: string }
- Response: { id: string, title: string, description?: string, completed: boolean, created_at: string, updated_at: string }
- Errors: 400 (validation), 401 (unauthorized), 500 (server error)

GET /api/tasks/{id}
- Response: { id: string, title: string, description?: string, completed: boolean, created_at: string, updated_at: string }
- Errors: 401 (unauthorized), 403 (forbidden), 404 (not found), 500 (server error)

PUT /api/tasks/{id}
- Request: { title?: string, description?: string, completed?: boolean }
- Response: { id: string, title: string, description?: string, completed: boolean, created_at: string, updated_at: string }
- Errors: 400 (validation), 401 (unauthorized), 403 (forbidden), 404 (not found), 500 (server error)

DELETE /api/tasks/{id}
- Response: { success: boolean }
- Errors: 401 (unauthorized), 403 (forbidden), 404 (not found), 500 (server error)
```

## Common Error Responses
- 400: { error: "Bad Request", message: string }
- 401: { error: "Unauthorized", message: "Authentication required" }
- 403: { error: "Forbidden", message: "Access denied" }
- 404: { error: "Not Found", message: string }
- 422: { error: "Validation Error", message: string }
- 500: { error: "Internal Server Error", message: "An unexpected error occurred" }

## JWT Validation
- All endpoints (except auth endpoints) must validate JWT from Authorization header
- Extract user_id from token payload
- Verify user_id matches resource ownership when applicable
- Return 401 if token is invalid/expired