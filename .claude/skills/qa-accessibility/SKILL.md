---
name: qa-accessibility
description: Run automated and guide manual WCAG 2.2 AA checks against the local product.
disable-model-invocation: true
---

Accessibility scope: $ARGUMENTS

Run `pnpm test:components`, `pnpm test:a11y` and, when requested, `pnpm test:pa11y`. Inspect semantic structure, focus, dialogs, live regions, forms, tables, 200% zoom and reflow. Report tool limitations (including incomplete automated contrast/AT coverage). Never waive a finding or alter a baseline automatically.
