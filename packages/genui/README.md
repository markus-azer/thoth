# @thoth/genui

The UI the agent may use in a chat reply, as an [OpenUI](https://www.openui.com) library.

Components have schemas and no renderers, so the API stays free of React. The web app adds the renderers.

```
root = Stack([next])
next = Suggestions(["What is thoth?", "Who is the owner?"])
```

- `src/components/`: one file per component, with its schema and limits.
- `genuiPrompt`: the system prompt that teaches a model the library.
- `isValidProgram`: checks a program against the library and its limits.
