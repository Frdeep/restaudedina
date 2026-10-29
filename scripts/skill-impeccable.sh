#!/bin/sh
set -eu
project_root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
export IMPECCABLE_HOME="$project_root/.cache/skills/impeccable"
cd "$project_root"
exec sh "$project_root/.agents/skills/impeccable/scripts/impeccable" "$@"
