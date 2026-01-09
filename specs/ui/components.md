# UI Components Specification

## Component Structure
Next.js App Router with TypeScript and Tailwind CSS

## Core Components

### Authentication Components
1. **AuthPage** (pages/auth/page.tsx)
   - Container for auth forms
   - Tab navigation between login and signup
   - Error/success message display

2. **LoginForm** (components/auth/LoginForm.tsx)
   - Email input field
   - Password input field
   - Submit button
   - Form validation
   - Error handling

3. **SignupForm** (components/auth/SignupForm.tsx)
   - Email input field
   - Password input field
   - Confirm password field
   - Submit button
   - Form validation
   - Error handling

### Task Management Components
4. **TaskList** (components/tasks/TaskList.tsx)
   - Displays user's tasks in a list
   - Shows task title, description, and completion status
   - Provides action buttons (edit, delete, toggle completion)
   - Empty state when no tasks exist

5. **TaskItem** (components/tasks/TaskItem.tsx)
   - Individual task display
   - Checkbox for completion toggle
   - Title and description display
   - Action buttons (edit, delete)

6. **TaskForm** (components/tasks/TaskForm.tsx)
   - Form for creating/editing tasks
   - Title input field
   - Description textarea
   - Submit button
   - Form validation

7. **TaskModal** (components/tasks/TaskModal.tsx)
   - Modal wrapper for task creation/editing
   - Overlay and centered content
   - Close functionality

### Layout Components
8. **Header** (components/layout/Header.tsx)
   - Navigation bar
   - User profile dropdown/logout
   - Site branding

9. **Layout** (components/layout/Layout.tsx)
   - Main application layout
   - Consistent structure across pages
   - Header, main content, footer

### Utility Components
10. **ProtectedRoute** (components/auth/ProtectedRoute.tsx)
    - HOC to protect routes requiring authentication
    - Redirects unauthenticated users to login

11. **LoadingSpinner** (components/ui/LoadingSpinner.tsx)
    - Visual indicator for loading states
    - Used during API requests

12. **Toast** (components/ui/Toast.tsx)
    - Notification component for success/error messages
    - Auto-dismiss after timeout

## Styling Guidelines
- Use Tailwind CSS utility classes
- Consistent color palette
- Responsive design for all screen sizes
- Accessible color contrast ratios
- Keyboard navigation support

## State Management
- Use React Context API for authentication state
- Component-level state for form inputs
- Global state for user information