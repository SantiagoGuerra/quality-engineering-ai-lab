---
name: qa-jira
description: Produce or explicitly publish one idempotent Jira QA comment with redacted evidence links.
disable-model-invocation: true
---

Jira request: $ARGUMENTS

Always run `pnpm jira:dry-run` first and inspect `reports/generated/jira/dry-run.json`. Default to dry-run. Only a direct human instruction plus configured `JIRA_ENABLED=true` authorizes `jira:comment`/`jira:update`. Update the marker comment instead of spamming issues. Attach links, not large videos; redact secrets and never create an issue per failure.
