// Structure rules for apps/web.
//
//   app -> features
//
// Imports point inward only. Features never import each other.

/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
	forbidden: [
		{
			name: "no-circular",
			comment: "No circular dependencies.",
			severity: "error",
			from: {},
			to: { circular: true },
		},

		{
			// Compose features in app/. A feature that needs another one is a
			// sign that shared code belongs in a workspace package.
			name: "features-are-independent",
			comment: "A feature must not import another feature.",
			severity: "error",
			from: { path: "^src/features/([^/]+)/" },
			to: {
				path: "^src/features/([^/]+)/",
				pathNot: "^src/features/$1/",
			},
		},

		{
			name: "features-do-not-import-app",
			comment: "Features must not import from app/.",
			severity: "error",
			from: { path: "^src/features/" },
			to: { path: "^src/app/" },
		},
	],

	options: {
		doNotFollow: { path: "node_modules" },
		tsConfig: { fileName: "tsconfig.json" },
		tsPreCompilationDeps: true,
		enhancedResolveOptions: { extensions: [".ts", ".tsx", ".d.ts"] },
	},
};
