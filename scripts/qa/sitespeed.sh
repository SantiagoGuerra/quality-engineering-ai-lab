#!/usr/bin/env bash
set -euo pipefail

output_dir="$PWD/reports/generated/sitespeed"
mkdir -p "$output_dir"
docker_host="host.docker.internal"
docker_network=(--add-host host.docker.internal:host-gateway)
if [[ "$(uname -s)" == "Linux" ]]; then
  docker_host="127.0.0.1"
  docker_network=(--network host)
fi

# Diagnostic signal only: three local iterations keep the nightly cost bounded
# while reducing single-run noise. Teams should replace these budgets with SLOs.
docker run --rm \
  --shm-size=1g \
  "${docker_network[@]}" \
  --volume "$output_dir:/sitespeed.io" \
  sitespeedio/sitespeed.io:42.2.0 \
  "http://${docker_host}:${WEB_PORT:-4173}" \
  --browser chrome \
  --video true \
  --visualMetrics true \
  --outputFolder /sitespeed.io/run
