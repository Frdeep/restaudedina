#!/bin/sh
set -eu
project_root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
cd "$project_root"
local_cli="$project_root/.cache/skills/design-md/node_modules/@google/design.md/dist/index.js"
if [ -f "$local_cli" ]; then
  exec node "$local_cli" "$@"
fi
exec npm exec --yes --cache "$project_root/.cache/skills/npm" --package=@google/design.md@0.4.0 -- design.md "$@"
