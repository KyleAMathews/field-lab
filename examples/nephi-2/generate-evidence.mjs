import { spawn } from 'node:child_process'
import {
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = dirname(fileURLToPath(import.meta.url))
const image = process.env.FIELD_LAB_TLC_IMAGE ?? 'field-lab-tlc:local'
const cases = [
  {
    id: 'life',
    title: 'Toward life',
    goal: 'AvoidLife',
    expected: 'Life',
    verses: '19–21, 27–28',
  },
  {
    id: 'captivity',
    title: 'Toward captivity',
    goal: 'AvoidCaptivity',
    expected: 'Captivity',
    verses: '19–21, 27–29',
  },
  {
    id: 'repentance',
    title: 'A choice can be revised',
    goal: 'AvoidRepentance',
    expected: 'Life',
    verses: '21, 27–28',
    assumption: 'A3',
  },
  {
    id: 'collapse',
    title: 'Mistake: judgment means salvation',
    goal: 'LifeRequiresMediatorResponse',
    constant: 'CollapseJudgmentIntoLife',
  },
  {
    id: 'freeze',
    title: 'Mistake: captivity choice is irreversible',
    goal: 'ProbationOffersBothChoices',
    constant: 'FreezeCaptivityChoice',
    assumption: 'A3',
  },
]
function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: ['ignore', 'pipe', 'pipe'] })
    let output = ''
    child.stdout.on('data', (b) => (output += b))
    child.stderr.on('data', (b) => (output += b))
    child.on('error', reject)
    child.on('close', (code) => resolve({ code, output }))
  })
}
function parseTrace(output, { state, step }) {
  const matches = [...output.matchAll(/^State (\d+): <([^\n]+)>\s*$/gm)]
  return matches.map((m, i) => {
    const block = output.slice(
      m.index + m[0].length,
      matches[i + 1]?.index ?? output.length
    )
    const values = Object.fromEntries(
      [...block.matchAll(/^\/\\ (\w+) = (.+)$/gm)].map(([, k, v]) => [
        k,
        v === 'TRUE' ? true : v === 'FALSE' ? false : JSON.parse(v),
      ])
    )
    const action = i === 0 ? 'Init' : m[2].split(' ')[0]
    const label = state(values)
    return {
      index: i,
      action,
      actionLabel: i === 0 ? 'Initial condition' : step(action),
      label: Array.isArray(label) ? label.at(-1) : label,
      values,
    }
  })
}
function readBaseline(checked) {
  const read = (name) => readFileSync(join(checked, name), 'utf8')
  const report = read('report.md')
  const counts = report.match(
    /^TLC reached (\d+) states and (\d+) steps\. The chart draws (\d+) states and \d+ arrows\.$/m
  )
  const rules = report.match(/^## Rules that hold\n(\w+(?:, \w+)*)$/m)
  if (
    !counts ||
    !rules ||
    /^## (?:.* breaks|Rules not checked|TLC stopped)$/m.test(report)
  ) {
    throw new Error(
      `Expected a complete passing baseline with a full chart:\n${report}`
    )
  }
  return {
    modelStates: Number(counts[1]),
    modelSteps: Number(counts[2]),
    chartStates: Number(counts[3]),
    omittedSteps: Number(
      report.match(
        /^The chart does not draw (\d+) steps that stay in one chart state\.$/m
      )?.[1] ?? 0
    ),
    passingRules: rules[1].split(', '),
    chart: read('chart.mmd'),
    report,
    baselineOutput: read('tlc.out'),
  }
}

async function runProbe(probe, modelDir, base, view) {
  const cfg = probe.constant
    ? base.replace(`${probe.constant} = FALSE`, `${probe.constant} = TRUE`)
    : `${base}\nINVARIANT ${probe.goal}\n`
  if (cfg === base) throw new Error(`${probe.id}: could not enable the control`)
  const configName = `${probe.id}.cfg`
  writeFileSync(join(modelDir, configName), cfg)
  const result = await run('docker', [
    'run',
    '--rm',
    '--network',
    'none',
    '--read-only',
    '--tmpfs',
    '/tmp:rw,exec,mode=1777',
    '--user',
    `${process.getuid()}:${process.getgid()}`,
    '--volume',
    `${modelDir}:/work:ro`,
    image,
    '-workers',
    '1',
    '-metadir',
    '/tmp/tlc',
    '-config',
    configName,
    'Nephi2',
  ])
  if (
    result.code !== 12 ||
    !result.output.includes(`Invariant ${probe.goal} is violated`)
  ) {
    throw new Error(
      `${probe.id}: expected ${probe.goal}, exit 12; got ${result.code}\n${result.output}`
    )
  }
  const trace = parseTrace(result.output, view)
  if (!trace.length) throw new Error(`${probe.id}: no concrete trace`)
  if (probe.expected && trace.at(-1).values.stage !== probe.expected)
    throw new Error(`${probe.id}: wrong goal`)
  if (probe.id === 'repentance' && !trace.at(-1).values.choseCaptivity)
    throw new Error('Repentance witness never chose captivity')
  return {
    ...probe,
    kind: probe.constant ? 'negative-control' : 'reachability-witness',
    exitCode: result.code,
    trace,
    raw: result.output,
  }
}

const scratch = mkdtempSync(join(root, '.evidence-'))
try {
  const modelDir = join(scratch, 'model')
  mkdirSync(modelDir)
  for (const file of ['Nephi2.tla', 'Nephi2.cfg', 'Nephi2.view.mjs']) {
    copyFileSync(join(root, file), join(modelDir, file))
  }
  const viewFile = join(modelDir, 'Nephi2.view.mjs')
  const checked = join(scratch, 'checked')
  const baseline = await run(join(root, '../../scripts/statechart'), [
    join(modelDir, 'Nephi2.tla'),
    '--view',
    viewFile,
    '--out',
    checked,
  ])
  if (baseline.code !== 0)
    throw new Error(
      `Baseline failed (exit ${baseline.code}):\n${baseline.output}`
    )
  const evidence = { model: 'Nephi2.tla', ...readBaseline(checked), cases: [] }
  const base = readFileSync(join(modelDir, 'Nephi2.cfg'), 'utf8')
  const view = await import(pathToFileURL(viewFile))
  for (const probe of cases)
    evidence.cases.push(await runProbe(probe, modelDir, base, view))

  // The browser reads a single file, so it cannot mix runs during publication.
  const next = join(scratch, 'evidence.json')
  writeFileSync(next, JSON.stringify(evidence, null, 2) + '\n')
  renameSync(next, join(root, 'evidence.json'))
  console.log(
    `Saved the baseline and ${evidence.cases.length} probes to evidence.json`
  )
} finally {
  rmSync(scratch, { recursive: true, force: true })
}
