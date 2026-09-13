#!/usr/bin/env node
// Opt-in live comparison. Writes only disposable fixtures and result files.
// node scripts/benchmark-kit-logging.mjs --live --pairs 3 [--case answer|correction]
// Optional: --baseline-ref <git-ref>, --codex <binary-path>, --variant baseline|candidate.
// --warm also sends a second reply in each trial's own saved CLI conversation.
// --compare-efforts high,low requires --warm and --variant; seed turns use the first effort.
// --model fixes the model for a comparison without changing the user's configuration.
import { spawn, spawnSync } from 'node:child_process';
import { cp, mkdir, mkdtemp, readFile, readdir, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { performance } from 'node:perf_hooks';

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const value = (key) => args[args.indexOf(key) + 1];
if (!args.includes('--live')) throw new Error('Live model runs require --live. Use --pairs 3 for the initial comparison.');
const pairs = args.includes('--pairs') ? Number(value('--pairs')) : 3;
if (!Number.isInteger(pairs) || pairs < 1 || pairs > 10) throw new Error('pairs must be 1–10.');
const selectedCase = args.includes('--case') ? value('--case') : undefined;
const selectedVariant = args.includes('--variant') ? value('--variant') : undefined;
const warm = args.includes('--warm');
const efforts = args.includes('--compare-efforts') ? value('--compare-efforts').split(',') : undefined;
const model = args.includes('--model') ? value('--model') : undefined;
if (efforts && (!warm || !selectedVariant || efforts.length !== 2 || new Set(efforts).size !== 2 || efforts.some(e => !['low', 'medium', 'high', 'xhigh', 'max', 'ultra'].includes(e))))
	throw new Error('compare-efforts requires two distinct supported efforts, --warm, and --variant.');
const warmReply = "A teacher once asked me to explain why I believed something, then gave a counterexample. I had to rethink my reason instead of repeating the answer.";
if (selectedVariant && !['baseline', 'candidate'].includes(selectedVariant)) throw new Error('Unknown variant.');
const codexBinary = args.includes('--codex') ? value('--codex') : process.env.KIT_BENCH_CODEX ?? 'codex';
const baselineRef = args.includes('--baseline-ref') ? value('--baseline-ref') : 'HEAD';
const cases = {
	answer: "There's a lot of repetition without much depth. I don't find my thinking expanded or changed. It may just be a difference in interests.",
	correction: "I'm asking about teaching generally, not trying to optimize my current job. Please keep the question broad.",
};
if (selectedCase && !cases[selectedCase]) throw new Error('Unknown case.');
const root = await mkdtemp(join(tmpdir(), 'kit-logging-ab-'));
console.log(JSON.stringify({ resultsDirectory: root }));

function run(command, argv, options = {}) {
	const result = spawnSync(command, argv, { encoding: 'utf8', ...options });
	if (result.status !== 0) throw new Error(`${command} failed: ${result.stderr}`);
	return result.stdout;
}

const variants = {};
await writeFile(join(root, 'environment.json'), JSON.stringify({
	baselineCommit: run('git', ['rev-parse', baselineRef], { cwd: repo }).trim(),
	codexVersion: run(codexBinary, ['--version']).trim(),
	pairs, selectedCase, selectedVariant, warm, efforts, model, startedAt: new Date().toISOString(),
}, null, 2));
for (const variant of ['baseline', 'candidate']) {
	const skill = join(root, `${variant}-skill`);
	await mkdir(join(skill, 'artifact-browser'), { recursive: true });
	if (variant === 'baseline') {
		const archive = spawnSync('git', ['archive', baselineRef, 'SKILL.md', 'reference', 'artifact-browser/src'], { cwd: repo, maxBuffer: 30_000_000 });
		if (archive.status !== 0) throw new Error(archive.stderr.toString());
		run('tar', ['-x', '-C', skill], { input: archive.stdout });
	} else {
		for (const path of ['SKILL.md', 'reference', 'artifact-browser/src'])
			await cp(join(repo, path), join(skill, path), { recursive: true });
	}
	await symlink(join(repo, 'artifact-browser/node_modules'), join(skill, 'artifact-browser/node_modules'), 'dir');
	const cli = join(skill, 'artifact-browser/dist/field-log-cli/index.js');
	run(join(repo, 'artifact-browser/node_modules/.bin/esbuild'), [join(skill, 'artifact-browser/src/field-log-cli/index.ts'), '--bundle', '--platform=node', '--format=esm', '--packages=external', `--outfile=${cli}`]);
	variants[variant] = { skill, cli };
}

const actor = { kind: 'orchestrator', pointer: 'interview-task' };
const selection = { kind: 'user-selection', pointer: 'user-turn-2', verbatim: 'Yes, start Phase 1.' };
const event = (type, payload, authorization) => ({ type, actor, payload, ...(authorization ? { authorization } : {}) });
async function fixture(variant, name) {
	const directory = join(root, name, 'field-trip-teaching');
	const { cli } = variants[variant];
	const call = (command, input) => JSON.parse(run(process.execPath, [cli, command, directory, '--json', JSON.stringify(input)]));
	call('init', event('trip.created', { title: 'Useful teaching', openingQuestion: 'What makes teaching useful?', scope: 'Understand useful teaching and what I can contribute.' }, { kind: 'artifact-consent', pointer: 'user-turn-1', verbatim: 'Start a Field Log and run a dialectic about useful teaching.' }));
	call('append', [
		event('comment.recorded', { text: 'Start a Field Log and run a dialectic about useful teaching.' }),
		event('workflow.selected', { name: 'dialectic' }, { ...selection, pointer: 'user-turn-1', verbatim: 'Start a Field Log and run a dialectic about useful teaching.' }),
		event('comment.recorded', { text: 'Yes, start Phase 1.', context: 'After the Phase 1 opening card: frame and ground; interview first, return a provisional frame for correction before research.' }),
		event('workflow.started', { workflowId: 1 }),
		event('instrument.run.selected', { instrumentId: 'elenchus' }, selection),
		event('instrument.run.started', { instrumentId: 'elenchus', runId: 1 }),
		event('question.added', { role: 'current', text: 'What is an example of teaching you find unhelpful?' }),
	]);
	const roundContext = 'Round 1, Phase 1 interview. Original question: What makes teaching useful? No confirmed tension or frozen Monk specimen yet. Elenchus run 1 is running. Aim: understand useful teaching and personal contribution. Await a concrete example; no outside research selected. Phase 1 started by user-turn-2: “Yes, start Phase 1.” after assistant-opening-card. Promised return: provisional frame for correction before research.';
	if (variant === 'baseline') {
		await mkdir(join(directory, 'dialectic'), { recursive: true });
		await writeFile(join(directory, 'dialectic/round_1_dialectic_log.md'), `# Round 1\n\n${roundContext}\n`);
	} else {
		call('append', [
			event('workflow.checkpoint.recorded', { workflowId: 1, round: 1, section: 'context', markdown: roundContext }),
			event('workflow.checkpoint.recorded', { workflowId: 1, round: 1, section: 'phase-start', markdown: 'Phase 1: frame and ground. Opening card: assistant-opening-card. Return provisional frame before research.' }, selection),
		]);
	}
	return directory;
}

async function live(variant, caseName, iteration, prior, effort) {
	const name = `${caseName}-${iteration}-${variant}${effort ? `-${effort}` : ''}${prior ? '-warm' : ''}`;
	const directory = prior?.fixtureDirectory ?? await fixture(variant, name);
	if (prior) await mkdir(join(root, name), { recursive: true });
	const reply = prior ? warmReply : cases[caseName];
	const before = (await readFile(join(directory, 'field_log.jsonl'), 'utf8')).trim().split('\n').length;
	const controlPath = join(directory, 'dialectic/round_1_dialectic_log.md');
	const controlBefore = await readFile(controlPath, 'utf8').catch(() => null);
	const prompt = `Use the Field Lab skill at ${variants[variant].skill}/SKILL.md. Continue this existing Field Trip from its saved records at ${directory}. This is a resumed Phase 1 interview; the user has already selected the dialectic and started Phase 1. Elenchus run 1 is running. The prior assistant question was: "What is an example of teaching you find unhelpful?" The reader and gardener are already running; neither needs action or a handoff for this exchange. Use the saved context to continue the conversation with the user's reply below. Do not run outside research or open a browser. Work only in this Field Trip. User reply: ${cases[caseName]}`;
	const start = performance.now();
	const effectiveEffort = prior ? effort : efforts?.[0];
	const overrides = [...(model ? ['--model', model] : []), ...(effectiveEffort ? ['-c', `model_reasoning_effort="${effectiveEffort}"`] : [])];
	const argv = prior
		? ['exec', '--sandbox', 'workspace-write', 'resume', ...overrides, '--json', '--skip-git-repo-check', prior.threadId, reply]
		: ['exec', ...overrides, ...(!warm ? ['--ephemeral'] : []), '--json', '--skip-git-repo-check', '--sandbox', 'workspace-write', '-C', directory, prompt];
	const child = spawn(codexBinary, argv, { cwd: directory, stdio: ['ignore', 'pipe', 'pipe'] });
	let stdout = '', stderr = '';
	child.stdout.on('data', chunk => { stdout += chunk; });
	child.stderr.on('data', chunk => { stderr += chunk; });
	const timer = setTimeout(() => child.kill('SIGTERM'), 300_000);
	const code = await new Promise((resolvePromise, reject) => {
		child.on('error', reject); child.on('close', resolvePromise);
	}).finally(() => clearTimeout(timer));
	const elapsedMs = performance.now() - start;
	await writeFile(join(root, name, 'trace.jsonl'), stdout);
	await writeFile(join(root, name, 'stderr.txt'), stderr);
	const records = stdout.split('\n').filter(Boolean).map(line => { try { return JSON.parse(line); } catch { return {}; } });
	const items = records.filter(record => record.type === 'item.completed').map(record => record.item);
	const commands = items.filter(item => item.type === 'command_execution');
	const loggingCommands = commands.filter(item => /field-log-cli.*\bappend\b/.test(item.command ?? ''));
	const patches = items.filter(item => item.type === 'file_change');
	const events = (await readFile(join(directory, 'field_log.jsonl'), 'utf8')).trim().split('\n').map(line => JSON.parse(line));
	const appended = events.slice(before);
	const comments = appended.filter(event => event.type === 'comment.recorded');
	const exactComment = comments.length === 1 && comments[0].payload.text === reply;
	let valid = false;
	try { valid = JSON.parse(run(process.execPath, [variants[variant].cli, 'validate', directory])).valid === true; } catch {}
	const final = items.filter(item => item.type === 'agent_message').at(-1)?.text;
	const currentQuestion = JSON.parse(run(process.execPath, [variants[variant].cli, 'inspect', directory])).currentQuestion;
	const result = {
		effort: effectiveEffort, comparisonEffort: effort, model,
		phase: prior ? 'warm' : 'cold', fixtureDirectory: directory,
		threadId: records.find(record => record.type === 'thread.started')?.thread_id,
		variant, caseName, iteration, code, elapsedMs: Math.round(elapsedMs), valid, exactComment,
		currentQuestion, questionMatchesFinal: Boolean(currentQuestion && final?.includes(currentQuestion)),
		commands: commands.length, commandBytes: commands.reduce((sum, item) => sum + Buffer.byteLength(item.command ?? ''), 0),
		loggingCommandBytes: loggingCommands.reduce((sum, item) => sum + Buffer.byteLength(item.command ?? ''), 0),
		controlLogChanged: controlBefore !== await readFile(controlPath, 'utf8').catch(() => null),
		toolOutputBytes: commands.reduce((sum, item) => sum + Buffer.byteLength(item.aggregated_output ?? ''), 0),
		fileChangeBytes: patches.reduce((sum, item) => sum + Buffer.byteLength(JSON.stringify(item.changes ?? [])), 0),
		eventsAdded: appended.map(event => event.type), usage: records.findLast(record => record.type === 'turn.completed')?.usage,
		final, files: await readdir(directory, { recursive: true }),
	};
	console.log(JSON.stringify(result));
	return result;
}

const results = [];
for (const caseName of Object.keys(cases).filter(name => !selectedCase || name === selectedCase)) {
	for (let iteration = 1; iteration <= pairs; iteration++) {
		for (const variant of iteration % 2 ? ['baseline', 'candidate'] : ['candidate', 'baseline']) {
			if (selectedVariant && selectedVariant !== variant) continue;
			for (const effort of efforts ? (iteration % 2 ? efforts : [...efforts].reverse()) : [undefined]) {
				results.push(await live(variant, caseName, iteration, undefined, effort));
				await writeFile(join(root, 'results.json'), JSON.stringify(results, null, 2));
				if (results.at(-1).code !== 0) throw new Error(`Live runner failed; see ${root}. No further runs attempted.`);
				if (warm) {
					const prior = results.at(-1);
					if (!prior.threadId) throw new Error('No thread ID returned for warm continuation.');
					results.push(await live(variant, caseName, iteration, prior, effort));
					await writeFile(join(root, 'results.json'), JSON.stringify(results, null, 2));
					if (results.at(-1).code !== 0) throw new Error(`Warm runner failed; see ${root}.`);
				}
			}
		}
	}
}
if (results.some(result => result.code !== 0 || !result.valid || !result.exactComment || !result.questionMatchesFinal || !result.final)) process.exitCode = 1;
