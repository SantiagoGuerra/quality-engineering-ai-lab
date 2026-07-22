# Matriz de herramientas

La tabla operacional solicitada (`Instalada`, `Configurada`, `Ejecutada`, `Resultado`, `Gate`, `Responsable`) está en [execution-inventory.md](execution-inventory.md).

Evaluación al 2026-07-21. `OSS`: sí/no; `Iface`: CLI/API/MCP; `Gate`: PR/Main/Nightly/Señal/No. Costo es de licencia/operación local: 0, bajo, medio, alto. “Ejecutar/quitar” da la entrada operativa; al retirar siempre se actualizan lockfile, CI, report index y esta matriz. Madurez/mantenimiento se revisan trimestralmente, no se infieren de una sola release.

| Categoría | Herramienta | OSS / licencia | Iface (CLI/API/MCP) | CI | Lenguajes | Madurez / mantenimiento | Curva / ruido / performance | Evidencia | Lock-in | Resuelve / no resuelve / riesgo | Recomendación | Estado | Gate / owner / costo | Ejecutar / quitar |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Monorepo | Turborepo | Sí / MIT | C/S/N | Sí | agnóstico | alta/activo | baja/bajo/rápido | logs/cache | bajo | orquesta; no modela arquitectura; cache stale | principal | adopt | PR/DevEx/0 | `pnpm build`; quitar turbo/config |
| Monorepo | Nx | Sí / MIT | C/API/N | Sí | JS+ | alta/activo | media/medio/rápido | graph/logs | medio | graph avanzado; más complejidad | alternativa | hold | No/DevEx/0 | no instalado; retirar evaluación |
| Unit | Vitest | Sí / MIT | C/API/N | Sí | TS/JS | alta/activo | baja/bajo/rápido | JUnit/JSON/coverage | bajo | tests rápidos; no browser real | principal | adopt | PR/Dev/0 | `pnpm test:unit`; quitar configs/deps |
| Unit | Jest | Sí / MIT | C/API/N | Sí | TS/JS | alta/activo | baja/medio/medio | JUnit/coverage | medio | ecosistema; Vite menos directo | alternativa | reject | No/Dev/0 | no instalado |
| Component | Testing Library | Sí / MIT | N/API/N | Sí | JS UI | alta/activo | baja/bajo/rápido | assertions DOM | bajo | conducta usuario; no layout | principal | adopt | PR/Frontend/0 | `test:components`; quitar deps |
| UI | Storybook | Sí / MIT | C/API/exp | Sí | JS UI | alta/activo | media/medio/medio | stories/a11y | medio | catálogo/interactions; no E2E | principal | adopt | PR/Design system/0 | `pnpm storybook`; quitar paquete/config |
| E2E | Playwright | Sí / Apache-2.0 | C/API/M | Sí | TS/JS+ | alta/activo | media/bajo/medio | HTML/JUnit/JSON/video/trace | bajo | browser real; no prueba manual | principal | adopt | PR+Main/QA/0 | `test:e2e:*`; quitar config/tests |
| E2E | Cypress | Sí / MIT | C/API/N | Sí | TS/JS | alta/activo | baja/medio/medio | video/screens | medio | DX; modelo/runtime paralelo | alternativa | hold | No/QA/0 | no instalado |
| E2E | WebdriverIO | Sí / MIT | C/API/N | Sí | TS/JS | alta/activo | alta/medio/lento | reports/video | bajo | WebDriver/mobile; más setup | alternativa | hold | No/QA/0 | no instalado |
| Generativo | fast-check | Sí / MIT | N/API/N | Sí | TS/JS | alta/activo | media/bajo/rápido | seed/shrink/JUnit | bajo | invariantes; no reemplaza ejemplos | principal | adopt | PR/Dev/0 | `test:property`; quitar dep/tests |
| Mutación | StrykerJS | Sí / Apache-2.0 | C/API/N | Sí | JS+ | alta/activo | alta/medio/lento | HTML/JSON/text | bajo | fuerza tests; caro global | focalizado | adopt | Nightly/QA/0 | `test:mutation`; quitar config/deps |
| A11y | axe-core | Sí / MPL-2.0 | N/API/N | Sí | web | alta/activo | baja/bajo/rápido | JSON | bajo | reglas automáticas; no AT manual | principal | adopt | PR/A11y/0 | `test:a11y`; quitar integrations |
| A11y | Pa11y | Sí / LGPL-3.0 | C/API/N | Sí | web | alta/activo | baja/medio/medio | CLI/JSON | bajo | páginas completas; posible ruido HTMLCS | complementa | adopt | Nightly/A11y/0 | `test:pa11y`; quitar config/dep |
| A11y/perf | Lighthouse CI | Sí / Apache-2.0 | C/API/N | Sí | web | alta/activo | media/medio/lento | HTML/JSON | bajo | budgets; variabilidad performance | señal | adopt | Nightly/WebPerf/0 | `test:lighthouse`; quitar config/dep |
| Visual | Lost Pixel | Sí / MIT | C/API/N | Sí | web | media/activo | media/medio/medio | diffs | medio | Storybook/URLs; duplica baseline | complemento futuro | trial | No/QA/0 | no instalado |
| Visual | Loki | Sí / MIT | C/API/N | Sí | Storybook | media/activo | media/medio/lento | diffs | medio | componentes; Docker/browser costo | alternativa | hold | No/UI/0 | no instalado |
| Visual | BackstopJS | Sí / MIT | C/API/N | Sí | web | alta/activo | media/medio/lento | HTML/diffs | medio | URL regression; config duplicada | alternativa | reject | No/QA/0 | no instalado |
| API | Hurl | Sí / Apache-2.0 | C/N/N | Sí | HTTP | alta/activo | baja/bajo/rápido | HTML/JUnit | bajo | flujos declarativos; no fuzz | principal | adopt | PR/API/0 | `test:api:hurl`; quitar script/files |
| API | Bruno CLI | Sí / MIT | C/API/N | Sí | HTTP | media/activo | baja/bajo/rápido | CLI/JUnit | bajo | colecciones; solapa Hurl | alternativa | hold | No/API/0 | no instalado |
| API | Schemathesis | Sí / MIT | C/API/N | Sí | OpenAPI | alta/activo | media/medio/medio | JUnit/repro case | bajo | fuzz/schema; requiere contrato preciso | principal | adopt | Main/API/0 | `test:api:schemathesis`; quitar script |
| Contract | Pact | Sí / MIT | C/API/N | Sí | multi | alta/activo | alta/medio/medio | pact files | medio | equipos independientes; no justificado aquí | reconsiderar al separar releases | hold | No/Arch/0 | no instalado |
| Integration | Testcontainers | Sí / MIT | N/API/N | Sí | multi | alta/activo | media/bajo/medio | test logs | bajo | dependencias reales; requiere Docker | principal | adopt | Main/Backend/0 | `test:integration`; quitar deps/tests |
| Mock | MSW | Sí / MIT | N/API/N | Sí | TS/JS | alta/activo | baja/bajo/rápido | request logs | bajo | red mock browser/node; no backend real | component fixtures | adopt | PR/Frontend/0 | componente tests; quitar handlers/dep |
| Mock | WireMock | Sí / Apache-2.0 | C/API/N | Sí | HTTP | alta/activo | media/medio/medio | journals | bajo | servicios externos complejos; JVM extra | alternativa | hold | No/Backend/0 | no instalado |
| Resilience | Toxiproxy | Sí / MIT | C/API/N | Sí | TCP | alta/activo | media/bajo/medio | proxy/toxic logs | bajo | fallas de red; no lógica negocio | principal | adopt | Main/Backend/0 | `test:resilience`; quitar compose/dep |
| SAST | Semgrep CE | Sí / LGPL-2.1 | C/API/N | Sí | multi | alta/activo | media/medio/medio | SARIF | bajo | patrones/dataflow limitado CE; falsos positivos | principal | adopt | PR/Security/0 | `test:security`; quitar rules/script |
| SAST | CodeQL | Sí parcial / MIT engine + terms | C/API/N | GitHub | multi | alta/activo | alta/bajo/lento | SARIF | alto GitHub | análisis profundo; plataforma/tiempo | repos GitHub elegibles | trial | Señal/Security/0 | workflow separado; quitar action |
| Secrets | Gitleaks | Sí / MIT | C/N/N | Sí | texto | alta/activo | baja/bajo/rápido | SARIF/JSON | bajo | patrones secretos; falsos positivos | principal | adopt | PR/Security/0 | `test:security`; quitar config/script |
| Secrets | TruffleHog | Sí / AGPL-3.0 | C/API/N | Sí | texto | alta/activo | media/medio/medio | JSON | bajo | verificación/entropía; red/ruido | alternativa | hold | No/Security/0 | no instalado |
| SBOM | Syft | Sí / Apache-2.0 | C/API/N | Sí | multi | alta/activo | baja/bajo/rápido | CycloneDX/SPDX | bajo | inventario; no decide riesgo | principal | adopt | PR/Security/0 | `test:sbom`; quitar script/image |
| Vulnerability | Grype | Sí / Apache-2.0 | C/API/N | Sí | multi | alta/activo | baja/medio/medio | JSON/table | bajo | CVEs SBOM; datos/EPSS necesitan triage | principal | adopt | PR/Security/0 | `test:sbom`; quitar script/cache |
| Vulnerability | Trivy | Sí / Apache-2.0 | C/API/N | Sí | multi | alta/activo | baja/medio/medio | SARIF/SBOM | bajo | all-in-one; solapa Syft/Grype | alternativa | hold | No/Security/0 | no instalado |
| IaC | Checkov | Sí / Apache-2.0 | C/API/N | Sí | IaC | alta/activo | media/alto/medio | SARIF | bajo | misconfig; baseline/ruido | señal hasta triage | adopt | Señal/DevSecOps/0 | `test:security`; quitar script |
| DAST | ZAP | Sí / Apache-2.0 | C/API/N | Sí | HTTP | alta/activo | alta/medio/lento | HTML/JSON/MD | bajo | runtime web; sólo local autorizado | baseline/main, active/nightly | adopt | Main/Security/0 | `test:dast`; quitar script |
| DAST | Nuclei | Sí / MIT | C/API/N | Sí | HTTP+ | alta/activo | media/alto/rápido | JSON/SARIF | bajo | templates controlados; riesgo de alcance | no necesario demo | hold | No/Security/0 | no instalado |
| Performance | k6 | Sí / AGPL-3.0 | C/API/N | Sí | JS | alta/activo | media/bajo/rápido | JSON | medio | carga/thresholds; no SLO por sí solo | principal | adopt | Nightly/Perf/0 | `test:performance`; quitar scripts/image |
| Performance | Artillery | Sí / MPL-2.0 | C/API/N | Sí | YAML/JS | alta/activo | baja/bajo/rápido | JSON | medio | escenarios carga; solapa k6 | alternativa | hold | No/Perf/0 | no instalado |
| WebPerf | sitespeed.io | Sí / MIT | C/API/N | Sí | web | alta/activo | alta/medio/lento | video/HAR/waterfall | bajo | diagnóstico rico; costoso PR | señal programada | trial | Nightly no gate/Perf/0 | `pnpm test:sitespeed`; quitar script/workflow |
| Reports | Allure | Sí / Apache-2.0 | C/API/N | Sí | multi | alta/activo | media/medio/medio | HTML/history | medio | portal uniforme; adapter burden | evaluar al crecer | hold | No/QA/0 | no instalado |
| Reports | ReportPortal | Sí / Apache-2.0 | C/API/N | Sí | multi | alta/activo | alta/medio/medio | servidor/analytics | alto operativo | triage central; infraestructura | demasiado para demo | reject | No/QA/medio | no instalado |
| Replay | OpenReplay | Sí / ELv2 | C/API/N | Sí | web | alta/activo | alta/medio/medio | replay/network | alto operativo | replay completo; backend/privacidad | alternativa self-host | hold | No/Privacy/medio | no instalado |
| Replay | rrweb | Sí / MIT | N/API/N | Sí | web | alta/activo | media/bajo/rápido | event stream local | bajo | captura DOM; privacidad exige controles | demo local enmascarada | adopt | No/Privacy/0 | env opt-in; quitar import/dep |
| AI test | Playwright Agents | Sí / Apache-2.0 | C/API/M | Sí | TS/JS | emergente/activo | alta/alto/lento | plan/test/proposal | medio | borradores/explora; no gate/merge | experimental con guardrails | trial | No/QA+human/variable | `agents:init`; quitar `.claude/agents` |
| Browser | Playwright CLI | Sí / Apache-2.0 | C/API/M | Sí | web | emergente/activo | media/medio/medio | session/screens | bajo | exploración token eficiente; no assertions gate | experimental | trial | No/QA/0 | installed skills; quitar dep/skill |
| MCP | Playwright MCP | Sí / Apache-2.0 | C/API/M | Sí | web | media/activo | media/medio/medio | browser actions | medio | control browser; prompt injection risk | aislado/headless | trial | No/QA/0 | `.mcp.json`; quitar entry |
| MCP | Chrome DevTools MCP | Sí / Apache-2.0 | C/API/M | Sí | web | emergente/activo | media/medio/medio | perf/devtools | medio | DevTools; acceso sesión sensible | aislado | trial | No/Dev/0 | `.mcp.json`; quitar entry |
| MCP | Storybook MCP | Sí / MIT | C/API/M | Sí | UI | preview/activo | media/medio/medio | story context | medio | contexto stories; preview React-only | experimental aislado | trial | No/UI/0 | Storybook URL; quitar addon/entry |
| MCP | Atlassian Rovo MCP | comercial / terms | N/API/M | Sí | Jira/Confluence | emergente/activo | media/medio/medio | work item context | alto Atlassian | Jira context; servicio/credentials | Jira REST basta | hold | No/QA/variable | no instalado |
| AI browser | Stagehand | Sí / MIT | C/API/N | Sí | TS | media/activo | media/medio/medio | steps | medio proveedor modelo | browser AI; nondeterminismo | evaluación | hold | No/QA/variable | no instalado |
| AI browser | Browser Use | Sí / MIT | C/API/N | Sí | Python | media/activo | alta/alto/lento | agent trajectory | medio | autonomía; superficie seguridad | no gate | hold | No/QA/variable | no instalado |
| AI test | Midscene.js | Sí / MIT | C/API/N | Sí | TS/JS | emergente/activo | media/alto/lento | reports/actions | medio | natural-language UI; nondeterminismo | evaluar | hold | No/QA/variable | no instalado |
| AI test | TestZeus Hercules | Sí / AGPL-3.0 | C/API/N | Sí | Python | emergente/activo | alta/alto/lento | generated tests | medio | generación multi-agent; operación pesada | no para baseline | reject | No/QA/variable | no instalado |

## Reglas de interpretación y mantenimiento

- Resultado verde significa que el motor no encontró violaciones dentro de su alcance; no es prueba de ausencia total.
- Owners: Dev mantiene unit/integration; Frontend/UI componentes/stories/visual; QA E2E/datos/reportes/Jira/flaky; Security scanners; Accessibility automático+manual; DevSecOps CI; Performance k6/budgets.
- Riesgos comunes: falsos positivos, drift de browser/DB, descarga de bases, exposición de artifacts y prompt injection en MCP. Fijar versiones, aislar, redactar y revisar.
- Fuentes de compatibilidad experimental: [Playwright Test Agents](https://playwright.dev/docs/test-agents), [Playwright CLI](https://playwright.dev/docs/getting-started-cli), [Playwright MCP](https://playwright.dev/docs/getting-started-mcp), [Storybook MCP](https://storybook.js.org/docs/ai/mcp/overview) y [Claude Code skills](https://code.claude.com/docs/en/slash-commands).
