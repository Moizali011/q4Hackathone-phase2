# Phase-3 AI-Powered Conversational Chatbot

## Overview
An AI-powered chatbot that integrates with the existing Todo application using natural language processing. The chatbot is completely isolated as a separate AI layer that communicates via APIs and shared database models.

## Architecture
- **Frontend**: OpenAI ChatKit for conversational UI
- **Backend**: Python FastAPI with OpenAI Agents SDK
- **MCP Server**: Built with Official MCP SDK for database operations
- **Database**: Neon PostgreSQL with SQLModel ORM (shared with existing app)
- **Authentication**: Better Auth integration

## Key Features
- Natural language task management (add, delete, update, complete, organize any type of task)
- Handles work, personal, reminders, projects, and any other type of tasks users want to create
- Task overviews and summaries
- Error-free user experience
- Persistent conversation history
- MCP-driven data operations
- Flexible interpretation of user requests as task management operations

## Isolation Principle
Phase-3 operates independently and only interacts with the existing application through:
- Shared database models
- API endpoints
- MCP server for mutations
- Never modifies Phase-1 or Phase-2 logic directly