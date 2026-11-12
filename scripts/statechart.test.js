"use strict";
const assert = require("node:assert/strict");
const { spawnSync, spawn } = require("node:child_process");
const { once } = require("node:events");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const script = path.join(__dirname, "statechart.mjs");
function fixture(t, extra = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "chart paths $() "));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const model = path.join(root, "Model.tla");
  fs.writeFileSync(model, "---- MODULE Model ----\n====\n");
  fs.writeFileSync(path.join(root, "Model.cfg"), "INIT Init\n");
  const docker = path.join(root, "docker");
  fs.writeFileSync(docker, `#!${process.execPath}
const fs = require('node:fs');
const path = require('node:path');
const args = process.argv.slice(2);
fs.appendFileSync(process.env.CALLS, JSON.stringify(args)+'\\n');
if (args[0] === 'build') process.exit(Number(process.env.BUILD_STATUS || 0));
const mount = args.find(v => v.endsWith(':/out:rw'));
const stage = mount.slice(0, -':/out:rw'.length);
if (process.env.MODE === 'stall') {
  fs.writeFileSync(process.env.ENTERED, 'ready');
  setInterval(() => {}, 1000);
} else {
  if (process.env.MODE !== 'error') {
    const out = path.join(stage, 'result');
    fs.mkdirSync(out);
    fs.writeFileSync(path.join(out, 'report.md'), '# Model\\n\\nThe configured rule breaks.\\n');
    fs.writeFileSync(path.join(out, 'chart.mmd'), 'stateDiagram-v2\\n  s0 --> s1: checks run\\n  class s1 breaks\\n');
    fs.writeFileSync(path.join(out, 'tlc.out'), 'raw evidence');
    if (process.env.MODE === 'race') {
      fs.mkdirSync(process.env.DEST);
      fs.writeFileSync(path.join(process.env.DEST, 'keep'), 'concurrent work');
    }
  }
  process.exit(process.env.MODE === 'error' ? 2 : Number(process.env.CHECK_STATUS || 0));
}
`, { mode: 0o755 });
  const out = path.join(root, "output with spaces");
  const calls = path.join(root, "calls.jsonl");
  const env = { ...process.env, PATH: `${root}${path.delimiter}${process.env.PATH}`, CALLS: calls,
    DEST: out, ENTERED: path.join(root, "entered"), ...extra };
  return { root, model, out, env, calls, run: (args = []) => spawnSync(process.execPath, [script, model, "--out", out, ...args], { encoding: "utf8", env }) };
}
function noStage(root) {
  assert.deepEqual(fs.readdirSync(root).filter(v => v.startsWith(".field-lab-statechart-")), []);
}

test("paths with spaces and shell text are passed literally; the brief preserves the checker evidence", (t) => {
  const f = fixture(t);
  const source = fs.readFileSync(f.model, "utf8");
  const r = f.run();
  assert.equal(r.status, 0, r.stderr);
  assert.equal(fs.readFileSync(f.model, "utf8"), source);
  const index = fs.readFileSync(path.join(f.out, "index.md"), "utf8");
  assert.match(index, /^# Model\n\nThe configured rule breaks\./);
  assert.match(index, /```mermaid\nstateDiagram-v2/);
  assert.match(index, /class s1 breaks/);
  const run = fs.readFileSync(f.calls, "utf8").trim().split("\n").map(JSON.parse).find(a => a[0] === "run");
  assert.ok(run.includes(`${fs.realpathSync(f.root)}:/model:ro`));
  assert.ok(!run.includes(`${fs.realpathSync(f.root)}:/out:rw`), "inputs must not have a writable alias");
  noStage(f.root);
});

test("a counterexample exits 1 and still publishes its report and chart", (t) => {
  const f = fixture(t, { CHECK_STATUS: "1" });
  const r = f.run();
  assert.equal(r.status, 1, r.stderr);
  assert.ok(fs.existsSync(path.join(f.out, "chart.mmd")));
  assert.ok(fs.existsSync(path.join(f.out, "report.md")));
  noStage(f.root);
});

test("checker setup failure publishes nothing and removes temporary output", (t) => {
  const f = fixture(t, { MODE: "error" });
  assert.equal(f.run().status, 2);
  assert.ok(!fs.existsSync(f.out));
  noStage(f.root);
});

test("an existing result is rejected before Docker runs", (t) => {
  const f = fixture(t);
  fs.mkdirSync(f.out);
  fs.writeFileSync(path.join(f.out, "keep"), "existing work");
  assert.equal(f.run().status, 2);
  assert.equal(fs.readFileSync(path.join(f.out, "keep"), "utf8"), "existing work");
  assert.ok(!fs.existsSync(f.calls));
});

test("a result created during checking is preserved instead of replaced or nested", (t) => {
  const f = fixture(t, { MODE: "race" });
  assert.equal(f.run().status, 2);
  assert.deepEqual(fs.readdirSync(f.out), ["keep"]);
  assert.equal(fs.readFileSync(path.join(f.out, "keep"), "utf8"), "concurrent work");
  noStage(f.root);
});

test("interruption publishes nothing and preserves its signal exit", async (t) => {
  const f = fixture(t, { MODE: "stall" });
  const child = spawn(process.execPath, [script, f.model, "--out", f.out], { env: f.env, stdio: "ignore" });
  t.after(() => child.kill("SIGKILL"));
  const exited = once(child, "exit");
  const deadline = Date.now() + 5000;
  while (!fs.existsSync(f.env.ENTERED) && Date.now() < deadline)
    await new Promise(resolve => setTimeout(resolve, 10));
  assert.ok(fs.existsSync(f.env.ENTERED), "test reached the running container boundary");
  child.kill("SIGTERM");
  const [code] = await exited;
  assert.equal(code, 143);
  assert.ok(!fs.existsSync(f.out));
  noStage(f.root);
});
