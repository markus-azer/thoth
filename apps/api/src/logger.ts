import { createLogger } from "@thoth/utils/logger";
import { env } from "~/env";

export const { log, pinoInstance } = createLogger({
	level: env.LOG_LEVEL,
	prettyPrint: env.isDev,
});
