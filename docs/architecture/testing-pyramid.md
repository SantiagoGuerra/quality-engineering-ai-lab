# Pirámide y riesgos

La base rápida son unit/component/property; API/integration prueban límites reales; pocos E2E verifican journeys. Seguridad, accesibilidad, visual y rendimiento atraviesan niveles. La distribución es deliberada: feedback de PR en ~15–30 min; main ~30–50; nightly ~60–90 según pulls/cache/hardware.

| Riesgo | Primera señal | Profundidad |
|---|---|---|
| Permisos/validación | unit/API inject | Hurl, Schemathesis, E2E roles |
| Estado UI/teclado | component | axe/Playwright/Pa11y/manual AT |
| Persistencia/conflicto | unit repo | PostgreSQL Testcontainers/E2E |
| Red/SMTP | API fake | Compose, Mailpit, Toxiproxy |
| Regresión visual | component/story | Playwright snapshots revisados |
| Seguridad/supply chain | lint/SAST | SBOM, IaC, ZAP local |
| Capacidad | unit de cálculo | k6/Lighthouse/sitespeed trial |

Paralelización ocurre por jobs/suites y workers controlados; nunca se paralelizan tests que comparten seed mutable sin aislamiento.
