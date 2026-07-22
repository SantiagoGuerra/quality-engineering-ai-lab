# Pull requests demostrativos

Estos PRs se conservan abiertos para explicar el flujo. Sus títulos dicen explícitamente si el resultado esperado es verde o rojo; nadie debería confundir una regresión intencional con trabajo listo para integrar.

| PR                                           | Cambio                                  | Resultado esperado      | Qué enseñar                                                |
| -------------------------------------------- | --------------------------------------- | ----------------------- | ---------------------------------------------------------- |
| `[DEMO][GREEN] Accessible candidate status`  | Componente pequeño con semántica y test | Todos los gates verdes  | Un cambio normal y evidencia proporcional                  |
| `[DEMO][GREEN] Property coverage for scores` | Nueva propiedad generativa              | Todos los gates verdes  | Seed, muchos ejemplos y reproducibilidad                   |
| `[DEMO][RED] Unit regression`                | Expectativa incorrecta aislada          | Falla `Static quality`  | El resto de jobs continúa y el comentario localiza el gate |
| `[DEMO][RED] Visual regression`              | Desplazamiento controlado del login     | Falla `Runtime quality` | expected, actual, diff, screenshot, video y trace          |

## Reglas de seguridad de la demo

- Los PRs rojos no se integran.
- Cada PR rojo incluye una nota `demo/EXPECTED_FAILURE.md` con el fallo esperado y cómo revertirlo.
- La protección de `main` exige los cuatro checks determinísticos y una revisión.
- Los branches no contienen secretos ni datos reales.
- Si un PR rojo falla por una razón distinta de la prevista, la demo se considera rota y se corrige.

## Enlaces y resultados observados

Esta sección se completa después de publicar el repositorio y observar los checks reales. No se documenta “verde” o “rojo” basándose sólo en una ejecución local.
