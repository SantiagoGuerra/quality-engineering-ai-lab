---
name: qa-triage
description: Triage QA artifacts into product, flaky, infrastructure, dependency, security, accessibility, visual or human-review outcomes.
disable-model-invocation: true
---

Triage: $ARGUMENTS

Use first-attempt/retry history, trace, screenshot, video, console/network logs, seed, browser and commit. Prefer reproducibility evidence over intuition. A retry pass is `FLAKY`, not `PASSED`. Quarantine needs an owner, linked issue and expiration; it continues to run. AI may recommend but cannot close the defect or approve release.
