#!/usr/bin/env node

"use strict";

const fs = require("node:fs");
const path = require("node:path");

const REQUIRED_FRONTMATTER = [
  "instrument",
  "title",
  "question",
  "scope",
  "intended_use",
  "depth",
  "researched_at",
  "source_cutoff",
  "status",
];

const REQUIRED_SECTIONS = [
  "Survey brief",
  "Orientation",
  "Terms and distinctions",
  "Evidence landscape",
  "Positions and mechanisms",
  "Disputes and conflicting evidence",
  "Cases and timeline",
  "Coverage and gaps",
  "Claim-to-source ledger",
  "Sources",
  "Search and control record",
  "Limits and unmeasured",
  "Handoff index",
];

const REQUIRED_CONTROLS = [
  "Search routes",
  "Prominence counter-search",
  "Contrary-evidence search",
  "Source-class coverage",
  "Recency check",
  "Saturation check",
];

const FORBIDDEN_SECTIONS = [
  "conclusion",
  "conclusions",
  "recommendation",
  "recommendations",
  "ranking",
  "best option",
  "final answer",
];

function usage() {
  return "Usage: node scripts/validate-research-survey.js <survey.md>";
}

function unquote(value) {
  const trimmed = value.trim();
  if (
    trimmed.length >= 2 &&
    ((trimmed.startsWith('"') && trimmed.endsWith('"')) ||
      (trimmed.startsWith("'") && trimmed.endsWith("'")))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function parseFrontmatter(source, errors) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) {
    errors.push("missing YAML frontmatter");
    return {};
  }

  const result = {};
  for (const [index, line] of match[1].split(/\r?\n/).entries()) {
    if (!line.trim()) continue;
    const field = line.match(/^([a-z][a-z0-9_]*):\s*(.*)$/);
    if (!field) {
      errors.push(`frontmatter line ${index + 2} is not a flat key/value field`);
      continue;
    }
    result[field[1]] = unquote(field[2]);
  }
  return result;
}

function collectSections(source) {
  const lines = source.split(/\r?\n/);
  const sections = new Map();
  let active;

  for (const line of lines) {
    const heading = line.match(/^##\s+(.+?)\s*$/);
    if (heading) {
      active = heading[1];
      sections.set(active, []);
      continue;
    }
    if (active) sections.get(active).push(line);
  }

  return new Map(
    [...sections].map(([heading, body]) => [heading, body.join("\n").trim()]),
  );
}

function controlValue(section, label) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = section.match(
    new RegExp(`^- \\*\\*${escaped}:\\*\\*\\s*(.+?)\\s*$`, "mi"),
  );
  return match?.[1]?.trim() ?? "";
}

function isMissing(value) {
  return (
    !value ||
    /\{\{[^}]+\}\}|YYYY-MM-DD/i.test(value) ||
    /^(?:tbd|todo|unknown|none|n\/a|not run)(?:\b|\s|[-—:]|$)/i.test(value)
  );
}

function validate(source) {
  const errors = [];
  const metadata = parseFrontmatter(source, errors);

  for (const field of REQUIRED_FRONTMATTER) {
    if (isMissing(metadata[field])) errors.push(`frontmatter field ${field} is missing`);
  }

  if (metadata.instrument && metadata.instrument !== "research-survey") {
    errors.push('frontmatter field instrument must be "research-survey"');
  }
  if (metadata.depth && !["quick", "broad", "deep"].includes(metadata.depth)) {
    errors.push("frontmatter field depth must be quick, broad, or deep");
  }
  if (
    metadata.status &&
    !["complete", "bounded", "stopped"].includes(metadata.status)
  ) {
    errors.push("frontmatter field status must be complete, bounded, or stopped");
  }

  if (/\{\{[^}]+\}\}|YYYY-MM-DD/.test(source)) {
    errors.push("unresolved template placeholders remain");
  }

  const sections = collectSections(source);
  for (const heading of REQUIRED_SECTIONS) {
    const body = sections.get(heading);
    if (!body) errors.push(`required section "${heading}" is missing or empty`);
  }

  for (const heading of sections.keys()) {
    if (FORBIDDEN_SECTIONS.includes(heading.trim().toLowerCase())) {
      errors.push(`section "${heading}" crosses the survey's interpretation boundary`);
    }
  }

  const controlSection = sections.get("Search and control record") ?? "";
  for (const label of REQUIRED_CONTROLS) {
    const value = controlValue(controlSection, label);
    if (!value) errors.push(`control record "${label}" is missing`);
    else if (metadata.status === "complete" && isMissing(value)) {
      errors.push(`complete survey did not run control "${label}"`);
    }
  }

  const declaredSources = new Set(
    [...source.matchAll(/<a\s+id=["']s(\d+)["']><\/a>\s*\*\*S\1\*\*/gi)].map(
      (match) => `S${match[1]}`,
    ),
  );
  const referencedSources = new Set(
    [...source.matchAll(/\bS(\d+)\b/g)].map((match) => `S${match[1]}`),
  );
  for (const sourceId of referencedSources) {
    if (!declaredSources.has(sourceId)) {
      errors.push(`source reference ${sourceId} has no declaration in Sources`);
    }
  }
  if (metadata.status === "complete" && declaredSources.size === 0) {
    errors.push("complete survey declares no sources");
  }

  const claimLedger = sections.get("Claim-to-source ledger") ?? "";
  if (!/\|\s*C\d+\s*\|/.test(claimLedger)) {
    errors.push("claim-to-source ledger contains no claim rows");
  }
  for (const row of claimLedger.split(/\r?\n/)) {
    if (!/^\|\s*C\d+\s*\|/.test(row)) continue;
    if (!/\bS\d+\b/.test(row) && !/\b(?:inference|hypothesis)\b/i.test(row)) {
      errors.push(`claim ledger row lacks source support or an inference label: ${row}`);
    }
  }

  const disputes = sections.get("Disputes and conflicting evidence") ?? "";
  if (
    disputes &&
    !/\b(?:S\d+|no material conflict was found)\b/i.test(disputes)
  ) {
    errors.push(
      "disputes section must cite source IDs or state the bounded no-conflict result",
    );
  }

  return errors;
}

function main(argv) {
  if (argv.length !== 1 || argv[0] === "--help" || argv[0] === "-h") {
    const stream = argv.length === 1 ? process.stdout : process.stderr;
    stream.write(`${usage()}\n`);
    return argv.length === 1 ? 0 : 2;
  }

  const file = path.resolve(argv[0]);
  let source;
  try {
    source = fs.readFileSync(file, "utf8");
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    return 2;
  }

  const errors = validate(source);
  if (errors.length) {
    for (const error of errors) process.stderr.write(`- ${error}\n`);
    return 1;
  }

  process.stdout.write(`${file}: valid research survey structure\n`);
  return 0;
}

if (require.main === module) process.exitCode = main(process.argv.slice(2));

module.exports = { validate };
