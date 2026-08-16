"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const test = require("node:test");

const SCRIPT = path.resolve(__dirname, "render-frame.js");

const SPEC = {
  title: "Control and horizon",
  description: "A test frame with concrete examples.",
  axes: {
    x: { name: "control", negative: "emergent", positive: "centralized" },
    y: { name: "horizon", negative: "near", positive: "long" },
  },
  quadrants: {
    tl: { name: "Gardeners", description: "Patient and distributed." },
    tr: { name: "Architects", description: "Patient and directed." },
    bl: { name: "Improvisers", description: "Local and adaptive." },
    br: { name: "Operators", description: "Local and directed.", status: "under-occupied" },
  },
  examples: [
    { label: "Community protocol", x: 0.2, y: 0.8, provenance: "source claim", source: "S1" },
    { label: "A & B <pilot>", x: 0.8, y: 0.75, provenance: "observation", source: "I2", note: "Moves left over time" },
    { label: "Local workaround", x: 0.25, y: 0.2, provenance: "user testimony", source: "U1" },
  ],
  calibration: {
    axisClaimType: "conceptual",
    secondAxisConfidence: "moderate",
    orthogonality: "Useful, with some diagonal pull.",
  },
};

test("renders one spec to ASCII and accessible SVG", () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "frame-renderer-"));
  const input = path.join(directory, "frame.json");
  const output = path.join(directory, "result");
  fs.writeFileSync(input, JSON.stringify(SPEC));

  const result = spawnSync(process.execPath, [SCRIPT, "--out", output, input], {
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout, `${output}.txt\n${output}.svg\n`);

  const ascii = fs.readFileSync(`${output}.txt`, "utf8");
  assert.match(ascii, /Control and horizon/);
  assert.match(ascii, /\[1\] Community protocol/);
  assert.match(ascii, /\[under-occupied\]/);
  assert.match(ascii, /Axis claim type: conceptual/);

  const svg = fs.readFileSync(`${output}.svg`, "utf8");
  assert.match(svg, /<svg[^>]+role="img"/);
  assert.match(svg, /<title id="frame-title">Control and horizon<\/title>/);
  assert.match(svg, /A &amp; B &lt;pilot&gt;/);
  assert.match(svg, /aria-label="2\. A &amp; B &lt;pilot&gt;/);
  assert.match(svg, /Second-axis confidence/);
  assert.match(svg, /viewBox="0 0 840 /);
  assert.match(svg, /Source Serif 4/);
  assert.doesNotMatch(svg, /#a44f38|#e8f0f4|#f2ecdf|#edf0e4|#f3e8e2/);
  assert.ok(svg.indexOf(">Calibration<") < svg.indexOf(">Examples<"));
});

test("rejects coordinates outside the normalized frame", () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "frame-renderer-"));
  const input = path.join(directory, "bad.json");
  const bad = structuredClone(SPEC);
  bad.examples[0].x = 1.2;
  fs.writeFileSync(input, JSON.stringify(bad));

  const result = spawnSync(process.execPath, [SCRIPT, input], { encoding: "utf8" });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /examples\[0\]\.x must be a number from 0 to 1/);
});
