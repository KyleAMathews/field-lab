import { useLiveQuery } from "@tanstack/react-db";
import { Check, Palette } from "lucide-react";
import { useEffect } from "react";
import {
	FONT_THEMES,
	readerPreferencesCollection,
	readerPreferencesReady,
} from "../collections/preferences";

export function ThemePicker() {
	const { data: preferences = [] } = useLiveQuery(readerPreferencesCollection);
	const preference = preferences[0];
	const currentTheme =
		FONT_THEMES.find((theme) => theme.id === preference?.fontTheme) ??
		FONT_THEMES[1];

	useEffect(() => {
		if (!currentTheme) return;
		document.documentElement.style.setProperty(
			"--heading-font",
			currentTheme.headingFont,
		);
		document.documentElement.style.setProperty(
			"--body-font",
			currentTheme.bodyFont,
		);
	}, [currentTheme]);

	const setTheme = async (fontTheme: (typeof FONT_THEMES)[number]["id"]) => {
		await readerPreferencesReady;
		if (readerPreferencesCollection.get("reader")) {
			readerPreferencesCollection.update("reader", (draft) => {
				draft.fontTheme = fontTheme;
			});
		}
	};

	return (
		<details className="theme-picker">
			<summary className="icon-button" aria-label="Choose a font pairing">
				<Palette size={16} />
			</summary>
			<div className="theme-menu">
				<span className="eyebrow">Font pairing</span>
				{FONT_THEMES.map((theme) => (
					<button
						key={theme.id}
						type="button"
						onClick={() => setTheme(theme.id)}
					>
						<span>
							<strong>{theme.name}</strong>
							<small>{theme.description}</small>
						</span>
						{currentTheme?.id === theme.id ? <Check size={15} /> : null}
					</button>
				))}
			</div>
		</details>
	);
}
