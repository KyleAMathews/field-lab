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
    { label: "Community protocol", x: 0.2, y: 0.8, plotReason: "strongest prototype", provenance: "source claim", source: "S1" },
    { label: "A & B <pilot>", x: 0.8, y: 0.75, plotReason: "movement case", provenance: "observation", source: "I2", note: "Moves left over time" },
    { label: "Local workaround", x: 0.25, y: 0.2, plotReason: "tests the near-term pole", provenance: "user testimony", source: "U1" },
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
  assert.match(ascii, /why plotted: strongest prototype/);
  assert.match(ascii, /\[under-occupied\]/);
  assert.match(ascii, /Axis claim type: conceptual/);

  const svg = fs.readFileSync(`${output}.svg`, "utf8");
  assert.match(svg, /<svg[^>]+role="img"/);
  assert.match(svg, /<title id="frame-title">Control and horizon<\/title>/);
  assert.match(svg, /A &amp; B &lt;pilot&gt;/);
  assert.match(svg, /aria-label="2\. A &amp; B &lt;pilot&gt;/);
  assert.match(svg, /featured because movement case/);
  assert.match(svg, /Second-axis confidence/);
  assert.match(svg, /viewBox="0 0 840 /);
  assert.match(svg, /Source Serif 4/);
  assert.doesNotMatch(svg, /#a44f38|#e8f0f4|#f2ecdf|#edf0e4|#f3e8e2/);
  assert.ok(svg.indexOf(">Calibration<") < svg.indexOf(">Examples<"));
});

test("uses optional category colors while naming categories in both formats", () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "frame-renderer-"));
  const input = path.join(directory, "categories.json");
  const output = path.join(directory, "result");
  const categorized = structuredClone(SPEC);
  categorized.categories = {
    observed: { label: "Observed", color: "#0072B2" },
    proposed: { label: "Proposed", color: "#F0E442" },
  };
  categorized.examples[0].category = "observed";
  categorized.examples[1].category = "proposed";
  fs.writeFileSync(input, JSON.stringify(categorized));

  const result = spawnSync(process.execPath, [SCRIPT, "--out", output, input], {
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr);

  const ascii = fs.readFileSync(`${output}.txt`, "utf8");
  assert.match(
    ascii,
    /category: Observed; why plotted: strongest prototype; source claim; S1/,
  );
  assert.match(
    ascii,
    /category: Proposed; why plotted: movement case; observation; I2/,
  );

  const svg = fs.readFileSync(`${output}.svg`, "utf8");
  assert.match(svg, /fill="#0072B2"/);
  assert.match(svg, /fill="#F0E442"/);
  assert.match(svg, /category: Observed/);
  assert.match(svg, /category: Proposed/);
  assert.match(svg, /aria-label="1\. Community protocol, category Observed/);
  assert.match(svg, /fill="#111">2<\/text>/);
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

test("rejects unknown categories and non-hex colors", () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "frame-renderer-"));
  const input = path.join(directory, "bad-category.json");
  const badCategory = structuredClone(SPEC);
  badCategory.categories = {
    observed: { label: "Observed", color: "blue" },
  };
  fs.writeFileSync(input, JSON.stringify(badCategory));

  let result = spawnSync(process.execPath, [SCRIPT, input], { encoding: "utf8" });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /must be a six-digit hex color/);

  badCategory.categories.observed.color = "#0072B2";
  badCategory.examples[0].category = "missing";
  fs.writeFileSync(input, JSON.stringify(badCategory));
  result = spawnSync(process.execPath, [SCRIPT, input], { encoding: "utf8" });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /must name a key from categories/);
});

test("rejects an exhaustive or quadrant-crowded example list", () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "frame-renderer-"));
  const input = path.join(directory, "crowded.json");
  const crowded = structuredClone(SPEC);
  crowded.examples = Array.from({ length: 9 }, (_, index) => ({
    label: `Case ${index + 1}`,
    x: index % 2 ? 0.75 : 0.25,
    y: index % 4 < 2 ? 0.75 : 0.25,
    plotReason: "generated density test",
    provenance: "generated sample",
    source: `G${index + 1}`,
  }));
  fs.writeFileSync(input, JSON.stringify(crowded));

  let result = spawnSync(process.execPath, [SCRIPT, input], { encoding: "utf8" });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /at most 8 featured cases/);

  crowded.examples = crowded.examples.slice(0, 5).map((example, index) => ({
    ...example,
    x: 0.2 + index * 0.05,
    y: 0.8 - index * 0.05,
  }));
  fs.writeFileSync(input, JSON.stringify(crowded));
  result = spawnSync(process.execPath, [SCRIPT, input], { encoding: "utf8" });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /plot at most 4 featured cases per quadrant/);

  crowded.examples = crowded.examples.slice(0, 4);
  fs.writeFileSync(input, JSON.stringify(crowded));
  result = spawnSync(process.execPath, [SCRIPT, input], { encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
});

test("requires a reason for every plotted example", () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "frame-renderer-"));
  const input = path.join(directory, "unjustified.json");
  const unjustified = structuredClone(SPEC);
  delete unjustified.examples[0].plotReason;
  fs.writeFileSync(input, JSON.stringify(unjustified));

  const result = spawnSync(process.execPath, [SCRIPT, input], { encoding: "utf8" });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /examples\[0\]\.plotReason must be a non-empty string/);
});
