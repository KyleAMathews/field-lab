#!/usr/bin/env node
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

const usage = `Usage: scripts/statechart SPEC.tla [--config FILE] [--view FILE] [--out DIR]
Check a frozen TLA+ model and save chart.mmd, report.md and raw TLC output.
Config defaults to SPEC.cfg; output defaults to SPEC-chart and must be new or empty.
Exit: 0 rules hold; 1 a rule breaks; 2 setup/checker error; 130/143 interrupted.`;

let stopped;
let child;
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    stopped ??= signal;
    child?.kill(signal);
  });
}
const run = (args) => new Promise((resolve, reject) => {
  child = spawn("docker", args, { stdio: "inherit" });
  child.once("error", reject);
  child.once("close", (code) => { child = undefined; resolve(code ?? 2); });
});
const interruptionCode = () => stopped === "SIGINT" ? 130 : 143;
const file = (name, label) => {
  if (!fs.statSync(name, { throwIfNoEntry: false })?.isFile())
    throw new Error(`${label} not found: ${name}`);
  return fs.realpathSync(name);
};

let stage;
try {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: { config: { type: "string" }, view: { type: "string" }, out: { type: "string" }, help: { type: "boolean", short: "h" } },
  });
  if (values.help) { console.log(usage); process.exit(0); }
  if (positionals.length !== 1 || !positionals[0].endsWith(".tla"))
    throw new Error(usage);
  const input = positionals[0];
  const spec = file(input, "Model");
  const config = file(values.config ?? input.replace(/\.tla$/, ".cfg"), "Config");
  const view = values.view && file(values.view, "View");
  const out = path.resolve(values.out ?? input.replace(/\.tla$/, "-chart"));
  const existing = fs.lstatSync(out, { throwIfNoEntry: false });
  if (existing && (!existing.isDirectory() || existing.isSymbolicLink() || fs.readdirSync(out).length))
    throw new Error(`Output must be a new or empty directory: ${out}`);
  if (out === path.parse(out).root) throw new Error("Give a named output directory");
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const image = process.env.FIELD_LAB_TLC_IMAGE ?? "field-lab-tlc:local";
  const built = await run(["build", "--tag", image, path.join(root, "tools/tla")]);
  if (stopped) process.exit(interruptionCode());
  if (built !== 0) throw new Error(`TLC image build failed (exit ${built})`);

  fs.mkdirSync(path.dirname(out), { recursive: true });
  // Mount only this new staging folder writable. A model's sibling output
  // directory must not expose the input files through a second writable mount.
  stage = fs.mkdtempSync(path.join(path.dirname(out), ".field-lab-statechart-"));
  const args = ["run", "--rm", "--init", "--network", "none", "--read-only", "--tmpfs", "/tmp:rw,exec,mode=1777",
    "--user", `${process.getuid()}:${process.getgid()}`,
    "--volume", `${path.dirname(spec)}:/model:ro`,
    "--volume", `${path.dirname(config)}:/config:ro`,
    "--volume", `${stage}:/out:rw`, "--entrypoint", "node"];
  if (view) args.push("--volume", `${path.dirname(view)}:/view:ro`);
  args.push(image, "--disable-warning=ExperimentalWarning", "/opt/field-lab/statechart/scripts/statechart.ts",
    `/model/${path.basename(spec)}`, "--config", `/config/${path.basename(config)}`, "--out", "/out/result");
  if (view) args.push("--view", `/view/${path.basename(view)}`);
  const code = await run(args);
  if (stopped) process.exitCode = interruptionCode();
  else if (code === 0 || code === 1) {
    // Rename on the host, on the same filesystem. A concurrently populated
    // destination fails instead of replacing its files or nesting the result.
    const result = path.join(stage, "result");
    const report = fs.readFileSync(path.join(result, "report.md"), "utf8");
    const chartFile = path.join(result, "chart.mmd");
    let index = `${report.trimEnd()}\n\n## Statechart\n\n`;
    if (fs.existsSync(chartFile)) {
      const chart = fs.readFileSync(chartFile, "utf8").trimEnd();
      const fence = "`".repeat(Math.max(3, ...Array.from(chart.matchAll(/`+/g), (m) => m[0].length + 1)));
      index += `${fence}mermaid\n${chart}\n${fence}\n\n[Mermaid source](./chart.mmd) · `;
    } else index += "The checker emitted no chart for this run. Its result and limits are recorded above.\n\n";
    index += "[Checker report](./report.md) · [Raw TLC output](./tlc.out)\n";
    fs.writeFileSync(path.join(result, "index.md"), index);
    fs.renameSync(result, out);
    console.log(`Saved chart and report to ${out}`);
    process.exitCode = code;
  } else process.exitCode = 2;
} catch (error) {
  console.error(`statechart: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = stopped ? interruptionCode() : 2;
} finally {
  if (stage) fs.rmSync(stage, { recursive: true, force: true });
}
