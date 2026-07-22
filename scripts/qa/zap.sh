#!/usr/bin/env bash
set -euo pipefail
mkdir -p reports/generated/zap
if [[ "${ZAP_ACTIVE:-false}" == "true" ]]; then
  docker run --rm --add-host host.docker.internal:host-gateway \
    --volume "$PWD/reports/generated/zap:/zap/wrk:rw" \
    ghcr.io/zaproxy/zaproxy:2.17.0 zap-full-scan.py \
    -t "http://host.docker.internal:${WEB_PORT:-4173}" -J active.json -r active.html -I
else
  docker run --rm --add-host host.docker.internal:host-gateway \
    --volume "$PWD/reports/generated/zap:/zap/wrk:rw" \
    ghcr.io/zaproxy/zaproxy:2.17.0 zap-baseline.py \
    -t "http://host.docker.internal:${WEB_PORT:-4173}" -J baseline.json -r baseline.html -w baseline.md -I
fi
