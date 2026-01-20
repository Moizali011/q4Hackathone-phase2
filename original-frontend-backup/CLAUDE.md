# Frontend Development Guidelines

## Tech Stack
- Next.js 16+ App Router
- TypeScript
- Tailwind CSS
- Better Auth for authentication

## Project Structure
```
frontend/
├── app/                 # Next.js App Router pages
│   ├── (auth)/          # Authentication pages
│   │   └── page.tsx
│   ├── dashboard/       # Dashboard page
│   │   └── page.tsx
│   ├── tasks/           # Task management pages
│   │   ├── page.tsx
│   │   └── [id]/        # Task detail page
│   │       └── page.tsx
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page
├── components/          # Reusable components
│   ├── auth/           # Authentication components
│   ├── tasks/          # Task management components
│   ├── layout/         # Layout components
│   └── ui/             # UI components
├── lib/                # Utilities and constants
├── types/              # TypeScript type definitions
└── public/             # Static assets
```

## Authentication Implementation
- Use Better Auth for frontend authentication
- Store JWT tokens securely
- Implement ProtectedRoute component
- Handle authentication state with React Context

## API Integration
- All API calls must include JWT in Authorization header
- Implement proper error handling for API responses
- Use async/await for API requests
- Implement loading states and error feedback

## Styling Guidelines
- Use Tailwind CSS utility classes
- Maintain consistent design system
- Implement responsive design
- Follow accessibility best practices

## Security Requirements
- Never expose JWT tokens in client-side code
- Validate authentication before rendering protected content
- Implement proper form validation
- Sanitize user inputs

## TypeScript Usage
- Define proper TypeScript interfaces for API responses
- Use strict typing throughout the application
- Implement type-safe API calls
- Create reusable type definitions in the types/ directory