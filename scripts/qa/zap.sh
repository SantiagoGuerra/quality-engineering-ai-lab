#!/usr/bin/env bash
set -euo pipefail
report_dir="$PWD/reports/generated/zap"
mkdir -p "$report_dir"
# The official image runs as its non-root `zap` user. The runner owns this
# bind-mounted evidence directory, so grant the container write access only
# to this generated-report location.
chmod 0777 "$report_dir"
docker_host="host.docker.internal"
docker_network=(--add-host host.docker.internal:host-gateway)
if [[ "$(uname -s)" == "Linux" ]]; then
  docker_host="127.0.0.1"
  docker_network=(--network host)
fi

if [[ "${ZAP_ACTIVE:-false}" == "true" ]]; then
  expected_reports=(active.json active.html)
  docker run --rm "${docker_network[@]}" \
    --volume "$report_dir:/zap/wrk:rw" \
    ghcr.io/zaproxy/zaproxy:2.17.0 zap-full-scan.py \
    -t "http://${docker_host}:${WEB_PORT:-4173}" -J active.json -r active.html -I
else
  expected_reports=(baseline.json baseline.html baseline.md)
  docker run --rm "${docker_network[@]}" \
    --volume "$report_dir:/zap/wrk:rw" \
    ghcr.io/zaproxy/zaproxy:2.17.0 zap-baseline.py \
    -t "http://${docker_host}:${WEB_PORT:-4173}" -J baseline.json -r baseline.html -w baseline.md -I
fi

for report in "${expected_reports[@]}"; do
  if [[ ! -s "$report_dir/$report" ]]; then
    echo "ZAP did not generate the required evidence file: $report" >&2
    exit 1
  fi
done
