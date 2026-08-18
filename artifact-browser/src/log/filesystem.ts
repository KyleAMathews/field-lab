import { randomUUID } from "node:crypto";
import { mkdir, open, readFile, rename, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

export async function acquireLogLock(
	path: string,
	label: string,
): Promise<() => Promise<void>> {
	const nonce = randomUUID();
	const ownerPath = resolve(path, "owner.json");
	const owner = JSON.stringify({ pid: process.pid, nonce });
	let staleQuarantine: string | null = null;
	try {
		await mkdir(path);
		await writeFile(ownerPath, owner, { flag: "wx" });
	} catch (error) {
		if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
		const observed = await readFile(ownerPath, "utf8").catch(() => "");
		let observedOwner: { pid?: number; nonce?: string } = {};
		try {
			observedOwner = JSON.parse(observed) as typeof observedOwner;
		} catch {
			throw new Error(`${label} has a legacy or damaged lock at ${path}.`);
		}
		const observedPid = observedOwner.pid;
		let live = false;
		if (Number.isInteger(observedPid) && Number(observedPid) > 0) {
			try {
				process.kill(Number(observedPid), 0);
				live = true;
			} catch (ownerError) {
				live = (ownerError as NodeJS.ErrnoException).code === "EPERM";
			}
		}
		if (live) throw new Error(`${label} is locked by process ${observedPid}.`);
		if (!observedOwner.nonce)
			throw new Error(`${label} has a damaged lock at ${path}.`);
		staleQuarantine = `${path}.stale-${observedOwner.nonce}`;
		await rename(path, staleQuarantine).catch((takeoverError) => {
			throw new Error(`Another writer changed the ${label} lock.`, {
				cause: takeoverError,
			});
		});
		await mkdir(path);
		await writeFile(ownerPath, owner, { flag: "wx" });
	}
	const confirmed = await readFile(ownerPath, "utf8").catch(() => "");
	if (confirmed !== owner)
		throw new Error(`Another writer replaced the ${label} lock.`);
	return async () => {
		const current = await readFile(ownerPath, "utf8").catch(() => "");
		if (current !== owner) return;
		await rm(path, { recursive: true });
		if (staleQuarantine)
			await rm(staleQuarantine, { recursive: true, force: true });
	};
}

export async function appendJsonLines(
	path: string,
	values: unknown[],
): Promise<void> {
	const handle = await open(path, "a");
	try {
		await handle.writeFile(
			`${values.map((value) => JSON.stringify(value)).join("\n")}\n`,
			"utf8",
		);
		await handle.sync();
	} finally {
		await handle.close();
	}
}

export async function stageTextReplacement(
	path: string,
	content: string,
): Promise<() => Promise<void>> {
	const temporary = `${path}.${process.pid}.tmp`;
	await writeFile(temporary, content, "utf8");
	return () => rename(temporary, path);
}
