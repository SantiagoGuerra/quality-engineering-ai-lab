---
name: qa-plan
description: Explore a local story and create a risk-based Playwright test plan without changing product code.
context: fork
agent: playwright-test-planner
disable-model-invocation: true
---

Plan this story or flow: $ARGUMENTS

1. Confirm `pnpm qa:doctor` and local health; never navigate outside localhost.
2. Read acceptance criteria, roles, OpenAPI, seeds and existing coverage.
3. Explore with the official Playwright planner tools using `tests/e2e/seed.spec.ts`.
4. Cover happy, negative, permission, network, accessibility, responsive and data boundaries. Map each scenario to `@p0`/`@p1` and a seed.
5. Save a reviewable plan under `specs/`; do not write tests or product code and do not approve the story.
