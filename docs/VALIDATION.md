# Validación real

Ejecución de cierre: 2026-07-21 America/Bogota (2026-07-22 UTC), macOS arm64, Node 20.19.4, pnpm 10.34.5, Docker 29.5.3 y Compose 5.1.4. Los tiempos son los observados en esta máquina y no son SLO. Los reportes generados se mantienen fuera de Git; `pnpm qa:report` crea el índice local.

## Comandos obligatorios

| Comando                          |       Resultado |      Duración observada | Error/corrección relevante                                                                             | Evidencia principal                         |
| -------------------------------- | --------------: | ----------------------: | ------------------------------------------------------------------------------------------------------ | ------------------------------------------- |
| `pnpm install --frozen-lockfile` |            PASS |          0.9 s cacheado | tras añadir overrides el primer frozen rechazó el lock desactualizado; se regeneró y se repitió frozen | `pnpm-lock.yaml`                            |
| `pnpm build`                     |            PASS |              ~8 s local | sin errores                                                                                            | `apps/*/dist`, `packages/*/dist`            |
| `pnpm lint`                      |            PASS |                    ~5 s | sin errores                                                                                            | terminal/CI                                 |
| `pnpm typecheck`                 |            PASS |                    ~4 s | sin errores, TypeScript strict                                                                         | terminal/CI                                 |
| `pnpm test`                      |            PASS |                    ~7 s | unit, component, API y properties verdes                                                               | `reports/generated/vitest/`                 |
| `pnpm test:unit`                 |     PASS, 20/20 |                    <1 s | incluye render e idempotencia del comentario GitHub                                                    | JUnit, JSON, coverage HTML                  |
| `pnpm test:components`           |            PASS |                    <1 s | teclado, estados y axe                                                                                 | JUnit/JSON                                  |
| `pnpm test:integration`          |       PASS, 1/1 |                  ~5.2 s | PostgreSQL real levantado/limpiado por Testcontainers                                                  | JUnit/JSON                                  |
| `pnpm test:api`                  |       PASS, 6/6 |                  ~2.2 s | se añadió regresión para mapear validación Fastify a 400                                               | JUnit/JSON                                  |
| `pnpm test:e2e:smoke`            |       PASS, 4/4 |                   4.4 s | sin retries                                                                                            | Playwright HTML/JUnit/JSON                  |
| `pnpm test:a11y`                 |       PASS, 3/3 |                    ~4 s | producto con 0 violaciones; fixture rota detectada                                                     | Playwright + `axe/intentional-fixture.json` |
| `pnpm test:property`             |       PASS, 7/7 |                    <1 s | caso deliberado reducido y retirado                                                                    | JUnit/JSON                                  |
| `pnpm test:mutation`             |      PASS, 100% |                   ~10 s | 9/9 mutantes críticos muertos                                                                          | Stryker HTML/JSON                           |
| `pnpm qa:doctor`                 | PASS, 21 checks |                    ~2 s | puertos, env, browsers, servicios, migración y seed verificados                                        | salida estructurada                         |
| `pnpm qa:setup`                  |            PASS | dependiente de descarga | un primer intento detectó puertos >65535; se corrigió la derivación y se repitió                       | `.env`, browsers instalados                 |
| `pnpm qa:smoke`                  |            PASS |                    ~6 s | Playwright 4/4 + Hurl 9/9                                                                              | Playwright + Hurl HTML                      |
| `pnpm jira:dry-run`              |            PASS |                    <1 s | no se hizo ninguna mutación externa                                                                    | `reports/generated/jira/dry-run.json`       |

## Suites ampliadas y señales

