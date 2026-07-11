import { createLogger } from "@thoth/utils";
import { env } from "~/env";

export const { log, pinoInstance } = createLogger({
	level: env.LOG_LEVEL,
	prettyPrint: env.isDev,
});
