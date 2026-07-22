#!/usr/bin/env bash
set -euo pipefail

docker run --rm \
  --volume "$PWD:/repo" \
  --workdir /repo \
  docker.io/rhysd/actionlint:1.7.12
