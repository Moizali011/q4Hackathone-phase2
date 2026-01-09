# UI Pages Specification

## Next.js App Router Structure

### Authentication Pages
1. **Login Page** (`/auth/login` or `/auth` with tabs)
   - Route: `/auth` (with login/signup tabs)
   - Components: AuthPage, LoginForm, SignupForm
   - Functionality: User authentication, form validation
   - Redirects: After login to dashboard (`/dashboard` or `/tasks`)

2. **Signup Page** (`/auth/signup` or `/auth` with tabs)
   - Route: `/auth` (with login/signup tabs)
   - Components: AuthPage, LoginForm, SignupForm
   - Functionality: User registration, form validation
   - Redirects: After signup to dashboard (`/dashboard` or `/tasks`)

### Main Application Pages
3. **Dashboard Page** (`/dashboard`)
   - Route: `/dashboard`
   - Components: Layout, Header, TaskList
   - Functionality: Shows user's tasks, quick stats
   - Fallback: Redirects to login if not authenticated

4. **Tasks Page** (`/tasks`)
   - Route: `/tasks`
   - Components: Layout, Header, TaskList, TaskModal, TaskForm
   - Functionality: Full task management interface
   - Fallback: Redirects to login if not authenticated

5. **Task Detail Page** (`/tasks/[id]`)
   - Route: `/tasks/[id]`
   - Components: Layout, Header, TaskItem
   - Functionality: View and edit specific task details
   - Fallback: Redirects to login if not authenticated

### Root Pages
6. **Home Page** (`/`)
   - Route: `/`
   - Components: Landing page or redirect to auth/dashboard
   - Functionality: Landing or redirect based on authentication status

7. **404 Page** (`/not-found`)
   - Route: `not-found`
   - Components: Custom 404 page
   - Functionality: Handle invalid routes

### API Routes
8. **Auth API** (`/api/auth`)
   - Route: `/api/auth/[...nextauth]` or `/api/auth/*`
   - Functionality: Handle authentication requests

9. **Task API** (`/api/tasks`)
   - Route: `/api/tasks`, `/api/tasks/[id]`
   - Functionality: Handle task CRUD operations

## Page Navigation
- Protected routes: All pages except auth require authentication
- Unauthenticated users redirected to `/auth`
- Navigation links in header based on authentication status
- Back button support for browser history

## SEO and Metadata
- Each page has appropriate title and meta description
- Open Graph tags for social sharing
- Canonical URLs
- Proper heading hierarchy (h1, h2, etc.)

## Error Handling
- 404 pages for non-existent routes
- Server error pages (500)
- Client-side error boundaries
- API error handling and user feedback