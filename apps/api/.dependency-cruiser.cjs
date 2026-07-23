// Clean Architecture rules for apps/api. Every module has four layers:
//
//   domain < application < interface / infrastructure
//
// Imports point inward only. The DI root (src/di) is exempt.
// In the paths below, `[^/]+` matches one module name.

/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
	forbidden: [
		{
			// A imports B while B imports A. Break the loop with a port.
			name: "no-circular",
			comment: "No circular dependencies.",
			severity: "error",
			from: {},
			to: { circular: true },
		},

		{
			// The domain is the center, so it must not reach any outer layer.
			name: "domain-is-pure",
			comment:
				"Domain must not import application, interface, or infrastructure.",
			severity: "error",
			from: { path: "src/modules/[^/]+/domain/" },
			to: {
				path: [
					"src/modules/[^/]+/(application|interface|infrastructure)/",
					"^src/infrastructure/",
					"^src/di/",
				],
			},
		},

		{
			// Use cases may use the domain only. To reach the database or any
			// adapter, depend on a port (an interface), not the concrete layer.
			name: "application-depends-inward",
			comment: "Application must not import interface or infrastructure.",
			severity: "error",
			from: { path: "src/modules/[^/]+/application/" },
			to: {
				path: [
					"src/modules/[^/]+/(interface|infrastructure)/",
					"^src/infrastructure/",
				],
			},
		},

		{
			// One module may enter another only through its front door: index.ts.
			// `$1` is the importing module's name, so its own files are fine,
			// and any module's index.ts is fine. Reaching inner files is not.
			name: "no-cross-module-internals",
			comment:
				"Import other modules through their index.ts, not their internals.",
			severity: "error",
			from: { path: "src/modules/([^/]+)/" },
			to: {
				path: "src/modules/([^/]+)/.+",
				pathNot: [
					"src/modules/$1/", // same module
					"src/modules/[^/]+/index\\.ts$", // any module's barrel
				],
			},
		},
	],

	options: {
		doNotFollow: { path: "node_modules" },
		tsConfig: { fileName: "tsconfig.json" },
		tsPreCompilationDeps: true, // also check type-only imports
		enhancedResolveOptions: { extensions: [".ts", ".d.ts"] },
	},
};
