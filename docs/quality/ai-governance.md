# Gobernanza de IA

IA puede proponer escenarios, generar borradores, explorar, analizar traces, clasificar, resumir, recomendar y abrir cambios revisables. No puede aprobar release, aceptar baselines, debilitar assertions, cerrar bugs, cambiar permisos, atacar producción, publicar sensibles, usar datos reales, hacer merge ni desactivar gates.

Planner→Generator→Runner→Healer es proposal-only. Healer no escribe código, assertion, skip ni baseline; entrega patch/propuesta para revisión. MCP facilita exploración y nunca es gate. Todo cambio queda en Git y pasa lint/typecheck/tests.

Para trabajo material conserva en PR/artifact: prompt/objetivo, proveedor/modelo/versión, archivos modificados, comandos/resultados, limitaciones, decisión/revisor humano. Alto impacto siempre exige revisión humana. `CLAUDE.md`, `.claude/agents` y `.claude/skills` aplican estos guardrails.

Privacidad: sólo datos sintéticos. rrweb local está opt-in, enmascara todo texto/input, no captura consola/red, limita 500 eventos en memoria y no persiste. Video Playwright es render temporal de test; trace contiene DOM/red/acciones para debug; session replay representa interacción real y requiere base legal/consentimiento/retención antes de cualquier uso no demo.
