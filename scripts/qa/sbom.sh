#!/usr/bin/env bash
set -euo pipefail
mkdir -p reports/generated/sbom reports/generated/security/grype-db
docker run --rm --volume "$PWD:/repo" anchore/syft:v1.49.0 \
  dir:/repo --exclude './node_modules/**' --exclude './reports/**' --exclude './.stryker-tmp/**' \
  --output cyclonedx-json=/repo/reports/generated/sbom/talent-lab.cdx.json \
  --output spdx-json=/repo/reports/generated/sbom/talent-lab.spdx.json
docker run --rm \
  --volume "$PWD:/repo" \
  --volume "$PWD/reports/generated/security/grype-db:/root/.cache/grype/db" \
  anchore/grype:v0.116.0 \
  sbom:/repo/reports/generated/sbom/talent-lab.cdx.json \
  --fail-on critical --output json --file /repo/reports/generated/security/grype.json
