#!/usr/bin/env node

"use strict";

const fs = require("node:fs");
const path = require("node:path");

const QUADRANTS = ["tl", "tr", "bl", "br"];
const DEFAULT_CELL_WIDTH = 40;
const MAX_FEATURED_EXAMPLES = 8;
const MAX_EXAMPLES_PER_QUADRANT = 4;

function usage() {
  return `Usage: node scripts/render-frame.js [options] <frame.json>

Render one Frame Projector spec as both plain ASCII and SVG.

Options:
  --out <prefix>       Output path without an extension (default: input path)
  --cell-width <n>     ASCII cell width, 24-72 (default: ${DEFAULT_CELL_WIDTH})
  --help               Show this help

The command writes <prefix>.txt and <prefix>.svg.`;
}

function parseArgs(argv) {
  let input;
  let outputPrefix;
  let cellWidth = DEFAULT_CELL_WIDTH;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--help" || arg === "-h") return { help: true };
    if (arg === "--out") {
      outputPrefix = argv[index + 1];
      if (!outputPrefix) throw new Error("--out requires a path");
      index += 1;
      continue;
    }
    if (arg === "--cell-width") {
      const value = Number(argv[index + 1]);
      if (!Number.isInteger(value) || value < 24 || value > 72) {
        throw new Error("--cell-width must be an integer from 24 to 72");
      }
      cellWidth = value;
      index += 1;
      continue;
    }
    if (arg.startsWith("-")) throw new Error(`unknown option: ${arg}`);
    if (input) throw new Error("provide exactly one frame JSON file");
    input = arg;
  }

  if (!input) throw new Error("missing frame JSON file");
  return {
    help: false,
    input: path.resolve(input),
    outputPrefix: outputPrefix
      ? path.resolve(outputPrefix)
      : path.resolve(input).replace(/\.json$/i, ""),
    cellWidth,
  };
}

function expectObject(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label} must be an object`);
  }
  return value;
}

function expectString(value, label, optional = false) {
  if (optional && value === undefined) return "";
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${label} must be a non-empty string`);
  }
  return value.trim();
}

function expectColor(value, label) {
  const color = expectString(value, label);
  if (!/^#[0-9a-fA-F]{6}$/.test(color)) {
    throw new Error(`${label} must be a six-digit hex color such as #0072B2`);
  }
  return color;
}

function contrastTextColor(color) {
  const channels = color
    .slice(1)
    .match(/.{2}/g)
    .map((channel) => Number.parseInt(channel, 16) / 255)
    .map((channel) =>
      channel <= 0.04045
        ? channel / 12.92
        : ((channel + 0.055) / 1.055) ** 2.4,
    );
  const luminance =
    channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  const whiteContrast = 1.05 / (luminance + 0.05);
  const blackContrast = (luminance + 0.05) / 0.05;
  return whiteContrast >= blackContrast ? "#fff" : "#111";
}

