#!/usr/bin/env bash
set -euo pipefail
mkdir -p reports/generated/security reports/generated/sbom

docker run --rm --volume "$PWD:/src" --workdir /src semgrep/semgrep:1.170.0 \
  semgrep scan --config p/typescript --config .semgrep.yml --error \
  --exclude tests/security/fixtures --exclude node_modules --exclude reports --exclude artifacts \
  --sarif-output reports/generated/security/semgrep.sarif

docker run --rm --volume "$PWD:/repo" zricethezav/gitleaks:v8.30.1 \
  detect --source=/repo --no-git --config=/repo/.gitleaks.toml \
  --redact=100 --report-format=sarif --report-path=/repo/reports/generated/security/gitleaks.sarif --exit-code=1

bash scripts/qa/sbom.sh

docker run --rm --volume "$PWD:/repo" bridgecrew/checkov:3.3.8 \
  --directory /repo --framework dockerfile github_actions \
  --skip-path /repo/node_modules --skip-path /repo/reports \
  --output sarif --output-file-path /repo/reports/generated/security/checkov.sarif \
  --soft-fail
