import { tokenize } from "@tanstack/highlight";
import { useEffect, useRef } from "react";
import ReactMarkdown, { type UrlTransform } from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { contentUrl } from "../collections/content";
import type { RendererProps } from "./registry";

interface MarkdownTreeNode {
	type: string;
	value?: string;
	tagName?: string;
	properties?: Record<string, unknown>;
	children?: MarkdownTreeNode[];
}

function highlightedText(value: string, query: string): MarkdownTreeNode[] {
	const lowerValue = value.toLocaleLowerCase();
	const lowerQuery = query.toLocaleLowerCase();
	const nodes: MarkdownTreeNode[] = [];
	let offset = 0;
	while (offset < value.length) {
		const match = lowerValue.indexOf(lowerQuery, offset);
		if (match < 0) {
			nodes.push({ type: "text", value: value.slice(offset) });
			break;
		}
		if (match > offset)
			nodes.push({ type: "text", value: value.slice(offset, match) });
		nodes.push({
			type: "element",
			tagName: "mark",
			properties: { className: ["search-match"] },
			children: [
				{ type: "text", value: value.slice(match, match + query.length) },
			],
		});
		offset = match + query.length;
	}
	return nodes;
}

function rehypeHighlight(options: { query?: string } = {}) {
	const query = options.query?.trim();
	return (tree: MarkdownTreeNode) => {
		if (!query) return;
		const visit = (node: MarkdownTreeNode, blocked = false) => {
			const nextBlocked =
				blocked ||
				["code", "pre", "script", "style", "mark"].includes(node.tagName ?? "");
			if (!node.children || nextBlocked) return;
			const children: MarkdownTreeNode[] = [];
			for (const child of node.children) {
				if (
					child.type === "text" &&
					child.value?.toLocaleLowerCase().includes(query.toLocaleLowerCase())
				) {
					children.push(...highlightedText(child.value, query));
				} else {
					visit(child, nextBlocked);
					children.push(child);
				}
			}
			node.children = children;
		};
		visit(tree);
	};
}

function localPath(filePath: string, target: string): string | null {
	if (target.startsWith("/")) return null;
	const parts = [...filePath.split("/").slice(0, -1), ...target.split("/")];
	const resolved: string[] = [];
	for (const part of parts) {
		if (!part || part === ".") continue;
		if (part === "..") {
			if (resolved.length === 0) return null;
			resolved.pop();
		} else {
			resolved.push(part);
		}
	}
	return resolved.join("/");
}

function withoutFrontmatter(source: string): string {
	if (!source.startsWith("---\n") && !source.startsWith("---\r\n"))
		return source;
	const match = /^---\r?\n[\s\S]*?\r?\n---\r?\n/.exec(source);
	return match ? source.slice(match[0].length) : source;
}

function CodeBlock({ language, source }: { language: string; source: string }) {
	const result = tokenize(source, {
		lang: language || "plaintext",
	});
	let offset = 0;
	const tokens = result.tokens.map((token) => {
		const key = `${offset}-${token.className ?? "plain"}`;
		offset += token.value.length;
		return token.className ? (
			<span className={`th-token th-${token.className}`} key={key}>
				{token.value}
			</span>
		) : (
			token.value
		);
	});
	return (
		<div className="code-block">
			<pre
				className={`th-code th-code--${result.lang}`}
				data-language={result.lang}
			>
				<code>{tokens}</code>
			</pre>
		</div>
	);
}

function MermaidBlock({ source }: { source: string }) {
	const ref = useRef<HTMLDivElement>(null);
	useEffect(() => {
		let active = true;
		import("mermaid").then(async ({ default: mermaid }) => {
			mermaid.initialize({
				startOnLoad: false,
				securityLevel: "strict",
				theme: "neutral",
			});
			const id = `mermaid-${crypto.randomUUID()}`;
			const result = await mermaid.render(id, source).catch(() => null);
			if (active && ref.current && result) ref.current.innerHTML = result.svg;
		});
		return () => {
			active = false;
		};
	}, [source]);
	return (
		<div className="mermaid-block" ref={ref}>
			<pre>{source}</pre>
		</div>
	);
}

export function MarkdownRenderer({
	file,
	content,
	view,
	capability,
	staticContents,
	highlight,
}: RendererProps & { highlight?: string }) {
	if (view === "source")
		return <pre className="source-view">{content.text}</pre>;
	const transform: UrlTransform = (url, key) => {
		if (/^(?:https?:|mailto:|data:)/i.test(url)) return url;
		if (url.startsWith("#")) return url;
		const [path, fragment] = url.split("#", 2);
		if (key !== "src" && path?.startsWith("?")) {
			const supplied = new URLSearchParams(path.slice(1));
			const suppliedFile = supplied.get("file");
			if (!suppliedFile) return "";
			const resolvedFile = localPath(file.path, suppliedFile);
			if (!resolvedFile) return "";
			supplied.set("file", resolvedFile);
			if (capability) supplied.set("cap", capability);
			return `?${supplied}${fragment ? `#${fragment}` : ""}`;
		}
		const resolved = localPath(file.path, path ?? "");
		if (!resolved) return "";
		if (key === "src")
			return staticContents?.[resolved] ?? contentUrl(resolved, capability);
		const search = new URLSearchParams({ file: resolved });
		if (capability) search.set("cap", capability);
		return `?${search}${fragment ? `#${fragment}` : ""}`;
	};

	return (
		<article className="markdown">
			<ReactMarkdown
				remarkPlugins={[remarkGfm]}
				rehypePlugins={[
					rehypeRaw,
					rehypeSanitize,
					[rehypeHighlight, { query: highlight }],
				]}
				urlTransform={transform}
				components={{
					code({ className, children }) {
						const language =
							/language-([\w-]+)/.exec(className ?? "")?.[1] ?? "";
						const source = String(children).replace(/\n$/, "");
						if (language === "mermaid") return <MermaidBlock source={source} />;
						if (className)
							return <CodeBlock language={language} source={source} />;
						return <code className={className}>{children}</code>;
					},
				}}
			>
				{withoutFrontmatter(content.text ?? "")}
			</ReactMarkdown>
		</article>
	);
}
