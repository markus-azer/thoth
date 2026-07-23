/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
	forbidden: [
		{
			name: "no-circular",
			severity: "error",
			from: {},
			to: { circular: true },
		},

		{
			// core can use things from npm.
			// core can NOT reach into other folders.
			// Checked by import "type", not by name.
			// npm imports look like "uuid" with no folder path,
			// so checking names would let them slip through.
			name: "core-stays-foundational",
			severity: "error",
			from: { path: "^src/" },
			to: { dependencyTypes: ["local"], pathNot: "^src/" },
		},
	],

	options: {
		doNotFollow: { path: "node_modules" },
		tsConfig: { fileName: "tsconfig.json" },
		tsPreCompilationDeps: true,
	},
};
