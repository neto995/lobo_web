#!/bin/sh
set -eu
ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/../.." && pwd)
NODE=$(command -v node)
# Remove inherited tokens, proxies, NODE_OPTIONS and all Next.js environment.
exec /usr/bin/env -i PATH=/usr/bin:/bin LC_ALL=C "$NODE" "$ROOT/scripts/mp-sandbox/cli.mjs" "$@"
