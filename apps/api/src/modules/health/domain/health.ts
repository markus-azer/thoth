export type LiveStatus = { status: "ok" };

export type Status = "ok" | "degraded";
export type ReadyStatus = {
	status: Status;
	checks: { db: Status };
};