| Comando                                   | Resultado real             | Observación/artifacts                                                                                                                       |
| ----------------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm test:e2e:full`                      | PASS, 55/55 en 27.3 s      | Chromium, Firefox, WebKit, desktop, mobile y roles; el primer ciclo reveló y permitió corregir el falso “session expired” en login inválido |
| `pnpm test:visual`                        | PASS, 8/8                  | 7 golden states Darwin revisados explícitamente más setup autenticado                                                                       |
| `pnpm test:visual:linux`                  | PASS, 8/8                  | mismos 7 golden states en la imagen oficial Playwright fijada por digest y usuario no-root                                                  |
| `pnpm test:workflows`                     | PASS                       | actionlint 1.7.12 validó los seis workflows                                                                                                 |
| `pnpm test:api:hurl`                      | PASS, 9 requests en 164 ms | health, login, CRUD, permisos, validación, paginación e idempotencia                                                                        |
| `pnpm test:api:schemathesis`              | PASS, 280/280 casos        | seed `20260721`; encontró inicialmente un 500 para login corto y confirmó la corrección                                                     |
| `pnpm test:pa11y`                         | PASS, 0 errores            | se corrigió `autocomplete=username` por `email` para el flujo local                                                                         |
| `pnpm test:lighthouse`                    | PASS                       | categorías y asset budgets explícitos; performance se trata como señal variable                                                             |
| `pnpm test:security`                      | PASS                       | Semgrep 76 reglas/0 hallazgos, Gitleaks 0, SBOM CycloneDX+SPDX, Grype 0 Critical/High y Checkov 0 resultados no suprimidos                  |
| `pnpm test:dast`                          | PASS                       | ZAP Baseline: 0 fallos, 65 pass, 2 avisos informativos (`Non-Storable Content`, SPA)                                                        |
| `pnpm test:performance`                   | PASS                       | k6 5/5, error 0%, p95 1.5 ms, p99 <1 s y thresholds cumplidos                                                                               |
| `pnpm test:resilience`                    | PASS, 2/2 en ~5.3 s        | latencia/corte/recuperación mediante Toxiproxy, sin retries infinitos                                                                       |
| `pnpm test:sitespeed`                     | PASS, 3 runs               | HTML, HAR/waterfall y videos; TTFB mediano 9 ms, LCP 120 ms, CLS 0                                                                          |
| `pnpm storybook:build`                    | PASS                       | catálogo estático con addon a11y y MCP aislado                                                                                              |
| `bash scripts/qa/security-demo.sh`        | PASS esperado              | fixture: Gitleaks detectó clave falsa y Semgrep detectó `eval`; ambas fuera del scan verde                                                  |
| `pnpm qa:reset --seed candidate-creation` | PASS                       | reset completo reproducible; luego `qa:seed --seed default` restauró baseline                                                               |

## Validación remota del repositorio

El repositorio público es [SantiagoGuerra/quality-engineering-ai-lab](https://github.com/SantiagoGuerra/quality-engineering-ai-lab). `main` acepta sólo squash y elimina el branch después del merge. Secret scanning, push protection y actualizaciones de seguridad de Dependabot están habilitados.

La protección de `main` se verificó mediante la API de GitHub con estas reglas activas:

- branch actualizado y cuatro checks obligatorios: `Static quality`, `Runtime quality`, `Security quality` y `Dependency review`;
- una aprobación, aprobación del último push y resolución de conversaciones;
- aplicación también a administradores, historial lineal y prohibición de force-push y borrado.

La alerta Dependabot de `uuid` quedó en estado `fixed` el 22 de julio de 2026 mediante el override a `11.1.1`. Los PRs publican un único comentario idempotente con el estado de los cuatro gates, commit, seed, ejecución y las 34 herramientas; los jobs que ejecutan el código propuesto conservan permisos de sólo lectura.

## Correcciones derivadas de las ejecuciones

- Puertos Compose inválidos al derivarlos: se limitó el rango y `qa:setup` quedó verde.
- Health check de Toxiproxy apuntaba a una ruta inexistente: se corrigió a `/toxiproxy`.
- Login inválido disparaba “sesión expirada” sin sesión previa: el evento 401 ahora requiere token.
- Un selector E2E de estado era ambiguo: se sustituyó por localización semántica más específica.
- Fastify transformaba validación propia en 500: ahora responde 400 y Schemathesis no encuentra 5xx inesperados.
- Pa11y objetó el propósito del campo email: se corrigió el autocomplete.
- Lighthouse tenía un preset demasiado amplio: se definieron categorías y budgets del laboratorio.
- ZAP encontró headers ausentes: nginx ahora aplica CSP, anti-clickjacking, nosniff, referrer/permissions y aislamiento.
- Semgrep/Gitleaks/Syft tenían mounts o exclusiones incorrectas: se ajustaron sin silenciar código fuente.
- Grype encontró dos High transitivos de `tmp` en Lighthouse CI: override a `0.2.7`; `qs` se actualizó a `6.15.2`.
- El primer contenedor de golden tests persistía cuatro JWT sintéticos bajo `artifacts/auth-linux`: Gitleaks los detectó, los archivos se eliminaron y el estado ahora vive sólo dentro del contenedor efímero.
- Los baselines sólo existían para Darwin: se añadieron siete estados determinísticos por plataforma y una imagen Linux Playwright fijada por digest.
- Playwright intentaba iniciar un segundo servidor dentro de CI aunque `qa:start` ya lo había levantado: `PLAYWRIGHT_EXTERNAL_SERVER=true` hace explícito el contrato.
- Hurl y otros contenedores no alcanzaban los servicios del host en Ubuntu: los scripts usan red del host en Linux y `host.docker.internal` en macOS.
- Los goldens se compararon una vez con el Chromium del runner y produjeron diferencias falsas: todos los gates visuales Linux usan ahora la misma imagen Playwright fijada que generó los baselines.
- Schemathesis funcionaba localmente mediante `uvx`, pero `main` no instalaba `uv`: se añadió la acción oficial fijada por SHA en `main` y nightly.
- La generación aleatoria de Schemathesis podía agotar ejemplos válidos aunque todos los casos ejecutados pasaran: el seed `20260721` elimina esa flakiness y queda impreso en el reporte.
- El reporte HTML contenía la evidencia de fallos visuales, pero el artifact no incluía los archivos crudos de `test-results-linux/`: PR, main y ejecución manual conservan ahora ambas representaciones.
- El comentario automático recibió inicialmente un 403: el job publicador tiene `pull-requests: write`, mientras los jobs que ejecutan código del PR siguen con permisos de lectura.

## No ejecutado

- ZAP active scan no forma parte del cierre frecuente; está configurado exclusivamente para el laboratorio local con `ZAP_ACTIVE=true pnpm test:dast` y corre en nightly. No debe apuntarse a terceros.
- VoiceOver, NVDA, zoom 200%, reflow y contraste perceptual requieren revisión humana; el checklist está en `ACCESSIBILITY.md`.
- Playwright/Chrome DevTools/Storybook MCP están configurados pero no son gates. Los agentes se demostraron mediante Claude Code/Playwright y revisión humana.

Los detalles de cada prueba intencional están en [DEMONSTRATIONS.md](DEMONSTRATIONS.md) y los riesgos/mejoras en [BACKLOG.md](BACKLOG.md).
