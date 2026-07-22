#!/usr/bin/env bash
set -euo pipefail
mkdir -p reports/generated/schemathesis
# Hypothesis auto-loads a conflicting profile when it sees these CI markers.
# Schemathesis already receives an explicit seed and health-check policy below,
# so keep this child process independent from the runner's implicit profile.
env -u CI -u GITHUB_ACTIONS uvx --from schemathesis==4.24.1 schemathesis run \
  "http://127.0.0.1:${API_PORT:-3001}/openapi.json" \
  --checks not_a_server_error \
  --max-examples 20 \
  --seed "${SCHEMATHESIS_SEED:-20260721}" \
  --suppress-health-check=filter_too_much \
  --report junit \
  --report-dir reports/generated/schemathesis
