#!/usr/bin/env bash
set -euo pipefail
mkdir -p reports/generated/hurl

if docker image inspect ghcr.io/orange-opensource/hurl:8.0.1 >/dev/null 2>&1 || docker pull ghcr.io/orange-opensource/hurl:8.0.1; then
  docker run --rm \
    --add-host host.docker.internal:host-gateway \
    --volume "$PWD/tests/api/hurl:/tests:ro" \
    --volume "$PWD/reports/generated/hurl:/reports" \
    ghcr.io/orange-opensource/hurl:8.0.1 \
    --test --report-html /reports \
    --variable host=host.docker.internal \
    --variable api_port="${API_PORT:-3001}" \
    /tests/smoke.hurl
  exit 0
fi

platform="$(uname -s)-$(uname -m)"
case "$platform" in
  Darwin-arm64) archive="hurl-8.0.1-aarch64-apple-darwin" ;;
  Darwin-x86_64) archive="hurl-8.0.1-x86_64-apple-darwin" ;;
  Linux-x86_64) archive="hurl-8.0.1-x86_64-unknown-linux-gnu" ;;
  Linux-aarch64) archive="hurl-8.0.1-aarch64-unknown-linux-gnu" ;;
  *) echo "No Hurl fallback binary is defined for $platform" >&2; exit 2 ;;
esac
tool_dir="$PWD/.cache/tools/$archive"
if [[ ! -x "$tool_dir/bin/hurl" ]]; then
  mkdir -p "$PWD/.cache/tools"
  curl --fail --location --retry 3 \
    "https://github.com/Orange-OpenSource/hurl/releases/download/8.0.1/$archive.tar.gz" \
    --output "$PWD/.cache/tools/$archive.tar.gz"
  tar -xzf "$PWD/.cache/tools/$archive.tar.gz" -C "$PWD/.cache/tools"
fi
"$tool_dir/bin/hurl" --test --report-html reports/generated/hurl \
  --variable host=127.0.0.1 \
  --variable api_port="${API_PORT:-3001}" \
  tests/api/hurl/smoke.hurl
