import "reflect-metadata";
import { ErrorCode } from "@thoth/utils";
import express from "express";
import request from "supertest";
import { describe, expect, it, vi } from "vitest";
import { errorHandler } from "~/infrastructure/http/error-handler";
import { AgentRouter } from "~/infrastructure/http/index";
import { Thread } from "~/modules/agent/domain/thread";
import { AgentController, type AgentService } from "~/modules/agent/index";

const threadId = "018e5e9a-79c1-7c3e-8b1a-000000000001";
const bioId = "018e5e9a-79c1-7c3e-8b1a-0000000000aa";

const setup = () => {
	const service = {
		createThread: vi
			.fn()
			.mockResolvedValue(
				new Thread({ id: threadId, bioId, createdAt: new Date() }),
			),
		ask: vi.fn().mockResolvedValue("fine"),
	};
	const app = express();
	app.use(express.json());
	app.use(
		"/threads",
		new AgentRouter(new AgentController(service as unknown as AgentService))
			.routes,
	);
	app.use(errorHandler);
	return { app, service };
};

describe("AgentRouter", () => {
	it("`POST /threads` with a handle → 201 with `{ id }`", async () => {
		const { app, service } = setup();

		const res = await request(app)
			.post("/threads")
			.send({ handle: "markus-azer" });

		expect(res.status).toBe(201);
		expect(res.body).toEqual({ id: threadId });
		expect(service.createThread).toHaveBeenCalledWith({
			handle: "markus-azer",
		});
	});

	it("`POST /threads` without a handle → 400 with code `INVALID_REQUEST`", async () => {
		const { app, service } = setup();

		const res = await request(app).post("/threads").send({});

		expect(res.status).toBe(400);
		expect(res.body.code).toBe(ErrorCode.INVALID_REQUEST);
		expect(service.createThread).not.toHaveBeenCalled();
	});

	it("`POST /threads/:threadId/messages` → 200 with `{ reply }`", async () => {
		const { app, service } = setup();

		const res = await request(app)
			.post(`/threads/${threadId}/messages`)
			.send({ message: "hi" });

		expect(res.status).toBe(200);
		expect(res.body).toEqual({ reply: "fine" });
		expect(service.ask).toHaveBeenCalledWith({ threadId, message: "hi" });
	});

	it("rejects a blank message with 400 and code `INVALID_REQUEST`", async () => {
		const { app, service } = setup();

		const res = await request(app)
			.post(`/threads/${threadId}/messages`)
			.send({ message: "  " });

		expect(res.status).toBe(400);
		expect(res.body.code).toBe(ErrorCode.INVALID_REQUEST);
		expect(service.ask).not.toHaveBeenCalled();
	});

	it("rejects a thread id that is not a uuid with 400", async () => {
		const { app } = setup();

		const res = await request(app)
			.post("/threads/not-a-uuid/messages")
			.send({ message: "hi" });

		expect(res.status).toBe(400);
	});
});
