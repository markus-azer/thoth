import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { Plugin } from "vitest/config";

const dir = dirname(fileURLToPath(import.meta.url));

/** Vite plugin that maps `tsconfig.json` path aliases to `resolve.alias`. */
export function tsconfigAlias(): Plugin {
	type TsConfig = {
		compilerOptions?: { baseUrl?: string; paths?: Record<string, string[]> };
	};
	const { compilerOptions = {} } = JSON.parse(
		readFileSync(resolve(dir, "tsconfig.json"), "utf-8"),
	) as TsConfig;
	const { baseUrl = ".", paths = {} } = compilerOptions;

	const alias = Object.fromEntries(
		Object.entries(paths).map(([pattern, [target = ""]]) => [
			pattern.replace(/\/\*$/, ""),
			resolve(dir, baseUrl, target.replace(/\/\*$/, "")),
		]),
	);

	return {
		name: "tsconfig-alias",
		config: () => ({ resolve: { alias } }),
	};
}
