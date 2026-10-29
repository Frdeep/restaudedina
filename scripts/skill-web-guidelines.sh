#!/bin/sh
set -eu
project_root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
mkdir -p "$project_root/.cache/skills"
target="$project_root/.cache/skills/web-interface-guidelines.md"
staging="$target.tmp.$$"
trap 'rm -f "$staging"' EXIT HUP INT TERM
curl -fLsS --max-time 30 'https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md' -o "$staging"
test -s "$staging"
mv "$staging" "$target"
cat "$target"
