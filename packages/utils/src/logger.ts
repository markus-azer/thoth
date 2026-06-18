import pino, { type Logger } from "pino";
import pinoPretty from "pino-pretty";

type LogCtx = Record<string, unknown>;
type ErrorCtx = LogCtx & { err?: unknown };

export type Log = {
	debug: (msg: string, ctx?: LogCtx) => void;
	info: (msg: string, ctx?: LogCtx) => void;
	warn: (msg: string, ctx?: LogCtx) => void;
	error: (msg: string, ctx?: ErrorCtx) => void;
	flush: () => Promise<void>;
};

export type CreateLoggerOpts = {
	level: string;
	prettyPrint?: boolean;
};

export const createLogger = (
	opts: CreateLoggerOpts,
): { log: Log; pinoInstance: Logger } => {
	const stream = opts.prettyPrint ? pinoPretty({ colorize: true }) : undefined;
	const pinoInstance = pino(
		{
			level: opts.level,
			timestamp: pino.stdTimeFunctions.isoTime,
		},
		stream,
	);

	const log: Log = {
		debug: (msg, ctx) => pinoInstance.debug(ctx ?? {}, msg),
		info: (msg, ctx) => pinoInstance.info(ctx ?? {}, msg),
		warn: (msg, ctx) => pinoInstance.warn(ctx ?? {}, msg),
		error: (msg, ctx) => pinoInstance.error(ctx ?? {}, msg),
		// pino buffers writes. Await flush before process.exit so the final log line isn't dropped.
		flush: () =>
			new Promise<void>((resolve) => {
				pinoInstance.flush(() => resolve());
			}),
	};

	return { log, pinoInstance };
};
