import { describe, expect, it } from "vitest";
import { createReaderPreferencesCollection } from "./preferences";

describe("reader preferences", () => {
	it("persist through localStorage", async () => {
		localStorage.clear();
		const first = createReaderPreferencesCollection(localStorage);
		await first.preload();
		first.insert({
			id: "reader",
			fontTheme: "newsreader",
			appearance: "light",
			readerWidth: "standard",
		});
		await expect.poll(() => localStorage.length).toBe(1);

		const second = createReaderPreferencesCollection(localStorage);
		await second.preload();
		expect(second.get("reader")?.fontTheme).toBe("newsreader");
	});
});
