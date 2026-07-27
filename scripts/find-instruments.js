#!/usr/bin/env node

"use strict";

const fs = require("node:fs");
const path = require("node:path");

const CARD_DIR = path.resolve(__dirname, "..", "reference", "instruments");
const DEFAULT_LIMIT = 5;
const MAX_LIMIT = 40;
const MATURITY_BY_USE_COUNT = [
  [0, "draft"],
  [9, "trialed"],
  [24, "practiced"],
  [Number.POSITIVE_INFINITY, "established"],
];

const REQUIRED_FIELDS = [
  "id",
  "name",
  "summary",
  "use_when",
  "avoid_when",
  "access_target",
  "requires",
  "execution_seat",
  "fresh_context",
  "effort",
  "persistence",
  "artifact_risk",
  "maturity",
  "documented_uses",
];

const SEARCH_FIELDS = [
  ["id", 10],
  ["name", 9],
  ["use_when", 7],
  ["access_target", 6],
  ["summary", 5],
  ["requires", 3],
  ["avoid_when", 2],
  ["artifact_risk", 2],
  ["execution_seat", 1],
  ["fresh_context", 1],
  ["effort", 1],
  ["persistence", 1],
];

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "but",
  "by",
  "can",
  "do",
  "for",
  "from",
  "how",
  "i",
  "if",
  "in",
  "into",
  "is",
  "it",
  "may",
  "my",
  "of",
  "on",
  "or",
  "our",
  "should",
  "that",
  "the",
  "their",
  "them",
  "this",
  "to",
  "we",
  "what",
  "when",
  "which",
  "with",
]);

function usage() {
  return `Usage: node scripts/find-instruments.js [options] <search terms...>

Rank instrument cards by their YAML frontmatter and return each matching block in full.

Query shape:
  Use 4-8 abstract terms for one access problem, not the user's subject nouns.
  Combine the failure shape, desired readout, and any key control.
  Reuse language from the instrument bench in SKILL.md.

Options:
  --limit <n>   Return at most n matches (default: ${DEFAULT_LIMIT})
  --json        Emit machine-readable JSON
  --help        Show this help

Examples:
  node scripts/find-instruments.js events mixed motives observable sequence
  node scripts/find-instruments.js --limit 3 repeated word competing meanings standards
  node scripts/find-instruments.js --json strong probe added structure frozen baseline`;
}

function parseArgs(argv) {
  const terms = [];
  let json = false;
  let limit = DEFAULT_LIMIT;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--help" || arg === "-h") {
      return { help: true, json, limit, query: "" };
    }

    if (arg === "--json") {
      json = true;
      continue;
    }

    if (arg === "--limit") {
      const value = argv[index + 1];
      if (value === undefined) throw new Error("--limit requires a number");
      limit = parseLimit(value);
      index += 1;
      continue;
    }

    if (arg.startsWith("--limit=")) {
      limit = parseLimit(arg.slice("--limit=".length));
      continue;
    }

    if (arg.startsWith("-")) throw new Error(`unknown option: ${arg}`);
    terms.push(arg);
  }

  return { help: false, json, limit, query: terms.join(" ").trim() };
}

function parseLimit(value) {
  const limit = Number(value);
  if (!Number.isInteger(limit) || limit < 1 || limit > MAX_LIMIT) {
    throw new Error(`--limit must be an integer from 1 to ${MAX_LIMIT}`);
  }
  return limit;
}

function parseScalar(rawValue, file, lineNumber) {
  const value = rawValue.trim();
  if (!value) return "";

  if (value.startsWith('"')) {
    try {
      return JSON.parse(value);
    } catch {
      throw new Error(
        `${file}:${lineNumber}: invalid quoted frontmatter value`,
      );
    }
  }

  return value;
}

