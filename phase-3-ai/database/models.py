from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID, uuid4
from sqlalchemy import Column, DateTime, Text, String, Boolean, ForeignKey
from sqlalchemy.sql import func


# Shared Task model that matches the backend model for database compatibility
class TaskBase(SQLModel):
    title: str = Field(sa_column=Column(String, nullable=False))
    description: Optional[str] = Field(sa_column=Column(Text))
    completed: bool = Field(default=False)


class Task(TaskBase, table=True):
    __tablename__ = "task"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: str = Field(sa_column=Column(String, nullable=False))  # Matches the backend model
    title: str = Field(sa_column=Column(String, nullable=False))
    description: Optional[str] = Field(sa_column=Column(Text))
    completed: bool = Field(default=False)
    created_at: datetime = Field(sa_column=Column(DateTime(timezone=True), server_default=func.now()))
    updated_at: datetime = Field(sa_column=Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now()))


class Message(SQLModel, table=True):
    __tablename__ = "messages"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    conversation_id: UUID = Field(foreign_key="conversations.id")
    role: str = Field(sa_column=Column(String, nullable=False))  # "user", "assistant", "system"
    content: str = Field(sa_column=Column(Text, nullable=False))
    timestamp: datetime = Field(sa_column=Column(DateTime(timezone=True), server_default=func.now()))
    user_id: str = Field(sa_column=Column(String, nullable=False))  # From JWT token


class Conversation(SQLModel, table=True):
    __tablename__ = "conversations"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: str = Field(sa_column=Column(String, nullable=False))  # From JWT token
    title: Optional[str] = Field(sa_column=Column(String))
    created_at: datetime = Field(sa_column=Column(DateTime(timezone=True), server_default=func.now()))
    updated_at: datetime = Field(sa_column=Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now()))
    system_prompt: Optional[str] = Field(sa_column=Column(Text))  # Stored system prompt for this conversation


class AgentSession(SQLModel, table=True):
    __tablename__ = "agent_sessions"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: str = Field(sa_column=Column(String, nullable=False))
    conversation_id: UUID = Field(foreign_key="conversations.id")
    agent_state: Optional[str] = Field(sa_column=Column(Text))  # JSON string for agent state
    created_at: datetime = Field(sa_column=Column(DateTime(timezone=True), server_default=func.now()))
    updated_at: datetime = Field(sa_column=Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now()))