# Backend Development Guidelines

## Tech Stack
- Python FastAPI
- SQLModel ORM
- Neon Serverless PostgreSQL
- JWT for authentication

## Project Structure
```
backend/
├── main.py              # FastAPI application entry point
├── models/              # SQLModel database models
│   ├── user.py
│   └── task.py
├── schemas/             # Pydantic schemas for API requests/responses
│   ├── user.py
│   └── task.py
├── database/            # Database connection and session management
│   └── database.py
├── auth/                # Authentication and JWT utilities
│   └── jwt.py
├── api/                 # API route definitions
│   ├── auth.py
│   └── tasks.py
├── core/                # Core application configurations
│   └── config.py
└── utils/               # Utility functions
    └── security.py
```

## API Requirements
- All endpoints under /api/ path
- JWT required in Authorization header (Bearer token)
- Return 401 on missing/invalid token
- Validate user_id in token matches resource access

## Database Models
- Use SQLModel for database models
- Implement proper relationships between models
- Define validation constraints
- Include created_at and updated_at timestamps

## Authentication Implementation
- Implement JWT token creation and validation
- Secure password hashing using bcrypt
- Validate user credentials during authentication
- Include user_id in JWT payload for authorization

## Security Requirements
- Every API request must validate JWT token
- Enforce user ownership on all resource operations
- Implement proper input validation
- Use parameterized queries to prevent SQL injection

## Error Handling
- Implement consistent error response format
- Return appropriate HTTP status codes
- Log errors for debugging
- Don't expose internal error details to clients

## Dependencies
- fastapi
- uvicorn
- sqlmodel
- psycopg2-binary (or asyncpg for async)
- python-jose[cryptography]
- passlib[bcrypt]
- python-multipart
- python-dotenv