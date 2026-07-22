#!/usr/bin/env bash
set -euo pipefail

output_dir="$PWD/reports/generated/sitespeed"
mkdir -p "$output_dir"

# Diagnostic signal only: three local iterations keep the nightly cost bounded
# while reducing single-run noise. Teams should replace these budgets with SLOs.
docker run --rm \
  --shm-size=1g \
  --add-host host.docker.internal:host-gateway \
  --volume "$output_dir:/sitespeed.io" \
  sitespeedio/sitespeed.io:42.2.0 \
  "http://host.docker.internal:${WEB_PORT:-4173}" \
  --browser chrome \
  --video true \
  --visualMetrics true \
  --outputFolder /sitespeed.io/run