function validateSpec(raw) {
  const spec = expectObject(raw, "frame");
  const axes = expectObject(spec.axes, "axes");
  const x = expectObject(axes.x, "axes.x");
  const y = expectObject(axes.y, "axes.y");
  const quadrants = expectObject(spec.quadrants, "quadrants");

  const normalized = {
    title: expectString(spec.title, "title"),
    description: expectString(spec.description, "description", true),
    axes: {
      x: {
        name: expectString(x.name, "axes.x.name"),
        negative: expectString(x.negative, "axes.x.negative"),
        positive: expectString(x.positive, "axes.x.positive"),
      },
      y: {
        name: expectString(y.name, "axes.y.name"),
        negative: expectString(y.negative, "axes.y.negative"),
        positive: expectString(y.positive, "axes.y.positive"),
      },
    },
    quadrants: {},
    categories: {},
    examples: [],
    calibration: {},
  };

  for (const key of QUADRANTS) {
    const quadrant = expectObject(quadrants[key], `quadrants.${key}`);
    const status = quadrant.status || "";
    if (status && !["empty", "under-occupied"].includes(status)) {
      throw new Error(
        `quadrants.${key}.status must be "empty" or "under-occupied"`,
      );
    }
    normalized.quadrants[key] = {
      name: expectString(quadrant.name, `quadrants.${key}.name`),
      description: expectString(
        quadrant.description,
        `quadrants.${key}.description`,
        true,
      ),
      status,
    };
  }

  if (spec.categories !== undefined) {
    const categories = expectObject(spec.categories, "categories");
    for (const [key, rawCategory] of Object.entries(categories)) {
      if (!key.trim()) throw new Error("category keys must be non-empty strings");
      const category = expectObject(rawCategory, `categories.${key}`);
      const color = expectColor(category.color, `categories.${key}.color`);
      normalized.categories[key] = {
        label: expectString(category.label, `categories.${key}.label`),
        color,
        textColor: contrastTextColor(color),
      };
    }
  }

  if (!Array.isArray(spec.examples)) throw new Error("examples must be an array");
  if (spec.examples.length > MAX_FEATURED_EXAMPLES) {
    throw new Error(
      `examples may contain at most ${MAX_FEATURED_EXAMPLES} featured cases; keep the full inventory in the readout and plot only cases that clarify or test the frame`,
    );
  }
  for (const [index, example] of spec.examples.entries()) {
    expectObject(example, `examples[${index}]`);
    const xValue = Number(example.x);
    const yValue = Number(example.y);
    if (!Number.isFinite(xValue) || xValue < 0 || xValue > 1) {
      throw new Error(`examples[${index}].x must be a number from 0 to 1`);
    }
    if (!Number.isFinite(yValue) || yValue < 0 || yValue > 1) {
      throw new Error(`examples[${index}].y must be a number from 0 to 1`);
    }
    const category = expectString(
      example.category,
      `examples[${index}].category`,
      true,
    );
    if (category && !Object.hasOwn(normalized.categories, category)) {
      throw new Error(
        `examples[${index}].category must name a key from categories`,
      );
    }
    normalized.examples.push({
      number: index + 1,
      label: expectString(example.label, `examples[${index}].label`),
      x: xValue,
      y: yValue,
      provenance: expectString(
        example.provenance,
        `examples[${index}].provenance`,
      ),
      source: expectString(example.source, `examples[${index}].source`),
      plotReason: expectString(
        example.plotReason,
        `examples[${index}].plotReason`,
      ),
      note: expectString(example.note, `examples[${index}].note`, true),
      category,
    });
  }

  for (const key of QUADRANTS) {
    const count = normalized.examples.filter(
      (example) => quadrantFor(example) === key,
    ).length;
    if (count > MAX_EXAMPLES_PER_QUADRANT) {
      throw new Error(
        `quadrant ${key} has ${count} examples; plot at most ${MAX_EXAMPLES_PER_QUADRANT} featured cases per quadrant and keep the rest in the readout`,
      );
    }
  }

  const calibration = expectObject(spec.calibration, "calibration");
  normalized.calibration = {
    axisClaimType: expectString(
      calibration.axisClaimType,
      "calibration.axisClaimType",
    ),
    secondAxisConfidence: expectString(
      calibration.secondAxisConfidence,
      "calibration.secondAxisConfidence",
    ),
    orthogonality: expectString(
      calibration.orthogonality,
      "calibration.orthogonality",
    ),
  };

  return normalized;
}

function quadrantFor(example) {
  const horizontal = example.x < 0.5 ? "l" : "r";
  const vertical = example.y < 0.5 ? "b" : "t";
  return `${vertical}${horizontal}`;
}

function categoryFor(spec, example) {
  return example.category ? spec.categories[example.category] : undefined;
}

