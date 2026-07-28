#!/usr/bin/env bash
# Block git commands that use --no-verify (it bypasses git hooks).

if grep -qE 'git.*--no-verify'; then
  echo 'Blocked: --no-verify bypasses git hooks. Fix the check instead.' >&2
  exit 2
fi
