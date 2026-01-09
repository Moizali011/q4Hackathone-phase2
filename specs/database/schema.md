# Database Schema Specification

## Database System
Neon Serverless PostgreSQL

## Tables

### users
```
id: UUID (Primary Key, Default: gen_random_uuid())
email: VARCHAR(255) (Unique, Not Null)
password_hash: VARCHAR(255) (Not Null)
created_at: TIMESTAMP (Default: NOW())
updated_at: TIMESTAMP (Default: NOW())
```

### tasks
```
id: UUID (Primary Key, Default: gen_random_uuid())
user_id: UUID (Foreign Key: users.id, Not Null)
title: VARCHAR(255) (Not Null)
description: TEXT (Optional)
completed: BOOLEAN (Default: FALSE)
created_at: TIMESTAMP (Default: NOW())
updated_at: TIMESTAMP (Default: NOW())
```

## Relationships
- tasks.user_id references users.id (One-to-Many: One user to Many tasks)

## Indexes
- users.email: Unique index for fast lookups
- tasks.user_id: Index for filtering tasks by user
- tasks.created_at: Index for sorting tasks by creation date

## Constraints
- users.email: UNIQUE constraint
- tasks.user_id: FOREIGN KEY constraint with CASCADE delete (deleting user removes all their tasks)
- tasks.title: NOT NULL constraint to ensure every task has a title

## ORM Models (SQLModel)
Based on the above schema, the SQLModel classes will be:

```python
class User(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    email: str = Field(sa_column=Column("email", String, unique=True, nullable=False))
    password_hash: str = Field(sa_column=Column("password_hash", String, nullable=False))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class Task(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="users.id", nullable=False)
    title: str = Field(sa_column=Column("title", String, nullable=False))
    description: Optional[str] = Field(sa_column=Column("description", Text))
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

## Security Considerations
- Never store plain text passwords - always use secure hashing
- Use parameterized queries to prevent SQL injection
- Validate user_id matches authenticated user on all operations