module.exports = {
	extends: ["@commitlint/config-conventional"],
	rules: {
		"body-empty": [2, "always"],
		"type-enum": [
			2,
			"always",
			[
				"spec",
				"test",
				"feat",
				"fix",
				"chore",
				"docs",
				"refactor",
				"perf",
				"style",
				"build",
				"ci",
				"infra",
				"revert",
			],
		],
	},
};
