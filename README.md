# Talent Lab QE

[![Main expanded quality](https://github.com/SantiagoGuerra/quality-engineering-ai-lab/actions/workflows/main.yml/badge.svg)](https://github.com/SantiagoGuerra/quality-engineering-ai-lab/actions/workflows/main.yml)
[![CodeQL](https://github.com/SantiagoGuerra/quality-engineering-ai-lab/actions/workflows/codeql.yml/badge.svg)](https://github.com/SantiagoGuerra/quality-engineering-ai-lab/actions/workflows/codeql.yml)
[![OpenSSF Scorecard](https://github.com/SantiagoGuerra/quality-engineering-ai-lab/actions/workflows/scorecard.yml/badge.svg)](https://github.com/SantiagoGuerra/quality-engineering-ai-lab/actions/workflows/scorecard.yml)

Laboratorio integral, local y reproducible de Quality Engineering sobre una plataforma de reclutamiento. Incluye React/Vite, Fastify, PostgreSQL, Mailpit y Toxiproxy; pruebas unitarias, componentes, API, integración, propiedades, mutación, E2E, visuales, accesibilidad, seguridad y rendimiento; evidencia unificada, Jira dry-run y guardrails para agentes.

Proyecto educativo publicado bajo licencia MIT. Los datos, cuentas y escenarios son completamente sintéticos.

## Arranque en cuatro comandos

Requisitos: Node `20.19.x`, pnpm `10.34.x` y Docker Desktop/Engine con Compose. Todas las cuentas y datos son sintéticos.

```bash
pnpm install --frozen-lockfile
pnpm qa:setup
pnpm qa:start
pnpm qa:smoke
```

Abre [web](http://localhost:4173), [OpenAPI](http://localhost:3001/docs) y [Mailpit](http://localhost:18025). Usuario recomendado: `recruiter@talent.test`; contraseña local: `QaDemo!2026`. Apaga con `pnpm qa:down`.

## Trabajo cotidiano

```bash
pnpm dev                 # desarrollo fuera de contenedores; requiere servicios
pnpm qa:check            # gate rápido antes del PR
pnpm qa:reset --seed candidate-creation
pnpm qa:report           # genera reports/index.html
pnpm qa:doctor           # diagnóstico completo
```

Seeds: `default`, `empty-state`, `candidate-creation`, `candidate-duplicate`, `permission-denied`, `interview-complete`, `performance-data` y `accessibility-review`. Con pnpm, tanto `pnpm qa:reset --seed x` como `pnpm qa:reset -- --seed x` son aceptados por los scripts.

## Arquitectura y calidad

- `apps/web` y `apps/api`: producto demostrativo.
- `packages/ui`, `contracts`, `database`, `testing`: sistema de diseño, contratos, persistencia y factories.
- `tests`: suites por nivel; las fixtures deliberadamente rotas están aisladas y nunca forman parte del producto normal.
- `scripts/qa`, `jira`, `reports`: adaptadores; no reimplementan motores existentes.
- `.github/workflows`: gates PR, main, nightly y manual contra `localhost`.

Empieza por [TESTING.md](TESTING.md), [QA_WORKFLOW.md](QA_WORKFLOW.md) y [TROUBLESHOOTING.md](TROUBLESHOOTING.md). La arquitectura está en [docs/architecture/system.md](docs/architecture/system.md), los gates en [docs/quality/quality-gates.md](docs/quality/quality-gates.md), la evidencia real en [docs/VALIDATION.md](docs/VALIDATION.md), los 25 demos en [docs/DEMONSTRATIONS.md](docs/DEMONSTRATIONS.md) y las mejoras en [docs/BACKLOG.md](docs/BACKLOG.md).

Para preparar una exposición, empieza por [la guía humana de QE e IA](docs/GUIA_HUMANA_QE_IA.md): explica roles, workflows, golden tests, screenshots, videos, trazas, límites de la IA y propone un guion de 30 minutos. Los PRs verdes y rojos de la demostración se catalogan en [docs/github/DEMO_PRS.md](docs/github/DEMO_PRS.md).

## Seguridad y privacidad

No uses datos reales. `.env` no se versiona. Jira muta únicamente con `JIRA_ENABLED=true` y credenciales explícitas. ZAP activo sólo apunta al laboratorio local. La demo rrweb está desactivada, no envía red, enmascara texto/inputs y mantiene máximo 500 eventos en memoria.

## Limitaciones honestas

Los objetivos de k6/Lighthouse/sitespeed son presupuestos de laboratorio, no SLO empresariales. MCP y agentes son experimentales, nunca gates. La UI cubre el flujo primario de candidatos/proyectos; entrevista, invitación y evaluación se prueban integralmente por la API documentada. Pact no se adopta porque web/API comparten contratos en el mismo monorepo; sitespeed.io queda `trial` y señal nightly por costo de ejecución.
