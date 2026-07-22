# Expected failure: unit regression

This branch is intentionally broken for a Quality Engineering demonstration. It must never be merged.

- Expected failing gate: `Static quality`.
- Expected assertion: `averageScore([2, 4])` returns `3`, while the demo test incorrectly expects `4`.
- Expected healthy signals: runtime, security and dependency review can still execute independently.
- Recovery: close the PR after the presentation or remove `tests/unit/intentional-regression.demo.test.ts`.

The wrong expectation is isolated in a test. Production code, fixtures and shared baselines are unchanged.
