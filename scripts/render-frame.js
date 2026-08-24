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

Render one Frame Projector spec as plain ASCII, interactive HTML, and SVG.

Options:
  --out <prefix>       Output path without an extension (default: input path)
  --cell-width <n>     ASCII cell width, 24-72 (default: ${DEFAULT_CELL_WIDTH})
  --help               Show this help

The command writes <prefix>.txt, <prefix>.html, and <prefix>.svg.`;
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

function renderHtml(spec) {
  const categories = Object.entries(spec.categories);
  const quadrantNames = QUADRANTS.map(
    (key) => `${spec.quadrants[key].name}: ${spec.quadrants[key].description}`,
  ).join("; ");

  const categoryFilters = categories
    .map(([key, category]) => {
      const count = spec.examples.filter(
        (example) => example.category === key,
      ).length;
      return `<button class="filter" type="button" data-filter="${escapeXml(key)}" aria-pressed="false"><span class="filter-dot" style="--swatch:${category.color}"></span>${escapeXml(category.label)} <span class="filter-count">${count}</span></button>`;
    })
    .join("\n");

  const regions = QUADRANTS.map((key) => {
    const quadrant = spec.quadrants[key];
    const members = spec.examples.filter(
      (example) => quadrantFor(example) === key,
    );
    const status =
      !members.length || quadrant.status
        ? `<span class="region-status">${escapeXml(quadrant.status || "empty")}</span>`
        : "";
    return `<section class="region region-${key}" aria-label="${escapeXml(quadrant.name)}">
      <div class="tooltip-host region-tooltip-host" data-tooltip-host>
        <button class="region-trigger" type="button" data-tooltip-trigger aria-describedby="region-tip-${key}" aria-expanded="false">
          <span>${escapeXml(quadrant.name)}</span><span class="region-count">${members.length}</span>${status}
        </button>
        <aside class="tooltip region-tip" id="region-tip-${key}" role="tooltip" data-tooltip>
          <p class="tooltip-kicker">${key.toUpperCase()} · ${members.length} featured</p>
          <h3>${escapeXml(quadrant.name)}</h3>
          ${quadrant.description ? `<p>${escapeXml(quadrant.description)}</p>` : ""}
        </aside>
      </div>
    </section>`;
  }).join("\n");

  const regionNotes = QUADRANTS.map((key) => {
    const quadrant = spec.quadrants[key];
    const members = spec.examples.filter(
      (example) => quadrantFor(example) === key,
    );
    return `<article class="region-note">
      <p class="region-code">${key.toUpperCase()} · ${members.length} featured</p>
      <h3>${escapeXml(quadrant.name)}</h3>
      ${quadrant.description ? `<p>${escapeXml(quadrant.description)}</p>` : ""}
    </article>`;
  }).join("\n");

  const quadrantCards = QUADRANTS.map((key) => {
    const quadrant = spec.quadrants[key];
    const members = spec.examples.filter(
      (example) => quadrantFor(example) === key,
    );
    const examples = members
      .map((example) => {
        const category = categoryFor(spec, example);
        const fill = category ? category.color : "#111111";
        const ink = category ? category.textColor : "#ffffff";
        const metadata = [
          category?.label,
          example.provenance,
          example.source,
        ].filter(Boolean).map(escapeXml).join(" · ");
        return `<li class="dialog-example">
          <div class="dialog-example-title">
            <span class="example-number" style="--point:${fill};--point-ink:${ink}">${example.number}</span>
            <strong>${escapeXml(example.label)}</strong>
          </div>
          <p>${escapeXml(example.plotReason)}</p>
          <p class="dialog-example-meta">${metadata}</p>
          ${example.note ? `<p class="dialog-example-note">${escapeXml(example.note)}</p>` : ""}
        </li>`;
      })
      .join("\n");
    const status = quadrant.status
      ? ` <span class="dialog-region-status">${escapeXml(quadrant.status)}</span>`
      : "";
    return `<article class="quadrant-card quadrant-card-${key}">
      <p class="region-code">${key.toUpperCase()} · ${members.length} featured${status}</p>
      <h3>${escapeXml(quadrant.name)}</h3>
      ${quadrant.description ? `<p class="quadrant-description">${escapeXml(quadrant.description)}</p>` : ""}
      ${examples ? `<ol class="dialog-examples">${examples}</ol>` : `<p class="dialog-empty">No featured examples.</p>`}
    </article>`;
  }).join("\n");

  const quadrantDialog = `<dialog class="quadrant-dialog" data-quadrant-dialog aria-labelledby="quadrant-dialog-title">
    <div class="dialog-shell">
      <header class="dialog-header">
        <div>
          <p class="tooltip-kicker">Quadrant reader</p>
          <h2 id="quadrant-dialog-title">Names, descriptions, and examples</h2>
        </div>
        <button class="dialog-close" type="button" data-dialog-close aria-label="Close quadrant reader">×</button>
      </header>
      <div class="quadrant-grid">${quadrantCards}</div>
    </div>
  </dialog>`;

  const points = spec.examples
    .map((example) => {
      const category = categoryFor(spec, example);
      const fill = category ? category.color : "#111111";
      const ink = category ? category.textColor : "#ffffff";
      const categoryLabel = category ? `, category ${category.label}` : "";
      const horizontal = example.x < 0.5 ? "tip-right" : "tip-left";
      const vertical = example.y > 0.5 ? "tip-down" : "tip-up";
      return `<div
        class="point-cluster tooltip-host"
        data-tooltip-host
        data-category="${escapeXml(example.category)}"
        style="left:${(example.x * 100).toFixed(2)}%;top:${((1 - example.y) * 100).toFixed(2)}%;--point:${fill};--point-ink:${ink}"
      >
        <button
          class="point"
          type="button"
          data-select="${example.number}"
          data-tooltip-trigger
          aria-describedby="example-tip-${example.number}"
          aria-expanded="false"
          aria-label="${escapeXml(`${example.number}. ${example.label}${categoryLabel}; ${example.plotReason}; x ${example.x.toFixed(2)}, y ${example.y.toFixed(2)}`)}"
        >${example.number}</button>
        <aside class="tooltip point-tip ${horizontal} ${vertical}" id="example-tip-${example.number}" role="tooltip" data-tooltip>
          <div class="tooltip-title-row">
            <span class="example-number" style="--point:${fill};--point-ink:${ink}">${example.number}</span>
            <div><p class="tooltip-kicker">Featured example</p><h3>${escapeXml(example.label)}</h3></div>
          </div>
          <dl class="tooltip-details">
            <div><dt>Why plotted</dt><dd>${escapeXml(example.plotReason)}</dd></div>
            ${category ? `<div><dt>Category</dt><dd>${escapeXml(category.label)}</dd></div>` : ""}
            <div><dt>Position</dt><dd>${example.x.toFixed(2)}, ${example.y.toFixed(2)}</dd></div>
            <div><dt>Claim kind</dt><dd>${escapeXml(example.provenance)}</dd></div>
            <div><dt>Source</dt><dd>${escapeXml(example.source)}</dd></div>
            ${example.note ? `<div><dt>Qualification</dt><dd>${escapeXml(example.note)}</dd></div>` : ""}
          </dl>
        </aside>
      </div>`;
    })
    .join("\n");

  const calibrationTip = `<div class="tooltip-host calibration-host" data-tooltip-host>
    <button class="calibration-trigger" type="button" data-calibration-trigger data-tooltip-trigger aria-describedby="calibration-tip" aria-expanded="false">Calibration <span aria-hidden="true">↗</span></button>
    <aside class="tooltip calibration-tip" id="calibration-tip" role="tooltip" data-tooltip>
      <p class="tooltip-kicker">What the axes claim</p>
      <h3>Calibration</h3>
      <dl class="tooltip-details">
        <div><dt>Axis claim type</dt><dd>${escapeXml(spec.calibration.axisClaimType)}</dd></div>
        <div><dt>Second axis</dt><dd>${escapeXml(spec.calibration.secondAxisConfidence)}</dd></div>
        <div><dt>Orthogonality</dt><dd>${escapeXml(spec.calibration.orthogonality)}</dd></div>
      </dl>
    </aside>
  </div>`;

  const printExamples = spec.examples
    .map((example) => {
      const category = categoryFor(spec, example);
      return `<li><strong>${example.number}. ${escapeXml(example.label)}</strong> — ${escapeXml(example.plotReason)}; ${category ? `${escapeXml(category.label)}; ` : ""}${escapeXml(example.provenance)}; ${escapeXml(example.source)}; position ${example.x.toFixed(2)}, ${example.y.toFixed(2)}${example.note ? `; ${escapeXml(example.note)}` : ""}</li>`;
    })
    .join("\n");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; img-src data:; font-src data:; connect-src 'none'; media-src data:; frame-src 'none'; base-uri 'none'; form-action 'none'">
  <title>${escapeXml(spec.title)}</title>
  <style>
    :root {
      color-scheme: light;
      --paper: #fbfaf7;
      --ink: #151515;
      --muted: #68645d;
      --rule: #c9c4b9;
      --soft-rule: #e4dfd5;
      --panel: #ffffff;
      --serif: "Source Serif 4", "Iowan Old Style", "Palatino Linotype", Georgia, serif;
      --sans: "Alegreya Sans", "Gill Sans", "Trebuchet MS", sans-serif;
      font-family: var(--serif);
      color: var(--ink);
      background: var(--paper);
    }
    * { box-sizing: border-box; }
    [hidden] { display: none !important; }
    body {
      margin: 0;
      min-width: 280px;
      background:
        linear-gradient(rgba(21,21,21,.022) 1px, transparent 1px),
        var(--paper);
      background-size: 100% 30px;
    }
    button { font: inherit; }
    .frame-page { width: min(900px, 100%); margin: 0 auto; padding: clamp(18px, 4vw, 42px); }
    .frame-header { max-width: 760px; border-top: 5px solid var(--ink); padding-top: 13px; }
    .kicker, .tooltip-kicker, .region-code {
      margin: 0 0 8px;
      font: 700 11px/1.2 var(--sans);
      letter-spacing: .16em;
      text-transform: uppercase;
      color: var(--muted);
    }
    h1 { margin: 0; font-size: clamp(30px, 5vw, 48px); line-height: 1; letter-spacing: -.03em; text-wrap: balance; }
    .lede { margin: 13px 0 0; max-width: 720px; font-size: clamp(16px, 2vw, 20px); line-height: 1.32; color: #38352f; }
    .controls {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
      margin: 22px 0 10px;
      padding: 9px 0;
      border-block: 1px solid var(--rule);
      font-family: var(--sans);
    }
    .control-label { margin-right: 4px; font-size: 12px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; }
    .filter, .calibration-trigger, .quadrants-trigger {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      min-height: 31px;
      border: 1px solid var(--rule);
      border-radius: 999px;
      padding: 4px 10px;
      background: transparent;
      color: var(--ink);
      cursor: pointer;
      font-size: 13px;
    }
    .filter:hover, .filter:focus-visible, .calibration-trigger:hover, .calibration-trigger:focus-visible, .quadrants-trigger:hover, .quadrants-trigger:focus-visible { border-color: var(--ink); outline: none; }
    .filter[aria-pressed="true"] { background: var(--ink); border-color: var(--ink); color: var(--paper); }
    .filter-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--swatch); border: 1px solid currentColor; }
    .filter-count { opacity: .64; font-variant-numeric: tabular-nums; }
    .readout-controls { display: flex; flex-wrap: wrap; gap: 8px; margin-left: auto; }
    .calibration-trigger, .quadrants-trigger { font-weight: 700; }
    .hint { width: 100%; margin: 1px 0 0; font: 12px/1.25 var(--sans); color: var(--muted); }
    .plot-wrap { position: relative; margin: 48px 18px 54px; }
    .plot-surface {
      position: relative;
      z-index: 6;
      width: 100%;
      aspect-ratio: 1;
      border: 2px solid var(--ink);
      background: rgba(255,255,255,.74);
      isolation: isolate;
    }
    .axis-line { position: absolute; z-index: 1; pointer-events: none; background: var(--ink); }
    .axis-line-x { left: -16px; right: -16px; top: 50%; height: 1px; }
    .axis-line-y { top: -16px; bottom: -16px; left: 50%; width: 1px; }
    .axis-line-x::before, .axis-line-x::after, .axis-line-y::before, .axis-line-y::after { content: ""; position: absolute; width: 0; height: 0; }
    .axis-line-x::before { left: -1px; top: -5px; border-block: 5px solid transparent; border-right: 9px solid var(--ink); }
    .axis-line-x::after { right: -1px; top: -5px; border-block: 5px solid transparent; border-left: 9px solid var(--ink); }
    .axis-line-y::before { top: -1px; left: -5px; border-inline: 5px solid transparent; border-bottom: 9px solid var(--ink); }
    .axis-line-y::after { bottom: -1px; left: -5px; border-inline: 5px solid transparent; border-top: 9px solid var(--ink); }
    .axis-label {
      position: absolute;
      z-index: 5;
      max-width: 46%;
      padding: 3px 7px;
      background: var(--paper);
      font-weight: 700;
      font-size: clamp(13px, 2vw, 17px);
      line-height: 1.1;
    }
    .axis-y-positive { left: 50%; top: -44px; transform: translateX(-50%); text-align: center; }
    .axis-y-negative { left: 50%; bottom: -48px; transform: translateX(-50%); text-align: center; }
    .axis-x-negative { right: 50%; top: 50%; transform: translate(-12px, -50%); text-align: right; }
    .axis-x-positive { left: 50%; top: 50%; transform: translate(12px, -50%); }
    .region {
      position: absolute;
      z-index: 4;
      width: calc(50% - 20px);
      padding: 10px 12px;
    }
    .region:hover, .region:focus-within, .region:has(.region-tooltip-host.is-open) { z-index: 70; }
    .region-tl, .region-tr { top: 0; }
    .region-bl, .region-br { top: 50%; }
    .region-tl, .region-bl { left: 0; }
    .region-tr, .region-br { right: 0; text-align: right; }
    .region-tr .region-tooltip-host, .region-br .region-tooltip-host { display: flex; justify-content: flex-end; }
    .region-trigger { display: inline-flex; align-items: baseline; gap: 6px; padding: 2px 3px; border: 0; border-bottom: 1px dotted var(--muted); background: var(--paper); color: var(--ink); cursor: help; font: 700 clamp(16px, 2.3vw, 22px)/1 var(--serif); }
    .region-trigger:hover, .region-trigger:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
    .region-count { font: 700 10px/1 var(--sans); color: var(--muted); }
    .region-status { font: italic 13px var(--serif); color: var(--muted); }
    .point-cluster { position: absolute; z-index: auto; }
    .point {
      position: relative;
      z-index: 2;
      display: grid;
      place-items: center;
      width: clamp(27px, 4.2vw, 36px);
      aspect-ratio: 1;
      transform: translate(-50%, -50%);
      border: 2px solid var(--paper);
      border-radius: 50%;
      background: var(--point);
      color: var(--point-ink);
      box-shadow: 0 0 0 1px var(--ink);
      cursor: pointer;
      font: 700 14px/1 var(--sans);
      font-variant-numeric: tabular-nums;
      transition: transform 140ms ease, box-shadow 140ms ease;
    }
    .point:hover, .point:focus-visible, .point-cluster.is-open .point { z-index: 10; transform: translate(-50%, -50%) scale(1.16); outline: none; box-shadow: 0 0 0 2px var(--paper), 0 0 0 4px var(--ink); }
    .tooltip-host { position: relative; }
    .point-cluster.tooltip-host { position: absolute; }
    .tooltip {
      position: absolute;
      z-index: 60;
      width: min(310px, calc(100vw - 44px));
      padding: 15px;
      border: 2px solid var(--ink);
      background: var(--panel);
      color: var(--ink);
      box-shadow: 7px 7px 0 rgba(21,21,21,.18);
      text-align: left;
      opacity: 0;
      visibility: hidden;
      transform: translateY(5px);
      transition: opacity 100ms ease, transform 100ms ease, visibility 100ms;
      pointer-events: none;
    }
    .tooltip-host:hover > .tooltip, .tooltip-host:focus-within > .tooltip, .tooltip-host.is-open > .tooltip { opacity: 1; visibility: visible; transform: translateY(0); pointer-events: auto; }
    .tooltip h3 { margin: 0; font-size: 21px; line-height: 1.06; }
    .tooltip > p:not(.tooltip-kicker) { margin: 7px 0 0; font-size: 16px; line-height: 1.35; }
    .tooltip-title-row { display: flex; gap: 10px; align-items: flex-start; }
    .tooltip-title-row .tooltip-kicker { margin-bottom: 4px; }
    .example-number { flex: 0 0 auto; display: inline-grid; place-items: center; width: 29px; height: 29px; border-radius: 50%; background: var(--point); color: var(--point-ink); border: 1px solid var(--ink); font: 700 12px var(--sans); }
    .tooltip-details { margin: 13px 0 0; }
    .tooltip-details div { display: grid; grid-template-columns: 110px minmax(0, 1fr); gap: 9px; align-items: baseline; padding: 6px 0; border-top: 1px solid var(--soft-rule); }
    .tooltip-details dt { min-width: 0; overflow-wrap: anywhere; font: 700 10px/1.3 var(--sans); letter-spacing: .06em; text-transform: uppercase; color: var(--muted); }
    .tooltip-details dd { min-width: 0; margin: 0; overflow-wrap: anywhere; font-size: 14px; line-height: 1.28; }
    .point-tip.tip-right { left: 20px; }
    .point-tip.tip-left { right: 20px; }
    .point-tip.tip-down { top: 16px; }
    .point-tip.tip-up { bottom: 16px; }
    .region-tip { top: 34px; }
    .region-tr .region-tip, .region-br .region-tip { right: 0; }
    .region-bl .region-tip, .region-br .region-tip { top: auto; bottom: 34px; }
    .calibration-tip { top: 39px; right: 0; }
    .quadrant-dialog {
      width: min(820px, calc(100vw - 32px));
      max-width: none;
      max-height: min(88vh, 920px);
      margin: auto;
      padding: 0;
      border: 2px solid var(--ink);
      background: var(--panel);
      color: var(--ink);
      box-shadow: 10px 10px 0 rgba(21,21,21,.2);
    }
    .quadrant-dialog::backdrop { background: rgba(21,21,21,.54); }
    body:has(.quadrant-dialog[open]) { overflow: hidden; }
    .dialog-shell { min-height: 0; }
    .dialog-header {
      position: sticky;
      z-index: 2;
      top: 0;
      display: flex;
      justify-content: space-between;
      gap: 20px;
      align-items: flex-start;
      padding: 20px 22px 16px;
      border-bottom: 2px solid var(--ink);
      background: var(--panel);
    }
    .dialog-header h2 { max-width: 650px; margin: 0; font-size: clamp(25px, 4vw, 38px); line-height: 1; letter-spacing: -.025em; text-wrap: balance; }
    .dialog-close { flex: 0 0 auto; width: 36px; height: 36px; border: 1px solid var(--ink); border-radius: 50%; background: transparent; color: var(--ink); cursor: pointer; font: 30px/28px var(--sans); }
    .dialog-close:hover, .dialog-close:focus-visible { background: var(--ink); color: var(--panel); outline: none; }
    .quadrant-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .quadrant-card { min-width: 0; padding: 20px 22px 23px; border-bottom: 1px solid var(--rule); }
    .quadrant-card:nth-child(odd) { border-right: 1px solid var(--rule); }
    .quadrant-card h3 { margin: 0; font-size: 25px; line-height: 1.05; }
    .quadrant-description { min-height: 2.6em; margin: 7px 0 0; color: #38352f; font-size: 16px; line-height: 1.3; }
    .dialog-region-status { margin-left: 5px; font-style: italic; letter-spacing: 0; text-transform: none; }
    .dialog-examples { display: grid; gap: 0; margin: 17px 0 0; padding: 0; list-style: none; border-top: 1px solid var(--ink); }
    .dialog-example { min-width: 0; padding: 12px 0; border-bottom: 1px solid var(--soft-rule); }
    .dialog-example-title { display: flex; gap: 9px; align-items: center; font-size: 17px; line-height: 1.12; }
    .dialog-example-title .example-number { width: 25px; height: 25px; }
    .dialog-example p { margin: 5px 0 0 34px; font-size: 14px; line-height: 1.28; }
    .dialog-example-meta { color: var(--muted); font: 700 10px/1.3 var(--sans) !important; letter-spacing: .06em; text-transform: uppercase; }
    .dialog-example-note { color: #38352f; font-style: italic; }
    .dialog-empty { margin: 17px 0 0; padding-top: 12px; border-top: 1px solid var(--ink); color: var(--muted); font-style: italic; }
    .print-ledger { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
    @media (max-width: 680px) {
      .frame-page { padding-inline: 16px; }
      .region { padding: 8px; width: calc(50% - 8px); }
      .axis-label { font-size: 12px; }
      .region-trigger { font-size: 16px; }
      .readout-controls { width: 100%; margin-left: 0; }
      .hint { font-size: 11px; }
      .tooltip { position: fixed; left: 12px !important; right: 12px !important; top: auto !important; bottom: 12px !important; width: auto; max-height: min(68vh, 430px); overflow: auto; }
      body.has-open-tooltip .axis-y-negative { visibility: hidden; }
      .quadrant-dialog { width: calc(100vw - 24px); max-height: calc(100vh - 24px); }
      .dialog-header { padding: 16px; }
      .quadrant-grid { grid-template-columns: 1fr; }
      .quadrant-card { padding: 17px 16px 20px; border-right: 0 !important; }
      .quadrant-description { min-height: 0; }
    }
    @media print {
      body { background: #fff; }
      .frame-page { max-width: none; padding: 16mm; }
      .controls, .tooltip, .quadrant-dialog { display: none !important; }
      .plot-wrap { max-width: 170mm; margin-inline: auto; }
      .point { transition: none; }
      .print-ledger { position: static; width: auto; height: auto; margin: 12mm 0 0; overflow: visible; clip: auto; white-space: normal; }
      .print-ledger h2 { font-size: 22px; margin: 8mm 0 3mm; }
      .print-ledger h3 { font-size: 16px; margin: 4mm 0 1mm; }
      .print-ledger p, .print-ledger li, .print-ledger dd { font-size: 12px; line-height: 1.35; }
    }
  </style>
</head>
<body>
  <main class="frame-page">
    <header class="frame-header">
      <p class="kicker">Frame Projector · ${escapeXml(spec.calibration.axisClaimType)}</p>
      <h1>${escapeXml(spec.title)}</h1>
      ${spec.description ? `<p class="lede">${escapeXml(spec.description)}</p>` : ""}
    </header>

    <nav class="controls" aria-label="Frame display controls">
      <span class="control-label">Show</span>
      <button class="filter" type="button" data-filter="all" aria-pressed="true">All <span class="filter-count">${spec.examples.length}</span></button>
      ${categoryFilters}
      <div class="readout-controls">
        <button class="quadrants-trigger" type="button" data-quadrants-trigger aria-haspopup="dialog">Read quadrants <span aria-hidden="true">↗</span></button>
        ${calibrationTip}
      </div>
      <p class="hint">Hover, focus, or tap a quadrant name or numbered point for its full detail.</p>
    </nav>

    <section aria-label="Interactive two-by-two frame">
      <div class="plot-wrap">
        <div class="axis-label axis-y-positive">${escapeXml(`${spec.axes.y.name}: ${spec.axes.y.positive}`)}</div>
        <div class="axis-label axis-y-negative">${escapeXml(`${spec.axes.y.name}: ${spec.axes.y.negative}`)}</div>
        <div class="plot-surface" aria-label="Two-by-two frame. ${escapeXml(quadrantNames)}">
          <span class="axis-line axis-line-x"></span>
          <span class="axis-line axis-line-y"></span>
          <div class="axis-label axis-x-negative">${escapeXml(`${spec.axes.x.name}: ${spec.axes.x.negative}`)}</div>
          <div class="axis-label axis-x-positive">${escapeXml(`${spec.axes.x.name}: ${spec.axes.x.positive}`)}</div>
          ${regions}
          ${points}
        </div>
      </div>
    </section>

    <section class="print-ledger" aria-hidden="true">
      <h2>Region key</h2>
      ${regionNotes}
      <h2>Featured examples</h2>
      <ol>${printExamples || "<li>None</li>"}</ol>
      <h2>Calibration</h2>
      <dl><dt>Axis claim type</dt><dd>${escapeXml(spec.calibration.axisClaimType)}</dd><dt>Second-axis confidence</dt><dd>${escapeXml(spec.calibration.secondAxisConfidence)}</dd><dt>Orthogonality</dt><dd>${escapeXml(spec.calibration.orthogonality)}</dd></dl>
    </section>
  </main>
  ${quadrantDialog}
  <script>
    (() => {
      const all = (selector) => Array.from(document.querySelectorAll(selector));
      const hosts = all('[data-tooltip-host]');
      const pointClusters = all('.point-cluster');
      const quadrantDialog = document.querySelector('[data-quadrant-dialog]');
      const quadrantTrigger = document.querySelector('[data-quadrants-trigger]');

      function closeTips(except) {
        hosts.forEach((host) => {
          if (host === except) return;
          host.classList.remove('is-open');
          const trigger = host.querySelector('[data-tooltip-trigger]');
          if (trigger) trigger.setAttribute('aria-expanded', 'false');
        });
        document.body.classList.toggle('has-open-tooltip', Boolean(except));
      }

      all('[data-tooltip-trigger]').forEach((trigger) => {
        trigger.addEventListener('click', (event) => {
          event.stopPropagation();
          const host = trigger.closest('[data-tooltip-host]');
          const opening = !host.classList.contains('is-open');
          closeTips(opening ? host : null);
          host.classList.toggle('is-open', opening);
          trigger.setAttribute('aria-expanded', String(opening));
        });
        trigger.addEventListener('keydown', (event) => {
          if (event.key !== 'Escape') return;
          closeTips();
          trigger.blur();
        });
      });

      all('[data-tooltip]').forEach((tip) => tip.addEventListener('click', (event) => event.stopPropagation()));
      document.addEventListener('click', () => closeTips());

      quadrantTrigger.addEventListener('click', () => {
        closeTips();
        quadrantDialog.showModal();
      });
      quadrantDialog.querySelector('[data-dialog-close]').addEventListener('click', () => quadrantDialog.close());
      quadrantDialog.addEventListener('click', (event) => {
        if (event.target !== quadrantDialog) return;
        const bounds = quadrantDialog.getBoundingClientRect();
        const inside = event.clientX >= bounds.left && event.clientX <= bounds.right && event.clientY >= bounds.top && event.clientY <= bounds.bottom;
        if (!inside) quadrantDialog.close();
      });
      quadrantDialog.addEventListener('close', () => quadrantTrigger.focus());

      all('[data-filter]').forEach((button) => {
        button.addEventListener('click', () => {
          const filter = button.dataset.filter;
          all('[data-filter]').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
          pointClusters.forEach((item) => { item.hidden = filter !== 'all' && item.dataset.category !== filter; });
          closeTips();
        });
      });
    })();
  </script>
</body>
</html>\n`.replace(/[ \t]+$/gm, "");
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
    const htmlPath = `${args.outputPrefix}.html`;
    const svgPath = `${args.outputPrefix}.svg`;
    fs.writeFileSync(asciiPath, renderAscii(spec, args.cellWidth));
    fs.writeFileSync(htmlPath, renderHtml(spec));
    fs.writeFileSync(svgPath, renderSvg(spec));
    process.stdout.write(`${asciiPath}\n${htmlPath}\n${svgPath}\n`);
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
  renderHtml,
  renderSvg,
  validateSpec,
};
