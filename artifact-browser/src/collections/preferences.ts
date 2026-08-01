import { createCollection, localStorageCollectionOptions } from "@tanstack/db";
import { z } from "zod";

export const fontThemeIds = [
	"newsreader",
	"source",
	"instrument",
	"inter",
	"alegreya",
	"playfair",
	"fraunces",
] as const;

export type FontThemeId = (typeof fontThemeIds)[number];

export interface FontTheme {
	id: FontThemeId;
	name: string;
	headingFont: string;
	bodyFont: string;
	description: string;
}

export const FONT_THEMES: FontTheme[] = [
	{
		id: "newsreader",
		name: "Newsreader + Figtree",
		headingFont: "Newsreader, serif",
		bodyFont: "Figtree, sans-serif",
		description: "Bookish and clear",
	},
	{
		id: "source",
		name: "Source Serif",
		headingFont: '"Source Serif 4", serif',
		bodyFont: '"Source Sans 3", sans-serif',
		description: "Quiet editorial",
	},
	{
		id: "instrument",
		name: "Instrument",
		headingFont: '"Instrument Serif", serif',
		bodyFont: '"Instrument Sans", sans-serif',
		description: "Expressive and spare",
	},
	{
		id: "inter",
		name: "Inter",
		headingFont: "Inter, sans-serif",
		bodyFont: "Inter, sans-serif",
		description: "Clean and neutral",
	},
	{
		id: "alegreya",
		name: "Alegreya",
		headingFont: "Alegreya, serif",
		bodyFont: '"Alegreya Sans", sans-serif',
		description: "Literary and warm",
	},
	{
		id: "playfair",
		name: "Playfair + Lato",
		headingFont: '"Playfair Display", serif',
		bodyFont: "Lato, sans-serif",
		description: "Classic contrast",
	},
	{
		id: "fraunces",
		name: "Fraunces + Figtree",
		headingFont: "Fraunces, serif",
		bodyFont: "Figtree, sans-serif",
		description: "Soft and characterful",
	},
];

export const readerPreferenceSchema = z.object({
	id: z.literal("reader"),
	fontTheme: z.enum(fontThemeIds),
	appearance: z.enum(["light", "dark", "system"]),
	readerWidth: z.enum(["narrow", "standard", "wide"]),
});

export type ReaderPreferences = z.infer<typeof readerPreferenceSchema>;

export function createReaderPreferencesCollection(storage?: Storage) {
	return createCollection(
		localStorageCollectionOptions({
			id: "artifact-reader-preferences",
			storageKey: "artifact-browser:reader-preferences",
			storage,
			schema: readerPreferenceSchema,
			getKey: (item) => item.id,
		}),
	);
}

export const readerPreferencesCollection = createReaderPreferencesCollection();
export const readerPreferencesReady = readerPreferencesCollection
	.preload()
	.then(() => {
		if (!readerPreferencesCollection.get("reader")) {
			readerPreferencesCollection.insert({
				id: "reader",
				fontTheme: "source",
				appearance: "system",
				readerWidth: "standard",
			});
		}
	});
