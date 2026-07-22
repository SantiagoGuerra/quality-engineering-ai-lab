# CI workflow

PR usa permisos `contents: read`, sin secrets y sin `pull_request_target`. Compose levanta localhost dentro del runner. Acciones están fijadas por SHA; pnpm usa lockfile. Main amplía cobertura; nightly ejecuta profundidad y agentes no bloqueantes; manual selecciona seed/suite/browser/Jira dry-run. `if: always()` conserva artifacts y apaga Compose.

Artifacts contienen metadatos commit/rama/seed/browser/OS/timestamp. Secrets sólo pueden entrar en jobs internos explícitos; un PR de fork nunca recibe Jira tokens. Renovar SHAs/dependencias requiere revisión de release notes y gate completo.
