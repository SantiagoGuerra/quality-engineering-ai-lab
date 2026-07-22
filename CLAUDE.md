# Quality Engineering agent policy

This repository is a local-only Quality Engineering laboratory. Read `README.md`, `TESTING.md`, `docs/quality/ai-governance.md` and the relevant story before acting.

## Non-negotiable boundaries

- Use only localhost, synthetic seeds and known QA accounts. Never use production, real candidate data, secrets or external DAST targets.
- AI may plan, explore, draft, generate reviewable diffs, analyze traces and classify results. It cannot approve a release, merge, close a bug, change permissions, disable a gate or publish data.
- Never change/remove/weaken assertions, add sleeps, skips or quarantine to make a test pass. Never update a visual baseline automatically.
- The Playwright healer is diagnosis/proposal-only. A human applies any patch and owns the decision.
- MCP and exploratory agents are non-blocking assistants. Deterministic CLI suites are the quality gates.
- Preserve pre-existing Git changes. All generated code remains visible in Git and must pass lint, typecheck and the narrow/full relevant suites.
- Record prompt intent, model/agent, files, commands, results and human decision in `artifacts/ai-audit/` for high-impact work.

## Local workflow

Run `pnpm qa:doctor`, `pnpm qa:start`, select a seed with `pnpm qa:reset -- --seed <scenario>`, then use a project skill. Stop with `pnpm qa:down`.

The current Claude Code convention is `.claude/skills/<name>/SKILL.md`; `.claude/commands/` is retained only for compatibility notes. Official Playwright agent definitions live in `.claude/agents/` and are regenerated with `pnpm agents:init`, after which these guardrails must be reviewed and restored.
