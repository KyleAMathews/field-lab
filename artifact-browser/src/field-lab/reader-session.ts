import { execFile as execFileCallback } from "node:child_process";
import { basename, relative, resolve } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import open from "open";

interface CommandResult {
	stdout: string;
	stderr: string;
}

function execFile(file: string, args: string[]): Promise<CommandResult> {
	return new Promise((resolvePromise, reject) => {
		execFileCallback(
			file,
			args,
			{ encoding: "utf8" },
			(error, stdout, stderr) => {
				if (error) reject(error);
				else resolvePromise({ stdout, stderr });
			},
		);
	});
}

function sessionName(tripDirectory: string): string {
	const slug = basename(tripDirectory).replace(/[^a-zA-Z0-9_-]+/g, "-");
	return `artifact-browser-${slug}`;
}

function browserScript(): string {
	return resolve(
		fileURLToPath(new URL("../../dist/cli/index.js", import.meta.url)),
	);
}

function findUrl(output: string): string | null {
	return output.match(/http:\/\/127\.0\.0\.1:\d+\/\?[^\s]+/)?.[0] ?? null;
}

async function captureUrl(session: string): Promise<string | null> {
	const { stdout } = await execFile("tmux", [
		"capture-pane",
		"-p",
		"-S",
		"-100",
		"-t",
		session,
	]);
	return findUrl(stdout);
}

async function isHealthy(url: string, workspaceName: string): Promise<boolean> {
	try {
		const reader = new URL(url);
		const capability = reader.searchParams.get("cap");
		if (!capability) return false;
		const response = await fetch(
			`${reader.origin}/api/boot?cap=${encodeURIComponent(capability)}`,
			{ signal: AbortSignal.timeout(1_500) },
		);
		if (!response.ok) return false;
		const boot = (await response.json()) as { workspaceName?: string };
		return boot.workspaceName === workspaceName;
	} catch {
		return false;
	}
}

export interface ReaderSessionReceipt {
	session: string;
	url?: string;
	reused: boolean;
	warning?: string;
}

export async function startOrReuseTripReader(options: {
	expeditionDirectory: string;
	tripDirectory: string;
	openBrowser: boolean;
}): Promise<ReaderSessionReceipt> {
	const session = sessionName(options.tripDirectory);
	const workspaceName = basename(options.expeditionDirectory);
	try {
		await execFile("tmux", ["-V"]);
	} catch {
		return {
			session,
			reused: false,
			warning:
				"tmux is unavailable; the logs are valid, but no persistent reader was started.",
		};
	}

	let reused = false;
	const hasSession = await execFile("tmux", ["has-session", "-t", session])
		.then(() => true)
		.catch(() => false);
	if (hasSession) {
		const currentUrl = await captureUrl(session).catch(() => null);
		if (currentUrl && (await isHealthy(currentUrl, workspaceName))) {
			reused = true;
		} else {
			await execFile("tmux", ["kill-session", "-t", session]);
		}
	}

	if (!reused) {
		await execFile("tmux", [
			"new-session",
			"-d",
			"-s",
			session,
			process.execPath,
			browserScript(),
			options.expeditionDirectory,
			"--no-open",
		]);
	}

	let baseUrl: string | null = null;
	for (let attempt = 0; attempt < 50; attempt += 1) {
		baseUrl = await captureUrl(session).catch(() => null);
		if (baseUrl && (await isHealthy(baseUrl, workspaceName))) break;
		await delay(100);
	}
	if (!baseUrl || !(await isHealthy(baseUrl, workspaceName))) {
		return {
			session,
			reused,
			warning: "The reader session started but did not report a live URL.",
		};
	}
	const url = new URL(baseUrl);
	url.searchParams.set(
		"file",
		relative(
			options.expeditionDirectory,
			resolve(options.tripDirectory, "field_log.md"),
		),
	);
	if (options.openBrowser) await open(url.toString());
	return { session, url: url.toString(), reused };
}
