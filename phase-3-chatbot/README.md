# Phase 3: Chatbot-Powered Todo Application

## Overview
This project implements a full-stack todo application enhanced with a natural language chatbot that allows users to manage tasks using voice-like commands in English. The application features real-time synchronization between dashboard and task views.

## Features
- **Authentication System**: User registration and login with JWT tokens
- **Task Management**: Create, read, update, delete tasks
- **Natural Language Chatbot**: English-based commands to manage tasks
- **Real-time Sync**: Tasks update across all components instantly
- **Dashboard**: Statistics and recent tasks overview
- **Responsive UI**: Mobile-friendly design with dark/light themes
- **Backend API**: Python FastAPI backend with secure authentication and task management
- **Database Integration**: Persistent storage with PostgreSQL/SQLite support

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Python 3.9+
- pip

### Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Create a virtual environment: `python -m venv venv`
3. Activate the virtual environment:
   - On Windows: `venv\Scripts\activate`
   - On macOS/Linux: `source venv/bin/activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Create a `.env` file with the required environment variables (see backend README)
6. Start the backend: `uvicorn main:app --reload`

### Frontend Setup
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the application: `npm run dev`

### Complete Setup
1. Start the backend server first
2. In a separate terminal, start the frontend server
3. Access the application at `http://localhost:3000`

### Available Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server

## Chatbot Commands
- **Add Tasks**: "add task Buy groceries", "create task Call mom", "new task Walk the dog"
- **Delete Tasks**: "delete task Buy groceries", "remove task Call mom", "kill task Walk the dog"
- **Complete Tasks**: "complete task Buy groceries", "done task Call mom", "finish task Walk the dog"
- **Show Tasks**: "show tasks", "list tasks", "what are my tasks"
- **Greetings**: "Hi", "Hello", "Hey" - receives appropriate response

## Project Structure
```
├── backend/                  # Python FastAPI backend
│   ├── api/                  # API route definitions
│   │   ├── auth.py           # Authentication endpoints
│   │   └── tasks.py          # Task management endpoints
│   ├── auth/                 # Authentication utilities
│   │   ├── jwt.py            # JWT utilities
│   │   ├── dependencies.py   # Auth dependencies
│   │   └── oauth.py          # OAuth implementation
│   ├── models/               # Database models
│   │   ├── user.py           # User model
│   │   └── task.py           # Task model
│   ├── schemas/              # Pydantic schemas
│   │   ├── user.py           # User schemas
│   │   └── task.py           # Task schemas
│   ├── database/             # Database utilities
│   │   ├── database.py       # Database connection
│   │   └── init_db.py        # Database initialization
│   ├── core/                 # Core configurations
│   │   └── config.py         # Settings and configurations
│   ├── utils/                # Utility functions
│   │   └── security.py       # Security utilities
│   ├── main.py               # Application entry point
│   ├── requirements.txt      # Python dependencies
│   └── README.md             # Backend documentation
├── frontend/                 # Next.js application
│   ├── app/                  # Application routes
│   │   ├── auth/             # Authentication pages
│   │   ├── dashboard/        # Dashboard page
│   │   ├── tasks/            # Task management page
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Home page
│   ├── components/           # Reusable components
│   │   ├── auth/             # Authentication components
│   │   ├── layout/           # Layout components
│   │   ├── tasks/            # Task components
│   │   └── ui/               # UI components
│   ├── contexts/             # React Context providers
│   │   └── TaskContext.tsx   # Global task state management
│   ├── lib/                  # Utilities
│   └── public/               # Static assets
├── API_DOCS.md               # Backend API documentation
├── spec.md                   # Project specification
├── history.md                # Development history
├── SUMMARY.md                # Project summary
├── requirements.txt          # Combined project dependencies
└── README.md                 # This file
```

## Architecture
- **Backend**: Python FastAPI with SQLModel ORM and JWT authentication
- **Frontend**: React Context API for state management with real-time synchronization
- **Components**: Reusable components for task management and chat interface
- **Persistence**: Database storage with PostgreSQL/SQLite and real-time synchronization
- **API Integration**: Frontend communicates with backend via REST API
- **UI**: Consistent design system with gradient backgrounds and smooth animations

## Technologies Used
- **Backend**: Python, FastAPI, SQLModel, SQLAlchemy, PostgreSQL/SQLite
- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Authentication**: JWT tokens, bcrypt password hashing
- **Storage**: PostgreSQL/SQLite database
- **API Communication**: REST API with fetch

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License
This project is licensed under the MIT License.