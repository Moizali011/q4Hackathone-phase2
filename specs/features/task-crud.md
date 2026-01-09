# Task CRUD Feature Specification

## Feature Description
Enable users to create, read, update, and delete tasks in a multi-user environment with proper authorization.

## Acceptance Criteria
- Users can create new tasks
- Users can view their own tasks only
- Users can update their own tasks
- Users can delete their own tasks
- Users cannot access tasks belonging to other users
- Task completion status can be toggled

## Functional Requirements
1. **Create Task**
   - User can submit a new task with title and optional description
   - Task is associated with the authenticated user
   - Task is stored in the database with user_id

2. **Read Tasks**
   - User can view a list of their own tasks
   - User can view details of a specific task they own
   - User cannot view tasks belonging to other users

3. **Update Task**
   - User can update their own task details
   - User can toggle task completion status
   - User cannot update tasks belonging to other users

4. **Delete Task**
   - User can delete their own tasks
   - User cannot delete tasks belonging to other users

## Security Requirements
- All operations require valid JWT authentication
- Task ownership must be validated on each request
- Users can only access their own tasks

## API Endpoints
- POST /api/tasks - Create a new task
- GET /api/tasks - Get user's tasks
- GET /api/tasks/{id} - Get a specific task
- PUT /api/tasks/{id} - Update a task
- DELETE /api/tasks/{id} - Delete a task

## Error Handling
- 401 Unauthorized: Invalid or missing JWT
- 403 Forbidden: User attempting to access another user's task
- 404 Not Found: Task doesn't exist
- 422 Validation Error: Invalid request data