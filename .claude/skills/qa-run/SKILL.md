---
name: qa-run
description: Run deterministic local QA suites for a requested seed, tag or browser and classify the result.
disable-model-invocation: true
---

Run request: $ARGUMENTS

1. Run `pnpm qa:doctor`, then `pnpm qa:start` if health is unavailable.
2. Reset the requested synthetic seed. Default to `default`; document the actual seed.
3. Run the narrow deterministic suite first, then relevant lint/typecheck.
4. Preserve screenshots, video, traces, console/network logs and report metadata.
5. Classify failures as product, test, infrastructure or external dependency. Do not retry locally to hide a failure.
