# Flaky tests

Playwright conserva `retry`, intento, browser, seed y artifacts. `pnpm reports:flaky` procesa JSON y genera `reports/generated/flaky/report.json`; fallo inicial seguido de éxito se marca inestable. Retry máximo: 1 sólo en CI; local: 0.

`tests/flaky/quarantine.json` valida contra su schema y exige `test-id`, `owner`, `reason`, `introduced-at`, `expires-at`, `linked-issue`. El test sigue ejecutándose/reportando; su política puede no bloquear sólo hasta la expiración. Owner revisa cada resultado. Una entrada vencida falla el análisis; no existen cuarentenas permanentes.

Triage: reproducir con mismo commit/seed/browser; distinguir producto, test, infraestructura o dependencia; abrir issue; corregir causa; retirar cuarentena. Nunca aumentar timeouts/retries sin hipótesis y evidencia.
