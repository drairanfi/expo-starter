#!/bin/sh
# Generates .opencode/agents/*.md from .claude/agents/*.md (the source of truth).
#
# Why: Claude Code agents declare `tools: Read, Edit, ...` (comma list) while
# OpenCode expects `tools:` as a map of booleans, so the files cannot be
# symlinked. Only the frontmatter is translated; the prompt body is copied as is.
#
# Usage: sh scripts/sync_opencode_agents.sh   (run after editing .claude/agents)
set -eu

root=$(cd "$(dirname "$0")/.." && pwd)
src="$root/.claude/agents"
dst="$root/.opencode/agents"
mkdir -p "$dst"

for file in "$src"/*.md; do
  name=$(basename "$file")
  awk '
    function has(tool) { return index("," tools ",", "," tool ",") > 0 }
    function deny(tool, key) {
      if (!has(tool)) denied = denied "  " key ": false" ORS
    }
    NR == 1 && $0 == "---" { infm = 1; print; next }
    infm && $0 == "---" {
      print "mode: subagent"
      deny("Write", "write")
      deny("Edit", "edit")
      deny("Edit", "patch")
      deny("Bash", "bash")
      if (denied != "") { print "tools:"; printf "%s", denied }
      print
      print "<!-- Generated from .claude/agents by scripts/sync_opencode_agents.sh. Do not edit. -->"
      infm = 0
      next
    }
    infm && /^name:/ { next }
    infm && /^tools:/ {
      tools = $0
      sub(/^tools:[ \t]*/, "", tools)
      gsub(/[ \t]/, "", tools)
      next
    }
    { print }
  ' "$file" > "$dst/$name"
done
echo "Synced $(ls "$dst" | wc -l | tr -d ' ') agents to .opencode/agents"
