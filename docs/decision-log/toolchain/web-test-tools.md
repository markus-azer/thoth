---

title: msw and happy-dom for web tests
status: accepted
date: 2026-10-28
related: [vitest, testing]
---

# msw and happy-dom for web tests

Web tests used msw to fake the network and happy-dom to fake the browser. The code under test stayed unchanged.

Rejected:
- Stubbing `fetch` by hand. Tests then depend on a hidden global.
- Passing `fetch` into the code. It changes real code only to help tests.
- Running a small local server. It needs its own helper.
- Writing a fake storage. Each test file ends up with its own copy.

Why: tests read like the behavior they check.
