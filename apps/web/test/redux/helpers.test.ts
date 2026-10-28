import { describe, expect, it } from "vitest";
import { createGenericSlice } from "~/redux/helpers";

describe("createGenericSlice", () => {
	it("starts idle, then records loading, success, and failure", () => {
		const slice = createGenericSlice<string[], string, Record<never, never>>({
			name: "demo",
			reducers: {},
		});
		const { started, succeeded, failed } = slice.actions;

		const idle = slice.reducer(undefined, { type: "init" });
		const loading = slice.reducer(idle, started());
		const done = slice.reducer(loading, succeeded(["a"]));
		const broken = slice.reducer(loading, failed("boom"));

		expect(idle).toEqual({ status: "idle", data: null, error: null });
		expect(loading.status).toBe("loading");
		expect(done).toEqual({ status: "succeeded", data: ["a"], error: null });
		expect(broken).toEqual({ status: "failed", data: null, error: "boom" });
	});
});
