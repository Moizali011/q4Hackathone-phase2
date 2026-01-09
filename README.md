# Full Stack Todo Application

A multi-user todo application with authentication built using Next.js, FastAPI, and PostgreSQL.

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Python FastAPI
- **Database**: PostgreSQL (Neon Serverless)
- **Authentication**: JWT with custom implementation
- **ORM**: SQLModel

## Features

- User registration and authentication
- JWT-based secure API access
- Task CRUD operations (Create, Read, Update, Delete)
- User isolation (users can only access their own tasks)
- Responsive UI with Tailwind CSS

## Project Structure

```
├── backend/              # FastAPI backend
│   ├── main.py           # Application entry point
│   ├── api/              # API route definitions
│   ├── models/           # SQLModel database models
│   ├── schemas/          # Pydantic schemas
│   ├── database/         # Database connection and initialization
│   ├── auth/             # Authentication utilities
│   ├── core/             # Configuration
│   └── utils/            # Utility functions
├── frontend/             # Next.js frontend
│   ├── app/              # App Router pages
│   ├── components/       # Reusable components
│   ├── lib/              # Utilities and API client
│   └── public/           # Static assets
└── specs/                # Project specifications
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment and install dependencies:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Run the backend:
```bash
uvicorn main:app --reload --port 8000
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token

### Tasks
- `GET /api/tasks` - Get all tasks for authenticated user
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/{id}` - Get a specific task
- `PUT /api/tasks/{id}` - Update a task
- `DELETE /api/tasks/{id}` - Delete a task

## Security Features

- JWT authentication required for all API endpoints
- User ownership validation on all resource operations
- Passwords are securely hashed using bcrypt
- SQL injection prevention through parameterized queries

## Testing

Run backend tests:
```bash
cd backend
pytest
```