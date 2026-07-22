# Developer workflow

Refina criterios/riesgo con QA. Implementa el cambio, tests unit/component/integration/API, story y observabilidad adecuada. Ejecuta `pnpm qa:check`; si cambia journey: `pnpm qa:start && pnpm qa:smoke`. Revisa migraciones, a11y, permisos, errores y datos extremos. Adjunta evidencia, no resultados seleccionados. Corrige gates antes de pedir revisión.
