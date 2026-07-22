# Jira dry-run e idempotencia

El adaptador REST usa ADF, marcador `[talent-lab-qa-automation:v1]`, búsqueda y update del mismo comentario. Nunca crea un issue por fallo. Redacta token/password/Bearer, limita frecuencia y falla cerrado.

```bash
pnpm jira:dry-run
JIRA_ENABLED=true pnpm jira:comment
JIRA_ENABLED=true pnpm jira:update
```

Variables: `JIRA_BASE_URL`, `JIRA_USER_EMAIL`, `JIRA_API_TOKEN`, `JIRA_ISSUE_KEY`, `JIRA_ENABLED`. Estados: PASSED, FAILED, FLAKY, INFRASTRUCTURE y NEEDS HUMAN REVIEW. Clasificaciones: defecto reproducible, flaky, infraestructura, dependencia externa, seguridad, accesibilidad, visual o revisión humana.

Jira recibe commit/rama/seed/resultado y enlaces de artifact con acceso controlado; videos grandes permanecen en CI. La ejecución por defecto escribe `reports/generated/jira/dry-run.json`. Tests unitarios verifican ADF, redacción, marcador/upsert e idempotencia.
