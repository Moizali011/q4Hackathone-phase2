# Phase-2 Implementation Plan

## 1. Monorepo Setup Overview

### 1.1 Spec-Kit Structure
- specs/ directory contains all feature specifications
- .specify/ contains templates and configuration
- frontend/ and backend/ directories for respective codebases
- CLAUDE.md files guide implementation per layer
- specs/ contains detailed requirements for each feature

### 1.2 CLAUDE.md Usage
- frontend/CLAUDE.md: Guides Next.js implementation with TypeScript and Tailwind
- backend/CLAUDE.md: Guides FastAPI implementation with SQLModel and PostgreSQL
- Root CLAUDE.md: Contains overall project constraints and workflow

### 1.3 Frontend vs Backend Responsibilities
- Frontend: UI rendering, user interactions, authentication UI, API calls
- Backend: Data persistence, authentication logic, JWT validation, business logic
- Shared: Authentication tokens, API contracts, security requirements

## 2. Backend Architecture

### 2.1 FastAPI App Structure
- main.py: FastAPI application instance with CORS configuration
- api/: Route modules (auth.py, tasks.py)
- models/: SQLModel database models (user.py, task.py)
- schemas/: Pydantic request/response schemas (user.py, task.py)
- database/: Database connection and session management (database.py)
- auth/: JWT utilities and authentication logic (jwt.py)
- core/: Configuration and security utilities (config.py, security.py)

### 2.2 SQLModel Models
- User model: id, email (unique), password_hash, timestamps
- Task model: id, user_id (FK), title, description, completed, timestamps
- Proper relationships and constraints as defined in schema spec

### 2.3 Neon PostgreSQL Connection
- Database connection string from environment variables
- Connection pooling configuration
- Async database operations using SQLModel
- Environment-specific configurations (dev, test, prod)

### 2.4 JWT Verification Middleware
- Custom middleware to validate JWT tokens
- Extract user_id from token payload
- Attach user info to request context
- Return 401 for invalid/missing tokens

### 2.5 REST API Route Organization
- All routes under /api/ prefix
- auth endpoints: register, login, logout
- tasks endpoints: CRUD operations with user ownership validation
- Consistent error response format

## 3. Authentication Flow

### 3.1 Better Auth Setup on Frontend
- Initialize Better Auth client in Next.js app
- Configure auth provider for React context
- Implement login/signup forms with validation
- Store JWT tokens securely in browser

### 3.2 JWT Issuance
- Generate JWT with user_id payload on successful authentication
- Set appropriate expiration time
- Sign with secure secret stored in environment
- Return token to frontend after successful login/signup

### 3.3 JWT Validation in FastAPI
- Verify token signature against shared secret
- Extract and validate user_id from payload
- Check token expiration
- Return 401 for invalid tokens

### 3.4 Shared Secret via Environment Variable
- Store JWT secret in environment variables
- Use different secrets for different environments
- Never hardcode secrets in source code
- Secure handling of environment configuration

## 4. Frontend Architecture

### 4.1 Next.js App Router Structure
- app/ directory using App Router conventions
- (auth)/ route group for authentication pages
- dashboard/ and tasks/ routes for main application
- layout.tsx for consistent application layout
- page.tsx files for individual pages

### 4.2 Server vs Client Components
- Server components for data fetching and server-side logic
- Client components for user interactions and state management
- Proper use of "use client" directive where needed
- Optimize server components for performance

### 4.3 API Client Abstraction
- Centralized API client module for all backend calls
- Include JWT token in Authorization header automatically
- Handle common error responses consistently
- Implement retry logic for failed requests

### 4.4 Protected Routes
- Higher-order component or hook for authentication checks
- Redirect unauthenticated users to login page
- Check authentication status before rendering protected content
- Handle token expiration gracefully

## 5. Data Flow

### 5.1 Login → JWT
- User submits credentials via login form
- Frontend sends credentials to backend auth endpoint
- Backend validates credentials and creates JWT
- JWT returned to frontend and stored securely

### 5.2 API Call with Authorization Header
- Frontend includes JWT in Authorization header for API requests
- Format: "Bearer <token>"
- Backend middleware validates JWT before processing request
- Backend extracts user_id from token for authorization

### 5.3 Backend Token Validation
- Verify JWT signature against secret
- Check token expiration
- Extract user_id for authorization checks
- Return 401 for invalid tokens

### 5.4 User-Scoped DB Queries
- Backend validates that user_id from token matches resource ownership
- Query tasks filtered by authenticated user's ID
- Return 403 for attempts to access other users' resources
- Apply user filtering to all database operations

## 6. Development Phases

### Phase 1: Authentication Setup
1. Set up Better Auth in frontend application
2. Implement JWT creation and validation in backend
3. Create auth endpoints (register, login, logout)
4. Implement protected route components
5. Test authentication flow end-to-end

### Phase 2: Database & Models
1. Set up Neon PostgreSQL connection
2. Create SQLModel models for User and Task
3. Implement database initialization and migration
4. Test database operations with sample data
5. Implement proper error handling for database operations

### Phase 3: API CRUD Implementation
1. Implement task CRUD endpoints in FastAPI
2. Add JWT validation middleware to all endpoints
3. Implement user ownership validation for all operations
4. Create Pydantic schemas for request/response validation
5. Test API endpoints with authentication and authorization

### Phase 4: Frontend Integration
1. Create task management UI components
2. Integrate with backend API endpoints
3. Implement task creation, reading, updating, and deletion
4. Add loading states and error handling
5. Test complete frontend workflow

### Phase 5: Security Enforcement
1. Review all endpoints for proper JWT validation
2. Verify user ownership enforcement on all operations
3. Test security by attempting unauthorized access
4. Implement additional security measures as needed
5. Conduct security review and testing

### Phase 6: Integration & Testing
1. End-to-end testing of all features
2. Performance optimization
3. Error handling refinement
4. Final security audit
5. Documentation and deployment preparation