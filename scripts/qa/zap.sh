#!/usr/bin/env bash
set -euo pipefail
mkdir -p reports/generated/zap
docker_host="host.docker.internal"
docker_network=(--add-host host.docker.internal:host-gateway)
if [[ "$(uname -s)" == "Linux" ]]; then
  docker_host="127.0.0.1"
  docker_network=(--network host)
fi

if [[ "${ZAP_ACTIVE:-false}" == "true" ]]; then
  docker run --rm "${docker_network[@]}" \
    --volume "$PWD/reports/generated/zap:/zap/wrk:rw" \
    ghcr.io/zaproxy/zaproxy:2.17.0 zap-full-scan.py \
    -t "http://${docker_host}:${WEB_PORT:-4173}" -J active.json -r active.html -I
else
  docker run --rm "${docker_network[@]}" \
    --volume "$PWD/reports/generated/zap:/zap/wrk:rw" \
    ghcr.io/zaproxy/zaproxy:2.17.0 zap-baseline.py \
    -t "http://${docker_host}:${WEB_PORT:-4173}" -J baseline.json -r baseline.html -w baseline.md -I
fi
