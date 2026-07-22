# Herramientas

Consulta la [matriz comparativa](docs/tools/evaluation-matrix.md) y el [inventario real de ejecución](docs/tools/execution-inventory.md).

La selección evita motores propios: pnpm/Turbo orquestan; Vitest/Testing Library cubren nivel bajo; Playwright E2E/visual; axe/Pa11y/Lighthouse accesibilidad; Hurl/Schemathesis API; Testcontainers/Toxiproxy integración; Semgrep/Gitleaks/Syft/Grype/Checkov/ZAP seguridad; k6 performance. Stryker y fast-check profundizan señales. Jira REST sólo publica clasificación/evidencia y es dry-run por defecto.

Cada comando, gate, owner, licencia, costo, riesgo, alternativa y desinstalación está en [docs/tools/evaluation-matrix.md](docs/tools/evaluation-matrix.md). Interpretación común: salida no cero bloquea sólo si su nivel está marcado `Sí`; `Señal` exige triage humano; `Experimental` nunca decide calidad. Para retirar una herramienta: elimina script/config/dependencia, actualiza lockfile, workflow, `qa:report`, matriz y decisión; conserva artifacts por la retención acordada.

Storybook MCP está aislado como preview y Playwright/Chrome DevTools MCP son ayudas exploratorias, no gates. Pact queda `hold` por ausencia de equipos consumidor/proveedor independientes. Lost Pixel se evalúa como complemento open source, pero snapshots Playwright son el baseline adoptado para evitar doble infraestructura. sitespeed.io queda programado/no bloqueante por costo; el video E2E, trace y rrweb son evidencias distintas.
