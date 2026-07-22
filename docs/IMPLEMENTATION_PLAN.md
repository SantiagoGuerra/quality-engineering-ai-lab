# Plan de implementación

Estado: completado y validado el 2026-07-21. Este archivo es el registro vivo del laboratorio; las casillas se actualizaron únicamente después de implementar y verificar cada bloque.

## 1. Fundaciones

- [x] Inspeccionar el entorno y confirmar Node, pnpm, Docker, Compose, GitHub CLI y `uv`.
- [x] Inicializar Git sobre la carpeta vacía.
- [x] Crear el workspace pnpm/Turborepo con versiones fijas, TypeScript estricto, ESLint y lockfile.
- [x] Registrar decisiones, arquitectura y modelo de ownership.

## 2. Producto demostrativo

- [x] Implementar API Fastify con OpenAPI, validación, autenticación, roles, errores, logging, health y métricas.
- [x] Implementar persistencia PostgreSQL, migraciones, auditoría, idempotencia y control optimista.
- [x] Implementar seeds reproducibles para los ocho escenarios solicitados.
- [x] Implementar Mailpit e invitaciones sin credenciales reales.
- [x] Implementar web React/Vite para el flujo UI primario y API documentada para entrevistas/evaluaciones/resultados.
- [x] Implementar el paquete UI accesible y Storybook.

## 3. Entorno local

- [x] Implementar Docker Compose, health checks, redes/volúmenes aislables y scripts `qa:*`.
- [x] Implementar doctor, setup, start, reset, seed, smoke, check, report y down.
- [x] Implementar worktrees con puertos/proyectos Compose derivados del PR.

## 4. Pruebas

- [x] Unitarias y componentes con Vitest/Testing Library/MSW.
- [x] Property-based con fast-check.
- [x] Mutation testing focalizado con StrykerJS.
- [x] Integración con PostgreSQL real mediante Testcontainers.
- [x] API con Vitest, Hurl y Schemathesis.
- [x] E2E Playwright con smoke/full, roles, artifacts y matriz de navegadores.
- [x] Accesibilidad con axe, Storybook, Playwright, Pa11y y Lighthouse.
- [x] Visual con snapshots Playwright y Lost Pixel evaluado como complemento.
- [x] Resiliencia con Toxiproxy.
- [x] Performance con k6, Lighthouse CI y sitespeed.io como señal nightly.
- [x] Seguridad con Semgrep, Gitleaks, Syft/Grype, Checkov y ZAP.

## 5. Automatización y gobernanza

- [x] Implementar índice unificado de reportes y clasificación de fallos/flakiness.
- [x] Implementar Jira dry-run e idempotencia con ADF.
- [x] Configurar Playwright Agents/CLI/Skills/MCP y comandos de Claude Code con guardrails.
- [x] Configurar workflows PR, main, nightly y manual con permisos mínimos.
- [x] Documentar responsabilidades Dev/QA/herramientas/IA y gobierno de IA.

## 6. Demostraciones y cierre

- [x] Ejecutar y guardar evidencia de fallos intencionales, correcciones y estado final verde.
- [x] Ejecutar todos los comandos obligatorios y registrar resultado/duración/artifacts.
- [x] Completar documentación, matriz comparativa, backlog y riesgos abiertos.

## Decisiones iniciales

- React + Vite minimiza complejidad de runtime y permite un contenedor web estático.
- Fastify aporta validación, OpenAPI y pruebas por inyección sin levantar red.
- PostgreSQL cubre persistencia, auditoría, idempotencia y conflictos; Redis se mantiene evaluado, no adoptado, porque no añade valor suficiente al demo inicial.
- Los binarios no Node (Hurl, Schemathesis, scanners y k6) se encapsulan en imágenes versionadas para no contaminar la máquina local.
- Storybook MCP queda en modo experimental porque la API oficial continúa marcada como preview; no participa en gates determinísticos.
