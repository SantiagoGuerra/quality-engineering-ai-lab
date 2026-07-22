# Expected failure: visual regression

This branch is intentionally broken for a Quality Engineering demonstration. It must never be merged.

- Expected failing gate: `Runtime quality` during `pnpm test:visual`.
- Expected difference: an unintended 24-pixel amber border appears on the login card on desktop and mobile.
- Expected evidence: expected, actual and diff PNGs plus the retained Playwright failure video and trace in the PR artifact.
- Expected healthy signals: build, lint, types, unit tests, security and dependency review remain green.
- Recovery: close the PR after the presentation or remove the demo `border-left` declaration from `apps/web/src/styles.css`.

Do not update the golden baselines for this branch: the product change is the regression being demonstrated.
