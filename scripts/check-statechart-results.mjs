import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.argv[2];
for (const lane of ["safe", "weakened"]) {
  const read = (name) => fs.readFileSync(path.join(root, lane, name), "utf8");
  const report = read("report.md");
  const chart = read("chart.mmd");
  const index = read("index.md");
  assert.match(chart, /stateDiagram-v2/);
  assert.match(index, /```mermaid\n/);
  assert.ok(index.includes(chart.trimEnd()), `${lane} brief must use the actual generated chart`);
  assert.ok(index.startsWith(report.trimEnd()), `${lane} brief must preserve the checker report`);
  assert.match(read("tlc.out"), /TLC2 Version/);
  if (lane === "safe") {
    assert.match(report, /Rules that hold[\s\S]*GenerationIsGrounded/);
    assert.doesNotMatch(chart, /class s\d+ (?:breaks|mayBreak)\b/);
  } else {
    assert.match(report, /GenerationIsGrounded breaks[\s\S]*The shortest path has 1 step:/);
    assert.match(report, /generate before both checks/);
    assert.match(chart, /class s\d+ breaks\b/);
    assert.match(chart, /Adjacent forms generated before grounding/);
    assert.match(read("tlc.out"), /GenerationIsGrounded is violated/);
  }
}
console.log(`Statechart control passed: grounded model held; premature generation failed at the expected step.\nArtifacts: ${path.resolve(root)}`);
