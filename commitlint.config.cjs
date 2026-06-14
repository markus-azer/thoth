module.exports = {
	extends: ["@commitlint/config-conventional"],
	rules: {
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
				"revert",
			],
		],
	},
};
