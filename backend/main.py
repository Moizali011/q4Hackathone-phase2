import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import auth, tasks
from core.config import settings
from database.init_db import init_db

# Create FastAPI app instance
app = FastAPI(title="Full Stack Todo API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(tasks.router, prefix="/api/tasks", tags=["tasks"])

# Include OAuth routes separately to avoid circular imports
from auth.oauth import router as oauth_router
app.include_router(oauth_router, prefix="/api/auth/oauth", tags=["oauth"])

# Event handlers
@app.on_event("startup")
def on_startup():
    init_db()

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Full Stack Todo API is running"}

# Health check endpoint
@app.get("/health")
def health_check():
    return {"status": "healthy"}