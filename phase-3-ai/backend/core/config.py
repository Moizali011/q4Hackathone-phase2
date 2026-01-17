from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    # Database settings - reuse from main app
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./todoapp.db")

    # CORS settings
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",  # Next.js default port
        "http://localhost:3001",  # Next.js alternative port when 3000 is busy
        "http://localhost:3008",  # Next.js port when others are busy
        "http://127.0.0.1:3000",  # Alternative localhost format
        "http://127.0.0.1:3001",  # Alternative localhost format
        "http://127.0.0.1:3008",  # Alternative localhost format
        "http://localhost:3003",  # Additional port that might be used
        "http://127.0.0.1:3003"  # Additional port that might be used
    ]

    # MCP Server settings
    MCP_SERVER_HOST: str = os.getenv("MCP_SERVER_HOST", "localhost")
    MCP_SERVER_PORT: int = int(os.getenv("MCP_SERVER_PORT", "8002"))


settings = Settings()