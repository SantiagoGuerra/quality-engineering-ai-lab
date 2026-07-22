#!/usr/bin/env bash
set -euo pipefail

mode="${1:-test}"
if [[ "$mode" != "test" && "$mode" != "update" ]]; then
  echo "Usage: $0 [test|update]" >&2
  exit 2
fi

image="talent-lab-visual:playwright-1.61.1"
mkdir -p "$PWD/reports/generated/playwright-linux" "$PWD/test-results-linux"

docker build --file Dockerfile.visual --tag "$image" .

args=(
  pnpm exec playwright test
  --grep @visual
  --project=chromium-desktop
)
if [[ "$mode" == "update" ]]; then
  args+=(--update-snapshots)
fi

docker run --rm \
  --shm-size=1g \
  --add-host host.docker.internal:host-gateway \
  --env "PLAYWRIGHT_BASE_URL=http://host.docker.internal:${WEB_PORT:-4173}" \
  --env PLAYWRIGHT_EXTERNAL_SERVER=true \
  --volume "$PWD/tests/e2e:/workspace/tests/e2e" \
  --volume "$PWD/reports/generated/playwright-linux:/workspace/reports/generated/playwright" \
  --volume "$PWD/test-results-linux:/workspace/test-results" \
  "$image" "${args[@]}"
