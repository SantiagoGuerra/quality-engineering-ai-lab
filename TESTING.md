# Estrategia de pruebas

## Comandos

| Nivel | Comando | Evidencia / intención |
|---|---|---|
| Unit | `pnpm test:unit` | JUnit/JSON y coverage de contratos críticos |
| Component | `pnpm test:components` | DOM, teclado, axe, loading/disabled/empty/error |
| Integration | `pnpm test:integration` | PostgreSQL 16 real con Testcontainers y cleanup |
| API | `pnpm test:api`, `pnpm test:api:hurl`, `pnpm test:api:schemathesis` | Fastify inject, declarativo y generativo OpenAPI |
| Property | `pnpm test:property` | fast-check, seed/shrinking reproducible |
| Mutation | `pnpm test:mutation` | Stryker focalizado en scoring crítico |
| E2E | `pnpm test:e2e:smoke`, `pnpm test:e2e:full` | HTML/JUnit/JSON, screenshot/video/trace/logs |
| A11y/visual | `pnpm test:a11y`, `pnpm test:visual` | axe y snapshots revisados |
| Resilience | `pnpm test:resilience` | latencia/corte/recuperación Toxiproxy |
| Security/perf | `pnpm test:security`, `pnpm test:dast`, `pnpm test:performance`, `pnpm test:lighthouse`, `pnpm test:sitespeed` | SARIF/SBOM/JSON, thresholds y diagnósticos HAR/video |

Cobertura global orientativa: líneas/funciones 75%, ramas 70%; módulos de contrato críticos están al 90%+. Código nuevo debe traer pruebas proporcionales al riesgo, revisado en diff/PR; no se persigue 100% global. Mutation se limita a `averageScore` para mantener feedback corto.

Property testing descubre combinaciones Unicode, límites, shrink cases e invariantes que una tabla de ejemplos omite. Stryker prueba la fuerza de las assertions, no cobertura. E2E usa roles/nombres semánticos, storage states por rol y API setup cuando reduce costo; `waitForTimeout` está prohibido.

Retries sólo en CI y como señal: primer fallo + retry exitoso se clasifica flaky, nunca se borra. La cuarentena sigue ejecutándose. Detalles: [docs/quality/flaky-tests.md](docs/quality/flaky-tests.md).
