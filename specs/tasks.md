# Phase-2 Development Tasks

## Backend Tasks

### Database Setup
1. Set up Neon PostgreSQL connection configuration in backend
2. Install and configure SQLModel and database dependencies
3. Create database initialization and connection management utilities
4. Set up database session creation and cleanup middleware
5. Test database connectivity with Neon PostgreSQL

### SQLModel Schema
6. Create User SQLModel with id, email, password_hash, timestamps
7. Create Task SQLModel with user_id relationship, title, description, completed status
8. Define proper foreign key relationships between User and Task models
9. Add database constraints (unique email, required fields)
10. Create database migration utilities for schema changes

### JWT Middleware
11. Create JWT token creation utility with user_id payload
12. Implement JWT validation middleware for FastAPI
13. Create JWT secret configuration from environment variables
14. Add token expiration validation to middleware
15. Set up error handling for invalid/missing JWT tokens

### CRUD Endpoints
16. Create auth endpoints (register, login, logout) in FastAPI
17. Implement GET /api/tasks endpoint to retrieve user's tasks
18. Implement POST /api/tasks endpoint to create new tasks
19. Implement GET /api/tasks/{id} endpoint to retrieve specific task
20. Implement PUT /api/tasks/{id} endpoint to update tasks
21. Implement DELETE /api/tasks/{id} endpoint to delete tasks
22. Create Pydantic schemas for request/response validation
23. Add input validation for all API endpoints

### User Ownership Enforcement
24. Add user_id validation in all task endpoints to ensure ownership
25. Implement database queries that filter tasks by authenticated user
26. Create authorization checks for modifying/deleting tasks
27. Return appropriate error codes (403) for unauthorized access attempts
28. Test ownership enforcement with different user accounts

## Frontend Tasks

### Better Auth Configuration
29. Set up Better Auth client in Next.js frontend application
30. Configure auth provider for React context management
31. Create authentication state management utilities
32. Set up auth context provider in root layout
33. Test authentication flow with login/signup functionality

### JWT Handling
34. Implement secure JWT storage in browser (preferably httpOnly cookie if possible, otherwise secure local storage)
35. Create JWT retrieval and validation utilities
36. Implement token refresh mechanism if needed
37. Add token expiration handling and logout on expiration
38. Create JWT cleanup utilities for logout

### API Client
39. Create centralized API client for backend communication
40. Implement automatic JWT header attachment to requests
41. Add request/response error handling utilities
42. Create type-safe API request functions for each endpoint
43. Implement loading state management for API calls

### Task UI Pages
44. Create authentication pages (login/signup) using App Router
45. Build dashboard page to display user's tasks
46. Create task management page with CRUD functionality
47. Implement task detail page for viewing specific tasks
48. Build task creation/editing modal components
49. Design responsive UI components with Tailwind CSS
50. Add task completion toggle functionality

### Protected Routes
51. Create ProtectedRoute higher-order component
52. Implement authentication check before rendering protected content
53. Add redirect to login for unauthenticated users
54. Handle token expiration in protected routes
55. Create authentication context hooks for component access

## Integration Tasks

### Frontend ↔ Backend API Wiring
56. Connect frontend auth forms to backend auth endpoints
57. Integrate task CRUD operations with backend API
58. Test complete authentication flow from frontend to backend
59. Validate API responses and error handling between frontend and backend
60. Ensure consistent data formats between frontend and backend

### JWT Header Attachment
61. Configure API client to include JWT in Authorization header
62. Test JWT transmission from frontend to backend
63. Verify backend properly receives and validates JWT headers
64. Handle JWT header formatting (Bearer token)
65. Test header attachment for all API endpoints

### Error Handling
66. Implement consistent error response handling in frontend
67. Map backend error codes (401, 403, 404) to frontend messages
68. Create user-friendly error display components
69. Handle network errors and connection failures
70. Implement error logging for debugging purposes

### Auth State Management
71. Synchronize authentication state between frontend components
72. Implement auth state persistence across browser sessions
73. Handle concurrent auth state changes
74. Create auth state validation utilities
75. Test auth state management during token refresh/expiration

## DevOps / Config Tasks

### Environment Variables
76. Create .env.example file with all required environment variables
77. Set up JWT secret configuration in environment
78. Configure database connection string in environment
79. Add API URL configuration for frontend-backend communication
80. Implement environment-specific configurations (dev, test, prod)

### Neon DB Connection
81. Configure Neon PostgreSQL connection parameters
82. Set up connection pooling for database operations
83. Implement secure database credential handling
84. Test database connection in different environments
85. Configure database SSL settings for Neon

### Docker Compose Alignment
86. Create docker-compose.yml for local development
87. Configure services for frontend, backend, and database
88. Set up volume mounts for code synchronization
89. Configure network settings for service communication
90. Document Docker setup and usage instructions