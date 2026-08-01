import Papa from "papaparse";
import { contentUrl } from "../collections/content";
import type { RendererProps } from "./registry";

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
