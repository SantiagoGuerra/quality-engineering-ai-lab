#!/usr/bin/env bash
set -euo pipefail
mkdir -p reports/generated/security/demos
set +e
docker run --rm --volume "$PWD:/src" --workdir /src semgrep/semgrep:1.170.0 \
  semgrep scan --config .semgrep.yml --error tests/security/fixtures/vulnerable-eval.fixture.ts \
  --json-output reports/generated/security/demos/semgrep-intentional.json
semgrep_status=$?
docker run --rm --volume "$PWD:/repo" zricethezav/gitleaks:v8.30.1 \
  detect --source=/repo/tests/security/fixtures --no-git \
  --report-format=json --report-path=/repo/reports/generated/security/demos/gitleaks-intentional.json --exit-code=7
gitleaks_status=$?
set -e
if [[ "$semgrep_status" -eq 0 || "$gitleaks_status" -ne 7 ]]; then
  echo "Intentional security fixtures were not detected as expected" >&2
  exit 1
fi
echo "Intentional inert SAST and secret fixtures detected; production paths remain excluded and safe."
