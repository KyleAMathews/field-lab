import { DurableStream } from "@durable-streams/client";
import { DurableStreamTestServer } from "@durable-streams/server";
import { createStateSchema, createStreamDB } from "@durable-streams/state/db";
import { useLiveQuery } from "@tanstack/react-db";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { z } from "zod";

const smokeSchema = createStateSchema({
	files: {
		schema: z.object({
			id: z.string(),
			name: z.string(),
		}),
		type: "file",
		primaryKey: "id",
	},
});

describe("StreamDB React compatibility", () => {
	it("queries a StreamDB collection with useLiveQuery", async () => {
		const server = new DurableStreamTestServer({
			host: "127.0.0.1",
			port: 0,
		});

		await server.start();

		const streamUrl = `${server.url}/v1/stream/react-smoke`;
		const stream = await DurableStream.create({
			contentType: "application/json",
			url: streamUrl,
		});

		await stream.append(
			JSON.stringify(
				smokeSchema.files.insert({
					value: { id: "README.md", name: "README.md" },
				}),
			),
		);

		const db = createStreamDB({
			state: smokeSchema,
			streamOptions: {
				contentType: "application/json",
				url: streamUrl,
			},
		});

		function Probe() {
			const { data: files = [] } = useLiveQuery(
				(query) => query.from({ file: db.collections.files }),
				[],
			);

			return <output>{files.map((file) => file.name).join(",")}</output>;
		}

		try {
			await db.preload();
			render(<Probe />);
			await waitFor(() => {
				expect(screen.getByText("README.md")).toBeInTheDocument();
			});
		} finally {
			db.close();
			await server.stop();
		}
	});
});
