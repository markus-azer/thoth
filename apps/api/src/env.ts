import { cleanEnv, str } from "envalid";

// All variables are required. If any are missing the process exits at startup.
const _env = cleanEnv(process.env, {
	NODE_ENV: str({ choices: ["development", "production", "test"] }),
	LOG_LEVEL: str({
		choices: ["trace", "debug", "info", "warn", "error", "fatal", "silent"],
	}),
});

// NODE_ENV is validated at startup but intentionally hidden from consumers.
// Use env.isDev, env.isProd, or env.isTest instead.
export const env: Omit<typeof _env, "NODE_ENV"> = _env;
