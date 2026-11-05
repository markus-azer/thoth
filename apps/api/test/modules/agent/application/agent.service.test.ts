import "reflect-metadata";
import { AIMessage, type BaseMessage } from "@langchain/core/messages";
import { ErrorCode } from "@thoth/utils/error-codes";
import { describe, expect, it, vi } from "vitest";
import { AgentService } from "~/modules/agent/application/agent.service";
import { INSTRUCTIONS } from "~/modules/agent/application/graph/instructions";
import type { Profile } from "~/modules/agent/application/ports/index";
import { Message } from "~/modules/agent/domain/message";
import { Thread } from "~/modules/agent/domain/thread";

const threadId = "018e5e9a-79c1-7c3e-8b1a-000000000001";

const profile: Profile = {
	id: "018e5e9a-79c1-7c3e-8b1a-0000000000aa",
	handle: "markus-azer",
	name: "Markus Azer",
	headline: "Software Engineer",
	about: "Builds things.",
};

const history = [
	new Message({
		id: "m1",
		threadId,
		role: "user",
		content: "hi",
		createdAt: new Date(2026, 0, 1),
	}),
	new Message({
		id: "m2",
		threadId,
		role: "assistant",
		content: "hello",
		createdAt: new Date(2026, 0, 1),
	}),
];

const setup = () => {
	const answer = vi.fn().mockResolvedValue(new AIMessage("fine"));
	const close = vi.fn().mockResolvedValue(undefined);
	const toolbox = { tools: [], close };
	const open = vi.fn().mockResolvedValue(toolbox);
	const profilesRepo = {
		getByHandle: vi.fn().mockResolvedValue(profile),
		getById: vi.fn().mockResolvedValue(profile),
	};
	const threadsRepo = {
		find: vi.fn().mockResolvedValue(
			new Thread({
				id: threadId,
				bioId: profile.id,
				createdAt: new Date(),
			}),
		),
		add: vi.fn().mockResolvedValue(undefined),
	};
	const messagesRepo = {
		list: vi.fn().mockResolvedValue(history),
		add: vi.fn().mockResolvedValue(undefined),
	};
	const ids = {
		next: vi.fn().mockReturnValueOnce("id-1").mockReturnValueOnce("id-2"),
	};
	const service = new AgentService(
		{ answer },
		{ open },
		profilesRepo,
		threadsRepo,
		messagesRepo,
		ids,
	);
	return {
		service,
		answer,
		open,
		toolbox,
		close,
		profilesRepo,
		threadsRepo,
		messagesRepo,
	};
};

describe("AgentService", () => {
	describe("createThread", () => {
		it("stores a new thread about the bio of the handle", async () => {
			const { service, threadsRepo, profilesRepo } = setup();

			const thread = await service.createThread({ handle: "markus-azer" });

			expect(profilesRepo.getByHandle).toHaveBeenCalledWith("markus-azer");
			expect(thread.id).toBe("id-1");
			expect(thread.bioId).toBe(profile.id);
			expect(threadsRepo.add).toHaveBeenCalledWith(thread);
		});

		it("fails when the handle has no bio, without storing a thread", async () => {
			const { service, threadsRepo, profilesRepo } = setup();
			profilesRepo.getByHandle.mockRejectedValue(new Error("no bio"));

			const result = service.createThread({ handle: "ghost" });

			await expect(result).rejects.toThrow("no bio");
			expect(threadsRepo.add).not.toHaveBeenCalled();
		});
	});

	describe("ask", () => {
		it("returns the model answer", async () => {
			const { service } = setup();

			const reply = await service.ask({ threadId, message: "and now?" });

			expect(reply).toBe("fine");
		});

		it("RULE-AGENT-003: The owner's bio reaches the agent through tools, not the prompt.", async () => {
			const { service, answer } = setup();

			await service.ask({ threadId, message: "and now?" });

			const [input] = answer.mock.calls[0] ?? [];
			expect(input.system).toBe(INSTRUCTIONS);
			expect(input.system).not.toContain(profile.about);
		});

		it("gives the model the toolbox, the thread history and the new question", async () => {
			const { service, answer, toolbox } = setup();

			await service.ask({ threadId, message: "and now?" });

			const [input] = answer.mock.calls[0] ?? [];
			expect(input.tools).toBe(toolbox.tools);
			expect(
				input.messages.map((message: BaseMessage) => [
					message.getType(),
					message.text,
				]),
			).toEqual([
				["human", "hi"],
				["ai", "hello"],
				["human", "and now?"],
			]);
		});

		it("opens the tools for the handle of the thread's bio", async () => {
			const { service, open, profilesRepo } = setup();

			await service.ask({ threadId, message: "and now?" });

			expect(profilesRepo.getById).toHaveBeenCalledWith(profile.id);
			expect(open).toHaveBeenCalledWith("markus-azer");
		});

		it("closes the tools even when the model fails", async () => {
			const { service, answer, close } = setup();
			answer.mockRejectedValue(new Error("model down"));

			await expect(
				service.ask({ threadId, message: "and now?" }),
			).rejects.toThrow("model down");

			expect(close).toHaveBeenCalledOnce();
		});

		it("saves the question, then the reply", async () => {
			const { service, messagesRepo } = setup();

			await service.ask({ threadId, message: "and now?" });

			const [savedQuestion, savedReply] = messagesRepo.add.mock.calls.map(
				([saved]) => saved,
			);
			expect(savedQuestion).toMatchObject({
				id: "id-1",
				threadId,
				role: "user",
				content: "and now?",
			});
			expect(savedReply).toMatchObject({
				id: "id-2",
				threadId,
				role: "assistant",
				content: "fine",
			});
		});

		it("saves only after the model answered", async () => {
			const { service, answer, messagesRepo } = setup();

			await service.ask({ threadId, message: "and now?" });

			const [modelCall] = answer.mock.invocationCallOrder;
			const [firstSave] = messagesRepo.add.mock.invocationCallOrder;
			expect(modelCall).toBeLessThan(firstSave ?? 0);
		});

		it("saves nothing when the model fails, so a retry leaves no duplicate question", async () => {
			const { service, answer, messagesRepo } = setup();
			answer.mockRejectedValue(new Error("model down"));

			const result = service.ask({ threadId, message: "and now?" });

			await expect(result).rejects.toThrow("model down");
			expect(messagesRepo.add).not.toHaveBeenCalled();
		});

		it("rejects an unknown thread without saving", async () => {
			const { service, threadsRepo, messagesRepo } = setup();
			threadsRepo.find.mockResolvedValue(null);

			const result = service.ask({ threadId, message: "and now?" });

			await expect(result).rejects.toMatchObject({
				code: ErrorCode.THREAD_NOT_FOUND,
				status: 404,
			});
			expect(messagesRepo.add).not.toHaveBeenCalled();
		});

		it("fails with a 502 when the model replies with blank text, saving nothing", async () => {
			const { service, answer, messagesRepo } = setup();
			answer.mockResolvedValue(new AIMessage("  "));

			const result = service.ask({ threadId, message: "and now?" });

			await expect(result).rejects.toMatchObject({
				code: ErrorCode.AGENT_EMPTY_REPLY,
				status: 502,
			});
			expect(messagesRepo.add).not.toHaveBeenCalled();
		});
	});
});
