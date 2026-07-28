import { describe, expect, it } from "vitest";
import { decodeExpanded, encodeExpanded, parseBrowserSearch } from "./search";

describe("browser search", () => {
	it("drops invalid values", () => {
		expect(
			parseBrowserSearch({
				cap: "secret",
				inspector: "no",
				view: "wrong",
				q: 4,
			}),
		).toEqual({
			cap: "secret",
			file: undefined,
			q: undefined,
			type: undefined,
			inspector: undefined,
			view: undefined,
			expanded: undefined,
			panel: undefined,
		});
	});

	it("round-trips expanded directories", () => {
		const paths = new Set([".", "notes", "notes/archive"]);
		expect(decodeExpanded(encodeExpanded(paths))).toEqual(paths);
	});
});
