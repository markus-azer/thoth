import { readFileSync } from "node:fs";
import { parseEnv } from "node:util";
import { defineConfig } from "vitest/config";
import { tsconfigAlias } from "./vitest.alias";

const env = parseEnv(readFileSync(".env.test", "utf-8"));

export default defineConfig({
	plugins: [tsconfigAlias()],
	test: {
		env,
		coverage: {
			provider: "v8",
			reporter: ["text", "html", "lcov"],
			include: ["src/**/*.ts"],
			thresholds: {
				//TODO raise it to 90 when covered
				lines: 60,
				branches: 60,
				functions: 60,
				statements: 60,
			},
		},
		projects: [
			{
				extends: true,
				test: {
					name: "unit",
					include: ["test/**/*.test.ts"],
					exclude: ["test/**/*.integration.test.ts"],
				},
			},
			{
				extends: true,
				test: {
					name: "integration",
					include: ["test/**/*.integration.test.ts"],
				},
			},
		],
	},
});
