#!/usr/bin/env bash
set -euo pipefail
suite="${PERF_SUITE:-smoke}"
case "$suite" in smoke|load|stress|spike) ;; *) echo "PERF_SUITE must be smoke, load, stress or spike" >&2; exit 2 ;; esac
mkdir -p reports/generated/k6
docker run --rm \
  --add-host host.docker.internal:host-gateway \
  --env API_BASE_URL="http://host.docker.internal:${API_PORT:-3001}" \
  --volume "$PWD/tests/performance:/tests:ro" \
  --volume "$PWD/reports/generated/k6:/reports" \
  grafana/k6:2.1.0 run \
  --summary-export "/reports/${suite}-summary.json" \
  "/tests/${suite}.js"
