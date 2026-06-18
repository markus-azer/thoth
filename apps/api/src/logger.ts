import { createLogger } from "@wadjet/utils";

export const { log, pinoInstance } = createLogger({
	// TODO: USE ENV config
	level: process.env["LOG_LEVEL"] ?? "info",
	prettyPrint: process.env["NODE_ENV"] === "development",
});
