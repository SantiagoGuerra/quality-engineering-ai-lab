#!/usr/bin/env bash
set -euo pipefail
mkdir -p reports/generated/schemathesis
uvx --from schemathesis==4.24.1 schemathesis run \
  "http://127.0.0.1:${API_PORT:-3001}/openapi.json" \
  --checks not_a_server_error \
  --max-examples 20 \
  --seed "${SCHEMATHESIS_SEED:-20260721}" \
  --suppress-health-check=filter_too_much \
  --report junit \
  --report-dir reports/generated/schemathesis
