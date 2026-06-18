import { defineConfig } from "vitest/config";

export default defineConfig({
	resolve: { tsconfigPaths: true },
	//TODO: replace with .env test file
	test: { env: { LOG_LEVEL: "silent" } },
});
