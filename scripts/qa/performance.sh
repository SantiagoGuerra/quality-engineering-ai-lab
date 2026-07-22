#!/usr/bin/env bash
set -euo pipefail
suite="${PERF_SUITE:-smoke}"
case "$suite" in smoke|load|stress|spike) ;; *) echo "PERF_SUITE must be smoke, load, stress or spike" >&2; exit 2 ;; esac
mkdir -p reports/generated/k6
docker_host="host.docker.internal"
docker_network=(--add-host host.docker.internal:host-gateway)
if [[ "$(uname -s)" == "Linux" ]]; then
  docker_host="127.0.0.1"
  docker_network=(--network host)
fi

docker run --rm \
  "${docker_network[@]}" \
  --env API_BASE_URL="http://${docker_host}:${API_PORT:-3001}" \
  --volume "$PWD/tests/performance:/tests:ro" \
  --volume "$PWD/reports/generated/k6:/reports" \
  grafana/k6:2.1.0 run \
  --summary-export "/reports/${suite}-summary.json" \
  "/tests/${suite}.js"
