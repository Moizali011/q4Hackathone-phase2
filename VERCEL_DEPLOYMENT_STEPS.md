# Vercel Deployment Steps

## Prerequisites
- Vercel account connected to your Google account
- GitHub repository already pushed (https://github.com/Moizali011/q4Hackathone-phase2)

## Step-by-Step Deployment Guide

### 1. Deploy the Frontend to Vercel

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Sign in with your Google account

2. **Create New Project**
   - Click "Add New" → "Project"
   - Select your GitHub account
   - Find and import the repository: `Moizali011/q4Hackathone-phase2`
   - Select the `frontend` directory as the root (or deploy the whole repo and Vercel will detect Next.js automatically)

3. **Configure Project Settings**
   - **Framework Preset**: Next.js (should auto-detect)
   - **Root Directory**: Leave empty or set to `frontend` if deploying from subdirectory
   - **Environment Variables**:
     - Add `NEXT_PUBLIC_API_URL` = `https://your-backend-domain.onrender.com` (replace with your actual backend URL)

4. **Build & Deploy**
   - Click "Deploy"
   - Wait for the build process to complete

### 2. Deploy the Backend (Separately)

Since the backend is a FastAPI application, you'll need to deploy it separately:

1. **Choose a Python Hosting Platform**:
   - Railway: https://railway.app
   - Render: https://render.com
   - PythonAnywhere: https://www.pythonanywhere.com

2. **Deploy Backend to Railway**:
   - Go to https://railway.app
   - Sign in and click "New Project"
   - Connect to your GitHub repository
   - Select the backend directory or create a separate backend repo
   - Set environment variables:
     - `JWT_SECRET_KEY`: Generate a strong secret key
     - `DATABASE_URL`: Use Railway's PostgreSQL addon
     - `ALLOWED_ORIGINS`: Set to your Vercel frontend URL (e.g., `https://your-frontend.vercel.app`)

### 3. Final Configuration

1. **Get Your Backend URL**
   - After deploying the backend, you'll get a URL like `https://your-backend.up.railway.app`

2. **Update Frontend Environment Variable**
   - Go back to your Vercel project settings
   - Update `NEXT_PUBLIC_API_URL` to your backend URL
   - Redeploy the frontend

### 4. Common Issues and Solutions

**Issue: 404 errors after deployment**
- Solution: Make sure you're using the simple vercel.json configuration:
```json
{
  "version": 2,
  "framework": "nextjs"
}
```

**Issue: API calls not working**
- Solution: Verify that `NEXT_PUBLIC_API_URL` is set correctly
- Solution: Check that your backend allows CORS from your frontend domain

**Issue: Authentication not working**
- Solution: Ensure JWT_SECRET_KEY is set on the backend
- Solution: Verify that both frontend and backend are using HTTPS in production

### 5. Testing Your Deployment

1. Visit your frontend URL (e.g., `https://your-frontend.vercel.app`)
2. Try registering a new user
3. Try creating and managing tasks
4. Verify that all features work as expected

## Environment Variables Summary

### Backend (set in your Python hosting platform):
- `JWT_SECRET_KEY`: Your secret key for JWT tokens
- `DATABASE_URL`: PostgreSQL connection string
- `ALLOWED_ORIGINS`: Comma-separated list of allowed frontend domains

### Frontend (set in Vercel dashboard):
- `NEXT_PUBLIC_API_URL`: Your deployed backend URL

## Troubleshooting Tips

1. **Check Browser Console**: Look for any error messages
2. **Check Network Tab**: Verify API calls are going to the correct URLs
3. **Verify URLs**: Ensure your backend URL is accessible and responding
4. **CORS Issues**: Make sure your backend allows requests from your frontend domain

## Success Indicators

- Frontend loads without 404 errors
- Registration/login works
- Task creation/deletion/updates work
- All features function as expected in production

Your project is now properly configured for deployment! Follow these steps carefully and your application should work perfectly on Vercel.