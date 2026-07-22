# Troubleshooting

Empieza siempre con `pnpm qa:doctor` y luego `docker compose ps -a` / `docker compose logs --tail=100 api web`.

- Puerto ocupado: cambia puertos en `.env` o usa el script de worktree; no mates procesos desconocidos.
- Docker no responde: inicia Docker Desktop/Engine y espera a que `docker info` pase.
- Seed/migración inconsistente: `pnpm qa:reset --seed default` recrea datos del volumen del proyecto actual.
- Browser ausente: `pnpm exec playwright install chromium firefox webkit`.
- GHCR TLS timeout: reintenta; Hurl tiene fallback oficial 8.0.1 desde GitHub Releases. Los scanners permanecen versionados en contenedores.
- Testcontainers `ECONNRESET`: comprueba Docker y que el wait strategy espere todas las líneas de inicialización.
- Snapshot visual: nunca uses update automáticamente; abre expected/actual/diff, decide y ejecuta el update explícito.
- E2E fallido: `pnpm exec playwright show-trace <trace.zip>`; revisa screenshot, video, `network.jsonl` y `console.jsonl`.
- Pa11y/Lighthouse: confirma que `qa:start` está saludable y que su browser configurado existe.
- Jira: `jira:dry-run` no requiere credenciales. Mutaciones fallan cerradas salvo `JIRA_ENABLED=true` más URL/email/token/issue.
- Reportes: `pnpm qa:report`; abre `reports/index.html`.

`qa:down` conserva datos; `qa:reset` es el reset reproducible autorizado para este laboratorio. No elimines volúmenes de otros proyectos Compose.
