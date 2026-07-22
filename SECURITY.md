# Seguridad

## Modelo

El laboratorio sigue OWASP ASVS/WSTG/API Security/Top 10 como referencias de riesgo, no como afirmación de certificación. Los controles son defensa en profundidad: validación Zod/Fastify, autorización explícita, JWT local breve, scrypt, queries parametrizadas, errores redactados, SAST, secretos, SBOM/vulnerabilidades, IaC y DAST.

```bash
pnpm test:security   # Semgrep, Gitleaks, Syft, Grype y Checkov
pnpm test:dast       # ZAP Baseline contra localhost
ZAP_ACTIVE=true pnpm test:dast  # sólo entorno local aislado
```

El gate bloquea secretos, SAST y vulnerabilidades críticas del inventario actual. Checkov es señal no bloqueante hasta tener baseline triageado. Una vulnerabilidad nueva debe compararse con el SBOM/report anterior; no se acepta una excepción sin owner, riesgo, issue y vencimiento.

## Reporte privado de vulnerabilidades

No abras un issue público para una vulnerabilidad no corregida. Usa el formulario de
[reporte privado de seguridad](https://github.com/SantiagoGuerra/quality-engineering-ai-lab/security/advisories/new)
para compartir impacto, reproducción mínima y una mitigación sugerida. GitHub mantendrá
la conversación y el borrador del aviso visibles sólo para el reportante y los maintainers.

## Reglas operativas

- Nunca ejecutes ZAP activo, Nuclei ni cargas contra terceros/producción.
- Las fixtures `tests/security/fixtures` contienen patrones falsos e inertes y están excluidas del scan verde; `scripts/qa/security-demo.sh` las escanea intencionalmente.
- No incluyas tokens en reportes/Jira. Rotar inmediatamente cualquier secreto real y purgarlo del historial.
- Reporta en privado al owner de seguridad. Incluye versión, reproducción mínima, impacto y mitigación; no incluyas PII.

Dependencias se fijan y el lockfile es obligatorio. Las acciones CI se fijan por SHA y usan `contents: read`. `pull_request_target` está prohibido por el riesgo de ejecutar código no confiable con secretos.
