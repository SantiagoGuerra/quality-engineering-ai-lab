# Quality gates

| Nivel | Bloquea | Señales | Tiempo orientativo |
|---|---|---|---|
| PR | build, lint, typecheck, unit, component, API, P0, axe, Gitleaks, Semgrep, críticos nuevos | Checkov triage | 15–35 min |
| Main | integración, E2E ampliado, Chromium+selección cross-browser, visual, Schemathesis sin 5xx, ZAP baseline | findings no nuevos | 30–50 min |
| Nightly | E2E full, mutación ≥90, property, Pa11y, DAST activo local, k6 thresholds, Lighthouse budgets | agents/sitespeed/flaky analysis | 60–90 min |

Un gate no se desactiva para obtener verde. Incidentes de infraestructura se reejecutan una vez después de evidencia; defectos reproducibles bloquean. Vulnerabilidades se comparan con baseline/SBOM anterior: críticas nuevas bloquean; existentes requieren owner/issue/fecha. Las excepciones son archivos revisables, temporales y auditados.

`qa:check` es el gate local. `qa:smoke` prueba el sistema levantado. MCP/agentes, Lighthouse performance y Checkov inicialmente son señales humanas. Release requiere decisión humana aunque CI esté verde.