function parseFrontmatter(file) {
  const source = fs.readFileSync(file, "utf8");
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) throw new Error(`${file}: missing YAML frontmatter`);

  const metadata = {};
  for (const [index, line] of match[1].split(/\r?\n/).entries()) {
    if (!line.trim()) continue;
    const field = line.match(/^([a-z][a-z0-9_]*):\s*(.*)$/);
    if (!field) {
      throw new Error(`${file}:${index + 2}: unsupported frontmatter syntax`);
    }
    metadata[field[1]] = parseScalar(field[2], file, index + 2);
  }

  const missing = REQUIRED_FIELDS.filter(
    (field) => typeof metadata[field] !== "string" || !metadata[field].trim(),
  );
  if (missing.length) {
    throw new Error(
      `${file}: missing frontmatter fields: ${missing.join(", ")}`,
    );
  }

  const expectedId = path.basename(file, ".md");
  if (metadata.id !== expectedId) {
    throw new Error(`${file}: id "${metadata.id}" does not match filename`);
  }

  const documentedUses = Number(metadata.documented_uses);
  if (!Number.isInteger(documentedUses) || documentedUses < 0) {
    throw new Error(`${file}: documented_uses must be a non-negative integer`);
  }

  const expectedMaturity = MATURITY_BY_USE_COUNT.find(
    ([maximum]) => documentedUses <= maximum,
  )[1];
  if (metadata.maturity !== expectedMaturity) {
    throw new Error(
      `${file}: maturity "${metadata.maturity}" does not match ${documentedUses} documented uses; expected "${expectedMaturity}"`,
    );
  }

  return {
    ...metadata,
    frontmatter: `---\n${match[1]}\n---`,
    file: path.relative(path.resolve(__dirname, ".."), file),
  };
}

