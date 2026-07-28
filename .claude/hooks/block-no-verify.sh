#!/usr/bin/env bash
# Block git commit/push that skips hooks (--no-verify or its -n short form).

if grep -qE 'git (commit|push).* (--no-verify|-n)'; then
  echo 'Blocked: skipping git hooks is not allowed. Fix the check instead.' >&2
  exit 2
fi
