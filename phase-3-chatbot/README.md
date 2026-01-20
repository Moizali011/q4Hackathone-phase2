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

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
1. Clone the repository
2. Navigate to the frontend directory
3. Install dependencies: `npm install`
4. Start the application: `npm run dev`

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
├── spec.md                   # Project specification
├── history.md                # Development history
└── README.md                 # This file
```

## Architecture
- **Global State**: TaskContext manages all task data across the application
- **Components**: Reusable components for task management and chat interface
- **Persistence**: Tasks stored in localStorage with real-time synchronization
- **UI**: Consistent design system with gradient backgrounds and smooth animations

## Technologies Used
- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Storage**: localStorage for persistence

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License
This project is licensed under the MIT License.