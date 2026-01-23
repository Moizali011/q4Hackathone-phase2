# Phase 3 Chatbot Todo Backend

This is the backend for the Phase 3 Chatbot Todo application, built with Python FastAPI.

## Features

- User authentication with JWT
- Task management (CRUD operations)
- OAuth support (Google and GitHub)
- Secure password hashing
- User isolation (users can only access their own tasks)

## Tech Stack

- Python 3.9+
- FastAPI
- SQLModel (SQLAlchemy + Pydantic)
- SQLite (default) or PostgreSQL
- JWT for authentication
- Passlib for password hashing

## Installation

1. Clone the repository
2. Navigate to the backend directory: `cd phase-3-chatbot/backend`
3. Create a virtual environment:
   ```bash
   python -m venv venv
   ```
4. Activate the virtual environment:
   - On Windows: `venv\Scripts\activate`
   - On macOS/Linux: `source venv/bin/activate`
5. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
JWT_SECRET_KEY=your-super-secret-jwt-key-change-in-production
DATABASE_URL=sqlite:///./todoapp.db
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

## Running the Application

1. Make sure you're in the backend directory and your virtual environment is activated
2. Run the application:
   ```bash
   uvicorn main:app --reload
   ```
3. The API will be available at `http://localhost:8000`
4. API documentation will be available at `http://localhost:8000/docs`

## API Documentation

Detailed API documentation is available in the [API_DOCS.md](../API_DOCS.md) file or via the interactive Swagger UI at `/docs` endpoint.

## Database

By default, the application uses SQLite for simplicity. For production, configure the `DATABASE_URL` environment variable to use PostgreSQL or another database.

## Security

- Passwords are hashed using bcrypt
- All API endpoints (except auth) require JWT authentication
- Users can only access their own data
- Input validation is enforced through Pydantic schemas