function normalize(value) {
  return value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function stem(token) {
  if (token.length <= 4) return token;
  return token
    .replace(/(ization|ational|fulness|ousness|iveness)$/, "")
    .replace(/(ments|ment|ness|tion|ions|able|ible)$/, "")
    .replace(/(ing|ers|ies|ied|ed|es|s)$/, "");
}

function queryTermDetails(query) {
  const seen = new Set();
  const terms = [];

  for (const token of normalize(query).split(/\s+/)) {
    if (!token || STOP_WORDS.has(token)) continue;
    const root = stem(token);
    if (root.length < 2 || seen.has(root)) continue;
    seen.add(root);
    terms.push({ input: token, root });
  }

  return terms;
}

function fieldMatch(fieldValue, token) {
  const words = normalize(fieldValue).split(/\s+/).filter(Boolean);
  let best = 0;

  for (const word of words) {
    if (STOP_WORDS.has(word)) continue;
    const root = stem(word);
    if (root === token) best = Math.max(best, 1);
    else if (
      token.length >= 4 &&
      root.length >= 4 &&
      (root.startsWith(token) || token.startsWith(root))
    ) {
      best = Math.max(best, 0.72);
    } else if (
      token.length >= 5 &&
      root.length >= 5 &&
      (word.includes(token) || token.includes(word))
    ) {
      best = Math.max(best, 0.45);
    }
  }

  return best;
}

function scoreCard(card, query, tokens) {
  let score = 0;
  const matchedTerms = new Set();
  const matchedFields = new Set();

  for (const [field, weight] of SEARCH_FIELDS) {
    for (const token of tokens) {
      const quality = fieldMatch(card[field], token);
      if (!quality) continue;
      score += weight * quality;
      matchedTerms.add(token);
      matchedFields.add(field);
    }
  }

  const normalizedQuery = normalize(query);
  if (normalizedQuery.length >= 4) {
    for (const [field, weight] of SEARCH_FIELDS.slice(0, 7)) {
      if (normalize(card[field]).includes(normalizedQuery)) {
        score += weight * 1.5;
        matchedFields.add(field);
      }
    }
  }

  const coverage = tokens.length ? matchedTerms.size / tokens.length : 0;
  score += matchedTerms.size * 2;
  if (coverage === 1) score += 5;

  return {
    ...card,
    score: Number(score.toFixed(2)),
    matched_terms: [...matchedTerms],
    matched_fields: [...matchedFields],
  };
}

function loadCards() {
  return fs
    .readdirSync(CARD_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => parseFrontmatter(path.join(CARD_DIR, entry.name)));
}

function search(cards, query, limit) {
  const termDetails = queryTermDetails(query);
  if (!termDetails.length) {
    throw new Error("provide at least one meaningful search term");
  }
  const tokens = termDetails.map((term) => term.root);

  const matches = cards
    .map((card) => scoreCard(card, query, tokens))
    .filter((card) => card.score > 0)
    .sort(
      (left, right) =>
        right.score - left.score ||
        right.matched_terms.length - left.matched_terms.length ||
        left.id.localeCompare(right.id),
    )
    .slice(0, limit);

  const best = matches[0];
  const bestMatchedRoots = new Set(best?.matched_terms ?? []);
  const matchedQueryTerms = termDetails
    .filter((term) => bestMatchedRoots.has(term.root))
    .map((term) => term.input);
  const unmatchedQueryTerms = termDetails
    .filter((term) => !bestMatchedRoots.has(term.root))
    .map((term) => term.input);
  const bestCoverage = termDetails.length
    ? matchedQueryTerms.length / termDetails.length
    : 0;
  const reasons = [];

  if (termDetails.length < 4) reasons.push("use at least four abstract terms");
  if (termDetails.length > 8)
    reasons.push("search one failure shape with at most eight terms");
  if (matchedQueryTerms.length < 2)
    reasons.push("fewer than two terms match the best card");
  if (bestCoverage < 0.5)
    reasons.push("less than half the terms match the best card");

  return {
    query,
    terms: termDetails.map((term) => term.input),
    diagnostic: {
      weak_query: reasons.length > 0,
      reasons,
      best_match: best?.id ?? null,
      best_coverage: Number(bestCoverage.toFixed(2)),
      matched_query_terms: matchedQueryTerms,
      unmatched_query_terms: unmatchedQueryTerms,
    },
    matches,
  };
}

function humanOutput(result) {
  const diagnostic = result.diagnostic;

  if (!result.matches.length) {
    return [
      `No frontmatter matches for: ${result.terms.join(", ")}`,
      "Reframe the case as one abstract access problem using the bench in SKILL.md.",
      "Name what is hidden, mixed, missing, induced, erased, or untested and the readout needed.",
    ].join("\n");
  }

  const lines = [];

  if (diagnostic.weak_query) {
    const percent = Math.round(diagnostic.best_coverage * 100);
    lines.push(
      `Weak query fit: ${diagnostic.best_match} matched ${diagnostic.matched_query_terms.length} of ${result.terms.length} terms (${percent}%).`,
    );
    if (diagnostic.unmatched_query_terms.length) {
      lines.push(
        `Unmatched terms: ${diagnostic.unmatched_query_terms.join(", ")}`,
      );
    }
    lines.push(`Why weak: ${diagnostic.reasons.join("; ")}.`);
    lines.push(
      "Reframe before trusting the ranking: use 4-8 bench terms for one abstract failure shape and desired readout, not domain nouns.",
      "",
      `Tentative instrument metadata matches for: ${result.terms.join(", ")}`,
    );
  } else {
    lines.push(`Instrument metadata matches for: ${result.terms.join(", ")}`);
  }

  lines.push(
    "Search relevance only; check fit before offering an instrument.",
    "",
  );

  for (const [index, card] of result.matches.entries()) {
    lines.push(
      `${index + 1}. ${card.id} — relevance ${card.score}; matched ${card.matched_terms.join(", ")} in ${card.matched_fields.join(", ")}`,
    );
    lines.push(`card: ${card.file}`);
    lines.push(card.frontmatter);
    lines.push("");
  }

  return lines.join("\n").trimEnd();
}

function main() {
  try {
    const options = parseArgs(process.argv.slice(2));
    if (options.help) {
      process.stdout.write(`${usage()}\n`);
      return;
    }

    if (!options.query) throw new Error("no search terms supplied");
    const result = search(loadCards(), options.query, options.limit);

    if (options.json) {
      process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    } else {
      process.stdout.write(`${humanOutput(result)}\n`);
    }
  } catch (error) {
    process.stderr.write(`find-instruments: ${error.message}\n\n${usage()}\n`);
    process.exitCode = 1;
  }
}

main();
