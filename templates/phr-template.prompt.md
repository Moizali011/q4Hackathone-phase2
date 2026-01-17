---
id: {{ID}}
title: "{{TITLE}}"
stage: {{STAGE}}
date: {{DATE_ISO}}
surface: "agent"
model: "{{MODEL}}"
feature: "{{FEATURE}}"
branch: "{{BRANCH}}"
user: "{{USER}}"
command: "{{COMMAND}}"
labels: {{LABELS}}
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files: |
  {{FILES_YAML}}
tests: |
  {{TESTS_YAML}}
---

# {{TITLE}}

## Outcome
{{OUTCOME}}

## Evaluation
{{EVALUATION}}

## Prompt
```
{{PROMPT_TEXT}}
```

## Response
{{RESPONSE_TEXT}}