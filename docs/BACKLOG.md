# Backlog de mejoras

No hay fallas deliberadas activas. Este backlog registra mejoras, no excepciones silenciosas a gates.

| Prioridad | Mejora / criterio de salida | Owner | Riesgo actual |
|---|---|---|---|
| P1 | Ampliar la UI de entrevistas/evaluaciones/resultados; hoy el flujo secundario es completo por API/OpenAPI. Añadir listados y E2E visual antes de declararlo flujo UI primario | Frontend + QA | cobertura UX menor que cobertura API |
| P1 | Revisar los Medium transitivos de `uuid` en herramientas dev; actualizar Lighthouse/Testcontainers o adoptar override sólo tras compatibilidad verificada | Security + DevEx | DoS sólo en tooling, no bundle/runtime del producto |
| P1 | Ejecutar checklist manual WCAG con VoiceOver y NVDA en un release candidate y conservar acta humana | Accessibility | automatización no cubre experiencia AT |
| P1 | Añadir autenticación/contexto a ZAP para rutas protegidas y mantener active scan únicamente en ambiente local efímero | Security + QA | baseline actual observa principalmente superficie pública |
| P1 | Ejecutar los cuatro workflows en un repositorio GitHub real y proteger ramas con los checks requeridos | DevSecOps | configuración validada localmente, no observada en runner remoto |
| P2 | Completar schemas OpenAPI de respuesta y stateful links para aumentar alcance de Schemathesis | Backend | warnings de auth/test data reducen exploración |
| P2 | Separar dependencias de runtime/dev en la imagen API y mejorar capas Docker copiando manifests antes del código | DevEx | imagen y rebuild mayores de lo necesario |
| P2 | Definir SLOs reales con producto/operaciones y sustituir budgets de laboratorio para k6/Lighthouse/sitespeed | Performance | thresholds actuales sólo prueban el arnés |
| P2 | Publicar historial de Lighthouse/sitespeed y comparar tendencia, no una única corrida | Performance | variabilidad local no muestra regresiones longitudinales |
| P2 | Integrar Storybook interaction tests por historia a medida que crezca el design system | UI | el build y los component tests cubren el baseline actual |
| P3 | Adoptar Pact sólo si web/API obtienen releases u owners independientes | Architecture | hoy duplicaría contratos compartidos |
| P3 | Evaluar Allure/ReportPortal sólo cuando el índice estático deje de escalar | QA Platform | operación/lock-in no justificados ahora |
| P3 | Evaluar OpenReplay self-hosted únicamente con DPIA, consentimiento, retención y redacción aprobados | Privacy | rrweb permanece opt-in, en memoria y enmascarado |

Cada item que cambie un gate debe actualizar `docs/DECISIONS.md`, la matriz de herramientas y el workflow correspondiente.
