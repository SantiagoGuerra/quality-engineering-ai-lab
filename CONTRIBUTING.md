# Contribuir

1. Crea una rama pequeña y añade/actualiza pruebas en el nivel más bajo que detecte el riesgo.
2. Usa sólo factories/seeds sintéticos; no copies producción.
3. Ejecuta `pnpm qa:check`; para cambios de flujo, también `pnpm qa:start && pnpm qa:smoke`.
4. Describe riesgo, seed, pruebas, cambios visuales, accesibilidad y migraciones en el PR.
5. No actualices snapshots visuales con una IA ni en una ejecución que también cambie el producto. Revisa el diff y usa explícitamente `pnpm exec playwright test --grep @visual --update-snapshots`.

Código humano y generado por IA comparte los mismos gates. Commits deben ser revisables; no se permiten assertions debilitadas, skips sin owner/fecha, secretos, datos reales, merges autónomos ni `pull_request_target`. Consulta [docs/quality/ai-governance.md](docs/quality/ai-governance.md).

Ownership se resuelve mediante `.github/CODEOWNERS`. Un fallo se clasifica antes de Jira; cuarentena requiere owner, issue y expiración. Reporta vulnerabilidades siguiendo [SECURITY.md](SECURITY.md), sin abrir detalles sensibles públicamente.
