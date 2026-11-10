#!/bin/sh
# PostToolUse hook: formats the edited ts/tsx/js/jsx/json/md file with the LOCAL prettier.
# Reads the hook JSON from stdin. Never blocks: always exits 0.
# Prettier only (no eslint --fix): it is fast, deterministic and cannot rewrite imports.

input=$(cat 2>/dev/null) || input=""
[ -n "$input" ] || exit 0

if command -v jq >/dev/null 2>&1; then
  file=$(printf '%s' "$input" | jq -r '.tool_input.file_path // empty' 2>/dev/null) || file=""
else
  file=$(printf '%s' "$input" |
    sed -n 's/.*"file_path"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' |
    head -n 1)
fi
[ -n "$file" ] || exit 0

case "$file" in
  *.ts | *.tsx | *.js | *.jsx | *.json | *.md) ;;
  *) exit 0 ;;
esac

root=${CLAUDE_PROJECT_DIR:-$(pwd)}
root=$(cd "$root" 2>/dev/null && pwd -P) || exit 0

case "$file" in
  /*) ;;
  *) file="$root/$file" ;;
esac

# Only files inside the project; refuse path traversal.
case "$file" in
  *"/../"* | */..) exit 0 ;;
  "$root"/*) ;;
  *) exit 0 ;;
esac

# Skip dependencies, build output, generated and lock files.
case "$file" in
  */node_modules/* | */dist/* | */.expo/* | */coverage/* | */package-lock.json) exit 0 ;;
  "$root"/ios/* | "$root"/android/*) exit 0 ;;
esac

[ -f "$file" ] || exit 0
prettier="$root/node_modules/.bin/prettier"
[ -x "$prettier" ] || exit 0

(cd "$root" && "$prettier" --write --log-level silent "$file" >/dev/null 2>&1) || true
exit 0
