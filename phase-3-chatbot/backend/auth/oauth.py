from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import JSONResponse
from sqlmodel import Session, select
from typing import Optional
import requests
from google.auth import jwt
from urllib.parse import urlencode
import os
from models.user import User
from database.database import get_session
from schemas.user import Token
from auth.jwt import create_access_token
from core.config import settings

router = APIRouter()

# Google OAuth Configuration
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI = f"{settings.FRONTEND_URL}/api/auth/google/callback" if settings.FRONTEND_URL else "http://localhost:3000/api/auth/google/callback"

# GitHub OAuth Configuration
GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")
GITHUB_REDIRECT_URI = f"{settings.FRONTEND_URL}/api/auth/github/callback" if settings.FRONTEND_URL else "http://localhost:3000/api/auth/github/callback"

@router.get("/google/login")
def google_login():
    """Initiate Google OAuth login flow"""
    if not GOOGLE_CLIENT_ID:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Google OAuth is not configured"
        )

    params = {
        "client_id": GOOGLE_CLIENT_ID,
        "redirect_uri": GOOGLE_REDIRECT_URI,
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline"
    }

    auth_url = f"https://accounts.google.com/o/oauth2/auth?{urlencode(params)}"
    return {"auth_url": auth_url}

@router.get("/google/callback")
def google_callback(code: str, session: Session = Depends(get_session)):
    """Handle Google OAuth callback and create/get user"""
    if not GOOGLE_CLIENT_ID or not GOOGLE_CLIENT_SECRET:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Google OAuth is not configured"
        )

    # Exchange authorization code for access token
    token_url = "https://oauth2.googleapis.com/token"
    token_data = {
        "client_id": GOOGLE_CLIENT_ID,
        "client_secret": GOOGLE_CLIENT_SECRET,
        "code": code,
        "grant_type": "authorization_code",
        "redirect_uri": GOOGLE_REDIRECT_URI
    }

    token_response = requests.post(token_url, data=token_data)
    token_json = token_response.json()

    if "access_token" not in token_json:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to get access token from Google"
        )

    # Get user info from Google
    user_info_response = requests.get(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        headers={"Authorization": f"Bearer {token_json['access_token']}"}
    )
    user_info = user_info_response.json()

    if "email" not in user_info:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to get user info from Google"
        )

    # Check if user already exists
    existing_user = session.exec(select(User).where(User.email == user_info["email"])).first()

    if existing_user:
        # User already exists, return token
        user = existing_user
    else:
        # Create new user
        user = User(
            email=user_info["email"],
            password_hash=""  # No password for OAuth users
        )
        session.add(user)
        session.commit()
        session.refresh(user)

    # Create access token
    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email}
    )

    # Return token (in a real app, you might want to redirect to frontend with token)
    return {"access_token": access_token, "token_type": "bearer", "email": user.email}

@router.get("/github/login")
def github_login():
    """Initiate GitHub OAuth login flow"""
    if not GITHUB_CLIENT_ID or not GITHUB_CLIENT_SECRET:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="GitHub OAuth is not configured"
        )

    params = {
        "client_id": GITHUB_CLIENT_ID,
        "redirect_uri": GITHUB_REDIRECT_URI,
        "scope": "user:email"
    }

    auth_url = f"https://github.com/login/oauth/authorize?{urlencode(params)}"
    return {"auth_url": auth_url}

@router.get("/github/callback")
def github_callback(code: str, session: Session = Depends(get_session)):
    """Handle GitHub OAuth callback and create/get user"""
    if not GITHUB_CLIENT_ID or not GITHUB_CLIENT_SECRET:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="GitHub OAuth is not configured"
        )

    # Exchange authorization code for access token
    token_url = "https://github.com/login/oauth/access_token"
    token_data = {
        "client_id": GITHUB_CLIENT_ID,
        "client_secret": GITHUB_CLIENT_SECRET,
        "code": code,
        "redirect_uri": GITHUB_REDIRECT_URI
    }

    headers = {"Accept": "application/json"}
    token_response = requests.post(token_url, data=token_data, headers=headers)
    token_json = token_response.json()

    if "access_token" not in token_json:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to get access token from GitHub"
        )

    # Get user info from GitHub
    user_headers = {
        "Authorization": f"Bearer {token_json['access_token']}",
        "Accept": "application/json"
    }
    user_response = requests.get("https://api.github.com/user", headers=user_headers)
    user_info = user_response.json()

    # Get user email from GitHub (emails might be private)
    email_response = requests.get("https://api.github.com/user/emails", headers=user_headers)
    emails = email_response.json()

    # Find primary email
    email = None
    for email_obj in emails:
        if email_obj.get("primary", False) and email_obj.get("verified", False):
            email = email_obj["email"]
            break

    # If no primary email found, use the first verified email
    if not email:
        for email_obj in emails:
            if email_obj.get("verified", False):
                email = email_obj["email"]
                break

    # If still no email found, use the email from user info if available
    if not email and "email" in user_info and user_info["email"]:
        email = user_info["email"]

    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to get email from GitHub user"
        )

    # Check if user already exists
    existing_user = session.exec(select(User).where(User.email == email)).first()

    if existing_user:
        # User already exists, return token
        user = existing_user
    else:
        # Create new user
        user = User(
            email=email,
            password_hash=""  # No password for OAuth users
        )
        session.add(user)
        session.commit()
        session.refresh(user)

    # Create access token
    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email}
    )

    # Return token
    return {"access_token": access_token, "token_type": "bearer", "email": email}