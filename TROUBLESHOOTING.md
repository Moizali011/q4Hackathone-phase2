# Troubleshooting Guide for Network Connection Issues

## Problem: "Network error - please check your connection and ensure the server is running"

This error occurs when the frontend cannot connect to the backend API server.

## Solution Steps:

### 1. Verify Backend Server is Running
- Open a terminal/command prompt
- Navigate to the backend directory: `cd backend`
- Start the server: `uvicorn main:app --reload --port 8000`
- You should see output indicating the server is running on http://127.0.0.1:8000

### 2. Check Environment Variables
- Ensure frontend `.env.local` contains: `NEXT_PUBLIC_API_URL=http://127.0.0.1:8000`
- This should match where your backend server is running

### 3. Verify Both Servers Are Active
- Backend should be accessible at: http://127.0.0.1:8000/health
- Frontend should be accessible at: http://localhost:3000

### 4. Common Port Issues
- Make sure port 8000 is not used by another application
- If using a different port for the backend, update NEXT_PUBLIC_API_URL accordingly

### 5. Firewall/Security Software
- Ensure your firewall or antivirus is not blocking connections on ports 8000 or 3000

## To run the application:
1. Terminal 1 (Backend):
   ```
   cd backend
   pip install -r requirements.txt
   uvicorn main:app --reload --port 8000
   ```

2. Terminal 2 (Frontend):
   ```
   cd frontend
   npm install
   npm run dev
   ```

## Testing the Connection:
Once both servers are running, visit:
- Backend health check: http://127.0.0.1:8000/health
- Frontend app: http://localhost:3000