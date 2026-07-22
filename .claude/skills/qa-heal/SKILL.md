---
name: qa-heal
description: Diagnose a failing Playwright test and return a proposed patch without applying it.
context: fork
agent: playwright-test-healer
disable-model-invocation: true
---

Diagnose: $ARGUMENTS

Inspect the failure, trace, screenshot, video, console and network evidence. Reproduce narrowly. Return root-cause classification and a proposed diff only. Never edit files, change assertions/baselines, skip/quarantine, merge or mark a defect fixed. Label any expectation change `NEEDS HUMAN REVIEW`.
