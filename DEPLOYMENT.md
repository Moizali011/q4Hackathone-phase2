# Deployment Guide

## Deploying Backend to Railway/Render (for API server)

The backend needs to be deployed to a service that supports FastAPI applications.

### Backend Setup:
1. Create a `Procfile` for deployment:
```
web: uvicorn main:app --host=0.0.0.0 --port=${PORT:-8000}
```

2. Update environment variables in your hosting platform:
   - JWT_SECRET_KEY (generate a strong random key)
   - DATABASE_URL (PostgreSQL connection string)

## Deploying Frontend to Vercel

### Prerequisites:
- A Vercel account
- The frontend code should be in a separate repository or properly configured

### Steps:
1. Navigate to the `frontend` directory
2. Set environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_API_URL`: Your deployed backend URL (e.g., https://your-backend-app.railway.app)
3. Connect your GitHub repository to Vercel
4. Vercel will automatically detect Next.js and build the project

### Common Vercel 404 Issues and Solutions:

1. **API Routes Not Working**:
   - Make sure your API routes in Next.js are properly placed in `pages/api/` or `app/api/`
   - Your current API routes are in `app/api/auth/[...nextauth]/route.ts` - this should work with the App Router

2. **Static Assets**:
   - Ensure static assets are in the `public/` folder

3. **Environment Variables**:
   - Make sure `NEXT_PUBLIC_API_URL` is set correctly in Vercel dashboard

## GitHub Repository Setup

### Steps to Push Complete Project:

1. Initialize git in the root directory:
```bash
git init
git add .
git commit -m "Initial commit: Full stack web application with authentication and task management"
```

2. Add your GitHub repository:
```bash
git remote add origin YOUR_GITHUB_REPO_URL
git branch -M main
git push -u origin main
```

### Repository Structure:
```
.
├── backend/
│   ├── main.py
│   ├── api/
│   │   ├── auth.py
│   │   └── tasks.py
│   ├── models/
│   ├── schemas/
│   ├── auth/
│   ├── database/
│   ├── core/
│   ├── utils/
│   ├── requirements.txt
│   └── CLAUDE.md
├── frontend/
│   ├── app/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── tasks/
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── components/
│   ├── lib/
│   ├── public/
│   ├── package.json
│   ├── next.config.mjs
│   └── CLAUDE.md
├── CLAUDE.md
├── DEPLOYMENT.md
└── TROUBLESHOOTING.md
```

## Recommended Deployment Architecture

### Backend (FastAPI):
- Deploy to Railway, Render, or AWS/Azure
- Use PostgreSQL database
- Enable SSL/HTTPS

### Frontend (Next.js):
- Deploy to Vercel
- Configure environment variables
- Set up custom domain if needed

### Environment Configuration:

#### Backend Environment Variables:
```
JWT_SECRET_KEY=your-super-secret-jwt-key-change-in-production
DATABASE_URL=postgresql://username:password@host:port/database_name
ALLOWED_ORIGINS=["https://your-frontend-domain.vercel.app"]
```

#### Frontend Environment Variables:
```
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
```

## Troubleshooting Vercel 404 Issues:

1. **Correct Vercel Configuration**:
   - Use minimal vercel.json:
   ```json
   {
     "version": 2,
     "framework": "nextjs"
   }
   ```
   - Don't over-configure routing, let Vercel handle Next.js automatically

2. **Next.js Configuration**:
   - Use proper next.config.js for dynamic features:
   ```javascript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     trailingSlash: false,
     images: {
       unoptimized: false
     },
     env: {
       NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
     },
     async rewrites() {
       return [
         {
           source: '/api/:path*',
           destination: process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api/:path*` : 'http://localhost:8000/api/:path*',
         },
       ]
     }
   }

   module.exports = nextConfig
   ```

3. **Verify Next.js App Router**:
   - Ensure your pages are in the correct `app/` directory structure
   - Check that you have proper layout.tsx and page.tsx files
   - Make sure you're not using static export if you need API routes

4. **API Route Issues**:
   - If using API routes, make sure they're properly placed in `app/api/` for the App Router
   - Backend API calls should be properly proxied through rewrites

## Build Commands:

### Backend (for deployment):
```bash
pip install -r requirements.txt
uvicorn main:app --host=0.0.0.0 --port=8000
```

### Frontend (for deployment):
```bash
npm install
npm run build
npm start
```

## Testing After Deployment:

1. Visit your frontend URL
2. Check that authentication works
3. Verify task operations work
4. Test API endpoints directly if accessible