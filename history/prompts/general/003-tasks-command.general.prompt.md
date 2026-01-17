---
id: 3
title: "sp.tasks command execution"
stage: general
date: 2026-01-16
surface: "agent"
model: "claude-opus-4-5-20251101"
feature: "none"
branch: "master"
user: "user"
command: "sp.tasks"
labels: ["tasks", "implementation", "workflow"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files: |
  - specs/new-feature/tasks.md
tests: |
  - specs/new-feature/tasks.test.ts
---

# sp.tasks command execution

## Outcome
Generated actionable, dependency-ordered tasks for implementing the feature based on the specification and plan.

## Evaluation
Successfully created a comprehensive task breakdown that translates the feature specification and architectural plan into executable development tasks with clear dependencies and acceptance criteria.

## Prompt
```
sp.tasks: Generate an actionable, dependency-ordered tasks.md for the feature based on available design artifacts.
```

## Response
The sp.tasks skill generates an ordered task list by creating a tasks.md file that includes:
- Granular implementation tasks derived from specifications
- Dependency relationships between tasks
- Acceptance criteria for each task
- Estimated complexity and priority levels
- Cross-references to related specifications and designs