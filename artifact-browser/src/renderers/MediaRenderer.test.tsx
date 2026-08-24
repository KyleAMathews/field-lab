import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { FileContent } from "../collections/content";
import type { FileRecord } from "../protocol/types";
import { MediaRenderer } from "./MediaRenderer";

const file: FileRecord = {
	id: "frames/example.html",
	path: "frames/example.html",
	parentPath: "frames",
	name: "example.html",
	kind: "file",
	extension: "html",
	mimeType: "text/html",
	size: 100,
	modifiedAt: 1,
	revision: "1",
	rendererId: "html",
	readable: true,
};

function content(text: string | null = null): FileContent {
	return {
		id: "frames/example.html@1",
		path: file.path,
		revision: "1",
		mimeType: "text/html",
		size: text?.length ?? 0,
		etag: "1",
		text,
		url: "",
		tooLarge: false,
	};
}

describe("MediaRenderer HTML preview", () => {
	it("runs self-contained HTML in an opaque frame without exposing the capability URL", () => {
		const { container } = render(
			<MediaRenderer
				file={file}
				content={content(
					"<!doctype html><html><head><title>Frame</title></head><body><script>document.body.dataset.ready = 'yes'</script></body></html>",
				)}
				view="rendered"
				capability="secret-capability"
			/>,
		);

		const frame = container.querySelector("iframe");
		if (!frame) throw new Error("expected an HTML preview iframe");
		expect(frame).toHaveAttribute("sandbox", "allow-scripts");
		expect(frame).not.toHaveAttribute("src");
		expect(frame.getAttribute("srcdoc")).toContain("Content-Security-Policy");
		expect(frame.getAttribute("srcdoc")).toContain("connect-src 'none'");
		expect(frame.getAttribute("srcdoc")).toContain("<script>");
		expect(frame.getAttribute("srcdoc")).not.toContain("secret-capability");
	});

	it("keeps the remote fallback script-free when source text is unavailable", () => {
		const { container } = render(
			<MediaRenderer
				file={file}
				content={content()}
				view="rendered"
				capability="secret-capability"
			/>,
		);

		const frame = container.querySelector("iframe");
		if (!frame) throw new Error("expected an HTML preview iframe");
		expect(frame).toHaveAttribute("sandbox", "");
		expect(frame).toHaveAttribute(
			"src",
			"/api/content?cap=secret-capability&path=frames%2Fexample.html",
		);
		expect(frame).not.toHaveAttribute("srcdoc");
	});
});
