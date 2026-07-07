#!/usr/bin/env bash
# Validate decision-log / spec / skill boundary.
# Runs as a PostToolUse hook on Edit, Write, MultiEdit.
# Violations exit 2 with stderr. Claude treats that as feedback.

set -euo pipefail

# --- Read hook input ---

input=$(cat)
tool=$(jq -r '.tool_name // empty' <<<"$input")
file_path=$(jq -r '.tool_input.file_path // empty' <<<"$input")

# --- Skip if this edit is not in scope ---

case "$tool" in
  Edit|Write|MultiEdit) ;;
  *) exit 0 ;;
esac

if [[ -z "$file_path" || ! -f "$file_path" || "$file_path" != *.md ]]; then
  exit 0
fi

# Skip meta files that describe the folder rather than being an entry.
if [[ "$file_path" == */README.md ]]; then
  exit 0
fi

# --- Classify the file by path ---

case "$file_path" in
  */docs/decision-log/*)                  doc_type="decision-log" ;;
  */apps/*/spec/*|*/packages/*/spec/*)    doc_type="spec" ;;
  */.claude/skills/*)                     doc_type="skill" ;;
  *)                                      exit 0 ;;
esac

# --- Collect violations ---

violations=()
note() { violations+=("$1"); }

content=$(cat "$file_path")

# 1. File location
# Skills must live at .claude/skills/<name>/SKILL.md
if [[ "$doc_type" == "skill" && "$file_path" != */.claude/skills/*/SKILL.md ]]; then
  note "location: skills must live at .claude/skills/<name>/SKILL.md"
fi

# 2. Cross-linking (per feedback_no_doc_cross_linking)
spec_link='\]\([^)]*(apps/[^/]+/spec|packages/[^/]+/spec)/'
log_link='\]\([^)]*docs/decision-log/'

if [[ "$doc_type" == "decision-log" ]] && grep -qE "$spec_link" <<<"$content"; then
  note "cross-link: decision-log entry links to a spec file"
fi

if [[ "$doc_type" == "spec" ]] && grep -qE "$log_link" <<<"$content"; then
  note "cross-link: spec file links to decision-log"
fi

# 3. Content style
rule_id='RULE-[A-Z]+-[0-9]+'
rationale_heading='^(why|tradeoff|alternatives considered):'

if [[ "$doc_type" == "decision-log" ]]; then
  if ! head -n 1 <<<"$content" | grep -q '^---$'; then
    note "style: missing frontmatter (decision-log entries need title/status/date)"
  fi
  if grep -qE "$rule_id" <<<"$content"; then
    note "style: contains RULE-XXX-NNN identifiers (those belong in spec)"
  fi
fi

if [[ "$doc_type" == "spec" ]]; then
  if ! grep -qE "$rule_id" <<<"$content"; then
    note "style: no RULE-XXX-NNN identifiers found"
  fi
  if grep -qiE "$rationale_heading" <<<"$content"; then
    note "style: contains rationale section (Why:/Tradeoff:/Alternatives:); belongs in decision-log"
  fi
fi

# 4. LLM grader (cheap: haiku, first 60 lines, short prompt)
if command -v claude >/dev/null 2>&1; then
  snippet=$(head -n 60 <<<"$content")
  prompt="Reply on one line: 'OK' or 'VIOLATION: <short reason>'.

Doc type '$doc_type' rules:
- decision-log: WHY a choice was made. Tradeoffs. Past tense.
- spec: WHAT the system does. Behavior rules with RULE-XXX-NNN ids. Present tense.
- skill: HOW to do a recurring task. Imperative procedure.

Does the content below match its type?

$snippet"

  verdict=$(echo "$prompt" | timeout 20 claude -p --model claude-haiku-4-5-20251001 2>/dev/null | head -n 1 || true)
  if [[ "$verdict" == VIOLATION:* ]]; then
    note "llm: ${verdict#VIOLATION: }"
  fi
fi

# --- Report ---

if (( ${#violations[@]} > 0 )); then
  {
    echo "doc-boundary: $file_path ($doc_type)"
    for v in "${violations[@]}"; do
      echo "  - $v"
    done
  } >&2
  exit 2
fi
