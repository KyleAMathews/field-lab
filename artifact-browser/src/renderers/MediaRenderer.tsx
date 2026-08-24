import Papa from "papaparse";
import { contentUrl } from "../collections/content";
import type { RendererProps } from "./registry";

const HTML_PREVIEW_CSP = [
	"default-src 'none'",
	"img-src data:",
	"style-src 'unsafe-inline'",
	"script-src 'unsafe-inline'",
	"font-src data:",
	"connect-src 'none'",
	"media-src data:",
	"frame-src 'none'",
	"base-uri 'none'",
	"form-action 'none'",
].join("; ");

function sandboxHtml(source: string) {
	const policy = `<meta http-equiv="Content-Security-Policy" content="${HTML_PREVIEW_CSP}">`;
	const head = /<head(?:\s[^>]*)?>/i;
	if (head.test(source)) {
		return source.replace(head, (match) => `${match}\n${policy}`);
	}
	return `${policy}\n${source}`;
}

export function MediaRenderer({
	file,
	content,
	capability,
	staticContents,
}: RendererProps) {
	const url = staticContents?.[file.path] ?? contentUrl(file.path, capability);
	if (file.rendererId === "image")
		return <img className="media-image" src={url} alt={file.name} />;
	// biome-ignore lint/a11y/useMediaCaption: arbitrary workspace audio has no known caption asset.
	if (file.rendererId === "audio") return <audio controls src={url} />;
	if (file.rendererId === "video") {
		// biome-ignore lint/a11y/useMediaCaption: arbitrary workspace video has no known caption asset.
		return <video className="media-video" controls src={url} />;
	}
	if (file.rendererId === "pdf")
		return <iframe className="media-frame" src={url} title={file.name} />;
	if (file.rendererId === "html") {
		if (content.text !== null) {
			return (
				<iframe
					className="media-frame"
					sandbox="allow-scripts"
					srcDoc={sandboxHtml(content.text)}
					title={file.name}
				/>
			);
		}
		return (
			<iframe className="media-frame" sandbox="" src={url} title={file.name} />
		);
	}
	if (file.rendererId === "table" && content.text) {
		const rows = Papa.parse<string[]>(content.text, {
			delimiter: file.extension === "tsv" ? "\t" : ",",
			skipEmptyLines: true,
		}).data.slice(0, 500);
		return (
			<div className="table-scroll">
				<table>
					<tbody>
						{rows.map((row) => (
							<tr key={row.join("\0")}>
								{row.map((cell) => (
									<td key={`${row.join("\0")}:${cell}`}>{cell}</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		);
	}
	return (
		<div className="unknown-file">
			<p>No preview is available for this file.</p>
			<a
				href={
					staticContents?.[file.path] ?? contentUrl(file.path, capability, true)
				}
			>
				Download {file.name}
			</a>
		</div>
	);
}
