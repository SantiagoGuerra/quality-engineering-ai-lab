# Accesibilidad WCAG 2.2 AA

Meta del producto: WCAG 2.2 nivel AA. axe, JSX a11y, Storybook, Playwright, Pa11y y Lighthouse detectan regresiones; ninguna herramienta sustituye pruebas humanas.

```bash
pnpm test:components  # jest-axe y teclado en componentes
pnpm test:a11y        # axe sobre producto + fixture rota aislada
pnpm test:pa11y
pnpm test:lighthouse
```

## Checklist manual QA

- Completar cada flujo sólo con teclado; comprobar skip link, orden lógico, foco visible, modal con foco inicial/trap/retorno y ausencia de trampas.
- VoiceOver + Safari y NVDA + Firefox/Chrome: nombres, roles, estados, headings, landmarks, alerts/live regions, tablas y errores asociados al campo.
- Zoom 200% y ancho 320 CSS px: reflow sin pérdida ni scroll bidimensional salvo tablas justificadas.
- Revisar contraste de texto, componentes, foco y estados; no depender sólo del color.
- Probar cambios dinámicos, tiempos/sesión expirada y mensajes de error. Drag-and-drop debe tener alternativa de teclado (no existe DnD en este demo).

La ruta `/fixtures/a11y-broken` es una fixture deliberada, no enlazada. Su reporte se guarda en `reports/generated/axe/intentional-fixture.json`. Un cambio sólo se declara corregido cuando pasa automático y la verificación manual relevante. Consulta la evidencia en `docs/VALIDATION.md`.
