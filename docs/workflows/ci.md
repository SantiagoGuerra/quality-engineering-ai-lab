# CI workflow

PR separa cuatro jobs con permisos `contents: read`: calidad estática, runtime, seguridad y revisión de dependencias. No usa `pull_request_target` ni entrega secrets al código evaluado. Un quinto job recibe `issues: write` sólo para actualizar el resumen; antes de ejecutar el publicador hace checkout del SHA confiable de la rama base y no corre para forks. Compose levanta localhost dentro del runner. Las acciones están fijadas por SHA; pnpm usa lockfile. Harden-Runner observa el tráfico de todos los runners.

CodeQL publica análisis semántico en Code Scanning; Dependency Review bloquea dependencias nuevas con severidad alta; Dependabot propone actualizaciones semanales de pnpm y Actions; OpenSSF Scorecard observa prácticas del repositorio público. Main amplía cobertura; nightly ejecuta profundidad y agentes no bloqueantes; manual selecciona seed/suite/browser/Jira dry-run. `if: always()` conserva artifacts y apaga Compose.

Artifacts contienen metadatos commit/rama/seed/browser/OS/timestamp, screenshots, videos y trazas de fallo. El comentario enlaza la ejecución e incluye el resultado por gate y el inventario estructurado de herramientas. Secrets sólo pueden entrar en jobs internos explícitos; un PR de fork nunca recibe Jira tokens ni permiso de comentario. Renovar SHAs/dependencias requiere revisión de release notes y gate completo.
