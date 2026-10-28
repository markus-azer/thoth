---
title: Redux Toolkit for web client state
status: accepted
date: 2026-10-28
related: []
---

# Redux Toolkit for web client state

Web client state, starting with chat, used Redux Toolkit. A second feature, or streaming and retries, was expected to need shared state.

The store was built per request and held by a client provider in the layout, so visitors never shared one on the server. Saving to the browser was a store subscription.

The Redux folder held no chat knowledge. A new feature needed a slice file and one line in the root reducer.

Ids were generated in action `prepare` callbacks, so reducers stayed pure.

Rejected:

- `useReducer` in a hook. State stayed local to one component.
- Hooks only. The rules for each change spread across hooks and were harder to test.
- `redux-persist`. It added a dependency for one `localStorage` key.
- `createAsyncThunk`. The slice already had `asked`, `answered` and `failed`.

Why: extendability was valued over the smaller diff.
