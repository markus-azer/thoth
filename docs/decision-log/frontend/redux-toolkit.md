---
title: Redux Toolkit for web client state
status: accepted
date: 2026-10-28
related: []
---

# Redux Toolkit for web client state

Web client state, starting with chat, used Redux Toolkit. A second feature, or streaming and retries, was expected to need shared state.

The chat slice file owned its state, thunks and saving. The Redux folder held the store and the root reducer, so a new feature added a slice file and one line in the root reducer.

A generic slice helper for request status (idle, loading, succeeded, failed) was kept. The chat slice did not use it. It was kept for features that fetch data and need the same status shape.

Rejected:

- `useReducer` in a hook. State stayed local to one component.
- Hooks only. The rules for each change spread across hooks and were harder to test.
- `redux-persist`. It added a dependency for one `localStorage` key.
- `createAsyncThunk`. The slice already had `asked`, `answered` and `failed`.

Why: extendability was valued over the smaller diff.
