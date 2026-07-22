# Flujo Dev, QA, herramientas e IA

Refinement reúne Producto, Diseño, Dev y QA para criterios, riesgos, negativos, roles, a11y, datos y automatización. Dev implementa producto, observabilidad y pruebas de nivel bajo; antes del PR ejecuta `pnpm qa:check`.

En PR, CI bloquea build/lint/typecheck, unit/component/API, P0, axe, secretos, SAST y críticos nuevos. QA local hace checkout y exploración:

```bash
gh pr checkout 123
pnpm install --frozen-lockfile
pnpm qa:setup && pnpm qa:start
pnpm qa:reset --seed candidate-creation
pnpm qa:smoke
```

QA valida reglas, negativos, extremos, roles, integraciones y a11y manual. Main añade integración, E2E, cross-browser, visual, Schemathesis y ZAP Baseline. Nightly ejecuta mutación, propiedades intensivas, Pa11y, ZAP activo local, k6, Lighthouse, sitespeed.io no bloqueante y análisis flaky. Release exige smoke del artefacto, migraciones/rollback, seguridad, performance, a11y manual, exploración y observabilidad.

Para ramas paralelas: `pnpm qa:worktree:create --pr 123`; los puertos y `COMPOSE_PROJECT_NAME` se derivan del PR. Retira con `pnpm qa:worktree:remove --pr 123` después de apagar ese entorno. IA propone y deja cambios revisables; humanos deciden bugs, baselines, excepciones, releases y merge.
