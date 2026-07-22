# Registro de decisiones

## React/Vite y Fastify

- Problema: app realista con baja complejidad accidental. Opciones: Next/Nest, React/Vite+Fastify.
- Selección/razón: segunda; build estático, inyección API/OpenAPI y arranque local simples.
- Consecuencia/riesgo: menos convenciones full-stack; rutas secundarias son API-first. Reversión: añadir frontend routes sin cambiar contratos.

## PostgreSQL sin Redis

- Problema: persistencia/resiliencia. Opciones: PG solo, PG+Redis.
- Selección: PG; Redis no aporta caso útil. Consecuencia: menor superficie. Reversión: agregar cuando exista cache/queue real.

## Visual Playwright, Lost Pixel evaluado

- Problema: baseline local gratuito. Opciones: Playwright, Lost Pixel, Loki, Backstop.
- Selección: snapshots Playwright; misma matriz/browser/evidencia. Riesgo: baselines por plataforma. Reversión: adoptar Lost Pixel si crece Storybook/CI visual.

## Pact en hold

- Problema: contratos consumidor/proveedor. Selección: Zod+OpenAPI+Schemathesis; web/API no son equipos independientes. Riesgo: acoplamiento futuro. Reversión: introducir Pact al separar ownership/release.

## Herramientas no Node versionadas

- Problema: reproducibilidad sin contaminar host. Selección: contenedores; Schemathesis vía `uvx` fijado y Hurl con binario oficial fallback. Riesgo: registry/network. Reversión: mirror interno/checksums.

## Agentes y MCP experimentales

- Problema: exploración/generación con IA. Selección: Planner/Generator/Healer y MCP aislados, proposal-only, nunca gate. Riesgo: drift/alucinación. Reversión: borrar `.mcp.json`/agentes sin afectar suites.

## rrweb local opt-in

- Problema: distinguir replay real de video/trace. Selección: buffer local desactivado, texto/inputs enmascarados, sin plugins red/consola. Riesgo: DOM puede cambiar. Reversión: retirar import/dependencia; no hay backend ni datos persistidos.

## Quality gates escalonados

- Problema: señal profunda sin bloquear cada PR. Selección: PR rápido, main ampliado, nightly profundo. Riesgo: defecto sólo nightly. Reversión: promover suite al PR según datos de escapes/duración.
