"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const { validate } = require("./validate-research-survey.js");

const template = fs.readFileSync(
  path.resolve(__dirname, "..", "assets", "research-survey-template.md"),
  "utf8",
);

function completeSurvey() {
  return template
    .replace(/\{\{[^}]+\}\}/g, "Filled with inspected, source-traced material")
    .replace(/YYYY-MM-DD/g, "2026-08-24");
}

test("accepts a complete survey with controls and resolved source links", () => {
  assert.deepEqual(validate(completeSurvey()), []);
});

test("rejects a broken claim-to-source trail", () => {
  const survey = completeSurvey().replace("| S1 |", "| S99 |");
  assert.ok(
    validate(survey).some((error) =>
      error.includes("source reference S99 has no declaration"),
    ),
  );
});

test("rejects a complete survey that skipped the prominence control", () => {
  const survey = completeSurvey().replace(
    /- \*\*Prominence counter-search:\*\* .+/,
    "- **Prominence counter-search:** not run",
  );
  assert.ok(
    validate(survey).some((error) =>
      error.includes('did not run control "Prominence counter-search"'),
    ),
  );
});

test("rejects conclusion-shaped sections", () => {
  const survey = `${completeSurvey()}\n## Recommendations\n\nChoose the first option.\n`;
  assert.ok(
    validate(survey).some((error) =>
      error.includes("crosses the survey's interpretation boundary"),
    ),
  );
});
