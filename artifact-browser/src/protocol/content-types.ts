const SOURCE_CODE_EXTENSIONS = new Set([
	"bash",
	"c",
	"cc",
	"cjs",
	"cpp",
	"cs",
	"cts",
	"css",
	"fish",
	"go",
	"graphql",
	"h",
	"hpp",
	"java",
	"js",
	"jsx",
	"kt",
	"kts",
	"less",
	"mjs",
	"mts",
	"php",
	"py",
	"rb",
	"rs",
	"sass",
	"scss",
	"sh",
	"sql",
	"svelte",
	"swift",
	"toml",
	"ts",
	"tsx",
	"vue",
	"zsh",
]);

function extension(path: string): string {
	const name = path.split(/[\\/]/).at(-1) ?? "";
	const dot = name.lastIndexOf(".");
	return dot > 0 ? name.slice(dot + 1).toLowerCase() : "";
}

export function isSourceCodePath(path: string): boolean {
	const name = (path.split(/[\\/]/).at(-1) ?? "").toLowerCase();
	return (
		SOURCE_CODE_EXTENSIONS.has(extension(path)) ||
		name === "dockerfile" ||
		name === "makefile"
	);
}

export function sourceCodeMimeType(path: string): string | null {
	if (!isSourceCodePath(path)) return null;
	const type = extension(path);
	if (type === "js" || type === "mjs" || type === "cjs")
		return "text/javascript";
	if (type === "jsx") return "text/jsx";
	if (type === "ts" || type === "mts" || type === "cts")
		return "text/typescript";
	if (type === "tsx") return "text/tsx";
	return "text/plain";
}