function wrap(text, width) {
  if (!text) return [];
  const words = text.split(/\s+/);
  const lines = [];
  let line = "";
  for (const word of words) {
    if (!line) {
      line = word.length <= width ? word : word.slice(0, width - 1) + "~";
      continue;
    }
    if (line.length + 1 + word.length <= width) {
      line += ` ${word}`;
    } else {
      lines.push(line);
      line = word.length <= width ? word : word.slice(0, width - 1) + "~";
    }
  }
  if (line) lines.push(line);
  return lines;
}

function pad(text, width) {
  const clipped = text.length > width ? text.slice(0, width - 1) + "~" : text;
  return clipped + " ".repeat(width - clipped.length);
}

function cellLines(spec, key, width) {
  const quadrant = spec.quadrants[key];
  const members = spec.examples.filter((example) => quadrantFor(example) === key);
  const lines = [quadrant.name];
  for (const example of members.slice(0, 2)) {
    lines.push(...wrap(`[${example.number}] ${example.label}`, width));
  }
  if (!members.length) lines.push(`[${quadrant.status || "empty"}]`);
  else if (quadrant.status) lines.push(`[${quadrant.status}]`);
  if (members.length > 2) lines.push(`+ ${members.length - 2} more below`);
  return lines;
}

function renderAscii(spec, cellWidth) {
  const innerWidth = cellWidth * 2 + 1;
  const top = `+${"-".repeat(cellWidth)}+${"-".repeat(cellWidth)}+`;
  const middle = top;
  const bottom = top;

  const pairLines = (left, right) => {
    const rows = [];
    const height = Math.max(left.length, right.length, 4);
    for (let index = 0; index < height; index += 1) {
      rows.push(
        `|${pad(left[index] || "", cellWidth)}|${pad(right[index] || "", cellWidth)}|`,
      );
    }
    return rows;
  };

  const yTop = `${spec.axes.y.name}: ${spec.axes.y.positive}`;
  const yBottom = `${spec.axes.y.name}: ${spec.axes.y.negative}`;
  const xLeft = `${spec.axes.x.name}: ${spec.axes.x.negative}`;
  const xRight = `${spec.axes.x.name}: ${spec.axes.x.positive}`;
  const centered = (value) =>
    " ".repeat(Math.max(0, Math.floor((innerWidth + 2 - value.length) / 2))) +
    value;

  const output = [spec.title];
  if (spec.description) output.push(...wrap(spec.description, innerWidth + 2));
  output.push("", centered(yTop), centered("^"), top);
  output.push(
    ...pairLines(
      cellLines(spec, "tl", cellWidth),
      cellLines(spec, "tr", cellWidth),
    ),
  );
  output.push(`${xLeft} <- ${middle} -> ${xRight}`);
  output.push(
    ...pairLines(
      cellLines(spec, "bl", cellWidth),
      cellLines(spec, "br", cellWidth),
    ),
  );
  output.push(bottom, centered("v"), centered(yBottom));

  output.push("", "Placements (normalized x, y):");
  if (!spec.examples.length) output.push("[none]");
  for (const example of spec.examples) {
    const category = categoryFor(spec, example);
    const details = [
      category ? `category: ${category.label}` : "",
      `why plotted: ${example.plotReason}`,
      example.provenance,
      example.source,
    ]
      .filter(Boolean)
      .join("; ");
    output.push(
      `[${example.number}] ${example.label} (${example.x.toFixed(2)}, ${example.y.toFixed(2)})${details ? ` - ${details}` : ""}${example.note ? ` - ${example.note}` : ""}`,
    );
  }

  const calibration = [
    ["Axis claim type", spec.calibration.axisClaimType],
    ["Second-axis confidence", spec.calibration.secondAxisConfidence],
    ["Orthogonality", spec.calibration.orthogonality],
  ].filter(([, value]) => value);
  if (calibration.length) {
    output.push("", "Calibration:");
    for (const [label, value] of calibration) output.push(`${label}: ${value}`);
  }
  return output.join("\n") + "\n";
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function svgTextLines(lines, x, y, options = {}) {
  const {
    className = "",
    lineHeight = 20,
    anchor = "start",
    maxLines = lines.length,
  } = options;
  return lines
    .slice(0, maxLines)
    .map(
      (line, index) =>
        `<text class="${className}" x="${x}" y="${y + index * lineHeight}" text-anchor="${anchor}">${escapeXml(line)}</text>`,
    )
    .join("\n");
}

function renderSvg(spec) {
  const width = 840;
  const plotX = 120;
  const plotY = 270;
  const plotSize = 600;
  const half = plotSize / 2;
  const legendRows = spec.examples.map((example) => {
    const category = categoryFor(spec, example);
    const detail = [
      category ? `category: ${category.label}` : "",
      `why plotted: ${example.plotReason}`,
      example.provenance,
      example.source,
      example.note,
    ]
      .filter(Boolean)
      .join(" · ");
    return {
      example,
      labelLines: wrap(example.label, 54),
      detailLines: wrap(detail, 62),
    };
  });
  const legendHeight = legendRows.reduce(
    (sum, row) =>
      sum +
      Math.max(
        52,
        row.labelLines.length * 24 + row.detailLines.length * 22 + 12,
      ),
    0,
  );
  const calibrationRows = [
    ["Axis claim type", spec.calibration.axisClaimType],
    ["Second-axis confidence", spec.calibration.secondAxisConfidence],
    ["Orthogonality", spec.calibration.orthogonality],
  ].map(([label, value]) => ({ label, lines: wrap(value, 60) }));
  const calibrationHeight = calibrationRows.reduce(
    (sum, row) => sum + Math.max(29, row.lines.length * 24),
    0,
  );
  const calibrationY = plotY + plotSize + 95;
  const examplesY = calibrationY + 45 + calibrationHeight + 35;
  const height = examplesY + 45 + legendHeight + 60;
  const qPositions = {
    tl: [plotX + half / 2, plotY + 40],
    tr: [plotX + half + half / 2, plotY + 40],
    bl: [plotX + half / 2, plotY + half + 40],
    br: [plotX + half + half / 2, plotY + half + 40],
  };
  const qColors = {
    tl: "#fff",
    tr: "#fff",
    bl: "#fff",
    br: "#fff",
  };

  const parts = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="frame-title frame-desc">`,
    `<title id="frame-title">${escapeXml(spec.title)}</title>`,
    `<desc id="frame-desc">${escapeXml(spec.description || `A two-by-two frame plotting ${spec.examples.length} examples.`)}</desc>`,
    `<defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto-start-reverse"><path d="M 0 0 L 8 4 L 0 8 z" fill="#111"/></marker></defs>`,
    `<style>
      .title{font:700 30px "Source Serif 4",Georgia,serif;fill:#111}
      .description{font:22px "Source Serif 4",Georgia,serif;fill:#333}
      .axis{font:700 19px "Source Serif 4",Georgia,serif;fill:#111}
      .quadrant{font:700 22px "Source Serif 4",Georgia,serif;fill:#111}
      .quadrant-detail{font:19px "Source Serif 4",Georgia,serif;fill:#333}
      .empty{font:italic 18px "Source Serif 4",Georgia,serif;fill:#555}
      .point-number{font:700 14px "Source Serif 4",Georgia,serif}
      .legend-label{font:700 20px "Source Serif 4",Georgia,serif;fill:#111}
      .legend-detail{font:18px "Source Serif 4",Georgia,serif;fill:#444}
      .calibration{font:19px "Source Serif 4",Georgia,serif;fill:#222}
    </style>`,
  ];
  parts.push(`<rect width="${width}" height="${height}" fill="#fff"/>`);

  const titleLines = wrap(spec.title, 44).slice(0, 2);
  parts.push(
    svgTextLines(titleLines, 70, 55, {
      className: "title",
      lineHeight: 35,
    }),
  );
  if (spec.description) {
    parts.push(
      svgTextLines(
        wrap(spec.description, 61),
        70,
        70 + titleLines.length * 35,
        { className: "description", lineHeight: 29, maxLines: 2 },
      ),
    );
  }

  for (const key of QUADRANTS) {
    const isRight = key.endsWith("r");
    const isBottom = key.startsWith("b");
    const x = plotX + (isRight ? half : 0);
    const y = plotY + (isBottom ? half : 0);
    parts.push(`<rect x="${x}" y="${y}" width="${half}" height="${half}" fill="${qColors[key]}"/>`);
  }
  parts.push(`<rect x="${plotX}" y="${plotY}" width="${plotSize}" height="${plotSize}" fill="none" stroke="#111" stroke-width="2"/>`);
  parts.push(`<line x1="${plotX + half}" y1="${plotY}" x2="${plotX + half}" y2="${plotY + plotSize}" stroke="#111" stroke-width="1.5" stroke-dasharray="7 7"/>`);
  parts.push(`<line x1="${plotX}" y1="${plotY + half}" x2="${plotX + plotSize}" y2="${plotY + half}" stroke="#111" stroke-width="1.5" stroke-dasharray="7 7"/>`);

  for (const key of QUADRANTS) {
    const [x, y] = qPositions[key];
    const quadrant = spec.quadrants[key];
    parts.push(`<text class="quadrant" x="${x}" y="${y}" text-anchor="middle">${escapeXml(quadrant.name)}</text>`);
    if (quadrant.description) {
      parts.push(svgTextLines(wrap(quadrant.description, 30), x, y + 28, {
        className: "quadrant-detail",
        lineHeight: 23,
        anchor: "middle",
        maxLines: 3,
      }));
    }
    const members = spec.examples.filter((example) => quadrantFor(example) === key);
    if (!members.length || quadrant.status) {
      const statusY =
        plotY + (key.startsWith("b") ? plotSize : half) - 20;
      parts.push(`<text class="empty" x="${x}" y="${statusY}" text-anchor="middle">[${escapeXml(quadrant.status || "empty")}]</text>`);
    }
  }

  const centerX = plotX + half;
  const centerY = plotY + half;
  parts.push(`<line x1="${plotX - 30}" y1="${centerY}" x2="${plotX + plotSize + 30}" y2="${centerY}" stroke="#111" stroke-width="1.5" marker-start="url(#arrow)" marker-end="url(#arrow)"/>`);
  parts.push(`<line x1="${centerX}" y1="${plotY + plotSize + 35}" x2="${centerX}" y2="${plotY - 35}" stroke="#111" stroke-width="1.5" marker-start="url(#arrow)" marker-end="url(#arrow)"/>`);
  const xNegativeLines = wrap(`${spec.axes.x.name}: ${spec.axes.x.negative}`, 28);
  const xPositiveLines = wrap(`${spec.axes.x.name}: ${spec.axes.x.positive}`, 28);
  parts.push(svgTextLines(xNegativeLines, plotX + 12, centerY - 12 - (xNegativeLines.length - 1) * 17, {
    className: "axis",
    lineHeight: 17,
    anchor: "start",
    maxLines: 2,
  }));
  parts.push(svgTextLines(xPositiveLines, plotX + plotSize - 12, centerY - 12 - (xPositiveLines.length - 1) * 17, {
    className: "axis",
    lineHeight: 17,
    anchor: "end",
    maxLines: 2,
  }));
  parts.push(`<text class="axis" x="${centerX}" y="${plotY - 50}" text-anchor="middle">${escapeXml(`${spec.axes.y.name}: ${spec.axes.y.positive}`)}</text>`);
  parts.push(`<text class="axis" x="${centerX}" y="${plotY + plotSize + 58}" text-anchor="middle">${escapeXml(`${spec.axes.y.name}: ${spec.axes.y.negative}`)}</text>`);

  for (const example of spec.examples) {
    const cx = plotX + example.x * plotSize;
    const cy = plotY + (1 - example.y) * plotSize;
    const category = categoryFor(spec, example);
    const fill = category ? category.color : "#111";
    const textColor = category ? category.textColor : "#fff";
    const categoryDescription = category ? `, category ${category.label}` : "";
    parts.push(`<g aria-label="${escapeXml(`${example.number}. ${example.label}${categoryDescription}, featured because ${example.plotReason}, x ${example.x.toFixed(2)}, y ${example.y.toFixed(2)}`)}">`);
    parts.push(`<circle cx="${cx}" cy="${cy}" r="11" fill="${fill}" stroke="#111" stroke-width="1.5"/>`);
    parts.push(`<text class="point-number" x="${cx}" y="${cy + 4}" text-anchor="middle" fill="${textColor}">${example.number}</text></g>`);
  }

  parts.push(`<text class="quadrant" x="${plotX}" y="${calibrationY}">Calibration</text>`);
  let calibrationRowY = calibrationY + 34;
  for (const row of calibrationRows) {
    parts.push(`<text class="calibration" x="${plotX}" y="${calibrationRowY}"><tspan font-weight="650">${escapeXml(row.label)}:</tspan> ${escapeXml(row.lines[0])}</text>`);
    for (let index = 1; index < row.lines.length; index += 1) {
      parts.push(`<text class="calibration" x="${plotX + 18}" y="${calibrationRowY + index * 24}">${escapeXml(row.lines[index])}</text>`);
    }
    calibrationRowY += Math.max(29, row.lines.length * 24);
  }

  parts.push(`<text class="quadrant" x="${plotX}" y="${examplesY}">Examples</text>`);
  let legendY = examplesY + 38;
  if (!legendRows.length) {
    parts.push(`<text class="empty" x="${plotX}" y="${legendY}">[none]</text>`);
  }
  for (const row of legendRows) {
    const { example, labelLines, detailLines } = row;
    const category = categoryFor(spec, example);
    const fill = category ? category.color : "#111";
    const textColor = category ? category.textColor : "#fff";
    parts.push(`<circle cx="${plotX + 13}" cy="${legendY - 5}" r="13" fill="${fill}" stroke="#111" stroke-width="1.5"/>`);
    parts.push(`<text class="point-number" x="${plotX + 13}" y="${legendY - 1}" text-anchor="middle" fill="${textColor}">${example.number}</text>`);
    parts.push(svgTextLines(labelLines, plotX + 42, legendY, { className: "legend-label", lineHeight: 24 }));
    const detailY = legendY + labelLines.length * 24 + 2;
    if (detailLines.length) {
      parts.push(svgTextLines(detailLines, plotX + 42, detailY, { className: "legend-detail", lineHeight: 22 }));
    }
    legendY += Math.max(
      52,
      labelLines.length * 24 + detailLines.length * 22 + 12,
    );
  }
  parts.push("</svg>");
  return parts.join("\n") + "\n";
}

function main() {
  try {
    const args = parseArgs(process.argv.slice(2));
    if (args.help) {
      process.stdout.write(usage() + "\n");
      return;
    }
    const raw = JSON.parse(fs.readFileSync(args.input, "utf8"));
    const spec = validateSpec(raw);
    const outputDirectory = path.dirname(args.outputPrefix);
    fs.mkdirSync(outputDirectory, { recursive: true });
    const asciiPath = `${args.outputPrefix}.txt`;
    const svgPath = `${args.outputPrefix}.svg`;
    fs.writeFileSync(asciiPath, renderAscii(spec, args.cellWidth));
    fs.writeFileSync(svgPath, renderSvg(spec));
    process.stdout.write(`${asciiPath}\n${svgPath}\n`);
  } catch (error) {
    process.stderr.write(`render-frame: ${error.message}\n`);
    process.exitCode = 1;
  }
}

if (require.main === module) main();

module.exports = {
  categoryFor,
  contrastTextColor,
  quadrantFor,
  renderAscii,
  renderSvg,
  validateSpec,
};
