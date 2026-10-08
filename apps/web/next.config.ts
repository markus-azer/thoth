import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

// dist/ is already ignored by biome, git, and docker, and cached by turbo.
const config: NextConfig = {
	output: "standalone",
	distDir: "dist",
	// The repo root, so the standalone build includes the workspace packages.
	outputFileTracingRoot: fileURLToPath(new URL("../..", import.meta.url)),
	transpilePackages: ["@thoth/ui", "@thoth/utils"],
};

export default config;
