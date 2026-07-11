import { z } from "@wadjet/utils";

const StatusSchema = z.enum(["ok", "degraded"]);

export const LiveStatusSchema = z
	.object({ status: z.literal("ok") })
	.openapi("LiveStatus");

export const ReadyStatusSchema = z
	.object({
		status: StatusSchema,
		checks: z.object({ db: StatusSchema }),
	})
	.openapi("ReadyStatus");
