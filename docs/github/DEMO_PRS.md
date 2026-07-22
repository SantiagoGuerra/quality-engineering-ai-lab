# Pull requests demostrativos

Estos PRs se conservan abiertos para explicar el flujo. Sus títulos dicen explícitamente si el resultado esperado es verde o rojo; nadie debería confundir una regresión intencional con trabajo listo para integrar.

| PR                                                                                                                       | Cambio                                  | Resultado observado             | Qué enseñar                                                |
| ------------------------------------------------------------------------------------------------------------------------ | --------------------------------------- | ------------------------------- | ---------------------------------------------------------- |
| [#9 `[DEMO][GREEN] Accessible candidate status`](https://github.com/SantiagoGuerra/quality-engineering-ai-lab/pull/9)    | Componente pequeño con semántica y test | ✅ Cuatro gates y CodeQL verdes | Un cambio normal y evidencia proporcional                  |
| [#10 `[DEMO][GREEN] Property coverage for scores`](https://github.com/SantiagoGuerra/quality-engineering-ai-lab/pull/10) | Nueva propiedad generativa              | ✅ Cuatro gates y CodeQL verdes | Seed, muchos ejemplos y reproducibilidad                   |
| [#11 `[DEMO][RED] Unit regression`](https://github.com/SantiagoGuerra/quality-engineering-ai-lab/pull/11)                | Expectativa incorrecta aislada          | ❌ Sólo falla `Static quality`  | El resto de jobs continúa y el comentario localiza el gate |
| [#12 `[DEMO][RED] Visual regression`](https://github.com/SantiagoGuerra/quality-engineering-ai-lab/pull/12)              | Desplazamiento controlado del login     | ❌ Sólo falla `Runtime quality` | expected, actual, diff, screenshot, video y trace          |

## Reglas de seguridad de la demo

- Los PRs rojos no se integran.
- Cada PR rojo incluye una nota `demo/EXPECTED_FAILURE.md` con el fallo esperado y cómo revertirlo.
- La protección de `main` exige los cuatro checks determinísticos y una revisión.
- Los branches no contienen secretos ni datos reales.
- Si un PR rojo falla por una razón distinta de la prevista, la demo se considera rota y se corrige.

## Enlaces y resultados observados

Los resultados se observaron en GitHub Actions el 22 de julio de 2026, no se infirieron a partir de una ejecución local:

- [PR #9, ejecución verde](https://github.com/SantiagoGuerra/quality-engineering-ai-lab/actions/runs/29893266387): Static, Runtime, Security, Dependency Review, Quality Summary y CodeQL pasaron.
- [PR #10, ejecución verde](https://github.com/SantiagoGuerra/quality-engineering-ai-lab/actions/runs/29893266167): la nueva propiedad generativa pasó con seed reproducible; todos los gates pasaron.
- [PR #11, ejecución roja unitaria](https://github.com/SantiagoGuerra/quality-engineering-ai-lab/actions/runs/29893266261): `Static quality` reportó exactamente `expected 3 to be 4`; Runtime, Security, Dependency Review, Quality Summary y CodeQL pasaron.
- [PR #12, ejecución roja visual](https://github.com/SantiagoGuerra/quality-engineering-ai-lab/actions/runs/29893266280): Hurl pasó 9/9 y seis estados visuales siguieron verdes; sólo los goldens de login desktop y móvil fallaron por el desplazamiento controlado de 24 px.

El artifact `pr-12-runtime` conserva el reporte HTML y, con la configuración actual, también `test-results-linux/` con los PNG `expected`, `actual` y `diff`, el screenshot de fallo, `video.webm` y `trace.zip`. Playwright repitió ambos fallos una vez y obtuvo la misma diferencia, por lo que la demo no depende de un fallo intermitente.

Cada PR tiene exactamente un comentario de `github-actions[bot]`. El workflow lo actualiza en lugar de crear otro y muestra los cuatro gates, el commit, el seed, el enlace a evidencia y el inventario completo de 34 herramientas e integraciones.
