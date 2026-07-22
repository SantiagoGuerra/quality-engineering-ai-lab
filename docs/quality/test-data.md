# Datos de prueba

Todos los datos usan dominios `.test`/`.invalid`, nombres sintéticos y contraseña local conocida. Migraciones y ocho seeds versionados viven en `packages/database`. Factories determinísticas viven en `@talent-lab/testing`; cada suite resetea secuencias/estado.

| Seed | Uso |
|---|---|
| default | smoke y exploración general |
| empty-state | estados vacíos |
| candidate-creation | alta/edición/doble submit |
| candidate-duplicate | conflicto por email |
| permission-denied | roles negativos |
| interview-complete | evaluación/resultados |
| performance-data | volumen sintético |
| accessibility-review | recorrido manual AT |

`pnpm qa:reset --seed <name>` aplica limpieza dentro del proyecto Compose actual. No se copian dumps ni PII. IDs dinámicos se obtienen por API/repository, no se fijan en tests. Fechas y locale se controlan donde afectan snapshots.
