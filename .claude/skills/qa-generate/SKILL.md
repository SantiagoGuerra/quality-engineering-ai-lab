---
name: qa-generate
description: Generate reviewable Playwright tests from an approved plan using the official generator agent.
context: fork
agent: playwright-test-generator
disable-model-invocation: true
---

Generate only the approved scenario(s) from: $ARGUMENTS

Use semantic locators and the referenced seed. Keep every expected result as an explicit assertion. Never change an existing assertion/baseline, use `waitForTimeout`, add a skip, or touch product permissions. Run the narrow test, lint and typecheck. Leave a Git diff and report files/commands/results for human review; never commit, push or merge.
