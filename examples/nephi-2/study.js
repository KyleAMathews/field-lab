import { mount } from 'pele'
import rough from 'roughjs'

const [argumentSource, evidence, interpretation] = await Promise.all([
  fetch('argument.mmd').then((r) => r.text()),
  fetch('evidence.json').then((r) => r.json()),
  fetch('interpretation.json').then((r) => r.json()),
])
const storySource = evidence.chart.replace(/^---[\s\S]*?---\n/, '')
const textUrl = (text) =>
  URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }))
const traces = new Map(evidence.cases.map((c) => [c.id, textUrl(c.raw)]))
const chartLink = document.querySelector('#generated-chart')
chartLink.href = textUrl(evidence.chart)
chartLink.download = 'chart.mmd'
const reportLink = document.querySelector('#checker-report')
reportLink.href = textUrl(evidence.report)
reportLink.download = 'report.md'
const decode = (s) =>
  s.replace(/#(\d+);/g, (_, c) => String.fromCodePoint(Number(c)))
const nodeIds = new Map(
  [...storySource.matchAll(/^\s+(s\d+): (.+)$/gm)].map(([, id, label]) => [
    decode(label),
    id,
  ])
)
const edgeIds = new Map()
let edgeIndex = 0
for (const [, from, to] of storySource.matchAll(
  /^\s*(\[\*\]|s\d+) --> (s\d+)(?::.*)?$/gm
))
  edgeIds.set(`${from}>${to}`, `edge${edgeIndex++}`)
const paths = evidence.cases
  .filter((c) => c.kind === 'reachability-witness')
  .map((c) => ({
    ...c,
    trace: c.trace.map((s) => ({ ...s, nodeId: nodeIds.get(s.label) })),
  }))
for (const p of paths)
  for (let i = 0; i < p.trace.length; i++) {
    if (!p.trace[i].nodeId)
      throw new Error(`No chart state for ${p.trace[i].label}`)
    if (i && !edgeIds.has(`${p.trace[i - 1].nodeId}>${p.trace[i].nodeId}`))
      throw new Error('A concrete trace transition is absent from the chart')
  }
document.querySelector(
  '#counts'
).textContent = `TLC: ${evidence.modelStates} states / ${evidence.modelSteps} steps`
document.querySelector('#projection-counts').textContent =
  `${evidence.modelStates} concrete states → ${evidence.chartStates} displayed states.` +
  (evidence.omittedSteps
    ? ` Within-state steps omitted: ${evidence.omittedSteps}.`
    : '')
const ns = 'http://www.w3.org/2000/svg'
const fonts = {
  atlas: "'Iowan Old Style', Georgia, serif",
  blueprint: 'Menlo, monospace',
  notebook: "Noteworthy, 'Comic Sans MS', cursive",
}
let theme = 'atlas',
  current = paths.find((p) => p.id === 'repentance'),
  position = 0,
  focused = false,
  running = false,
  elapsed = 0,
  lastTime = 0,
  raf = 0
let storyMount, argumentMount, svg, ink, token, ring
const play = document.querySelector('#play'),
  motion = document.querySelector('#motion'),
  reduced = matchMedia('(prefers-reduced-motion: reduce)')
motion.checked = false
function element(name, attrs = {}) {
  const e = document.createElementNS(ns, name)
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v))
  return e
}
function sketch(host) {
  const drawing = host.querySelector('svg'),
    rc = rough.svg(drawing),
    color = getComputedStyle(host).getPropertyValue('--stroke').trim()
  for (const [i, el] of [
    ...drawing.querySelectorAll(
      '.pele-node>rect,.pele-edge>path:not(.pele-marker)'
    ),
  ].entries()) {
    const opts = {
      seed: i + 17,
      roughness: 0.5,
      bowing: 0.35,
      stroke: color,
      strokeWidth: 1.05,
    }
    const g =
      el.tagName === 'rect'
        ? rc.rectangle(
            +el.getAttribute('x'),
            +el.getAttribute('y'),
            +el.getAttribute('width'),
            +el.getAttribute('height'),
            {
              ...opts,
              fill: color,
              fillStyle: 'hachure',
              fillWeight: 0.25,
              hachureGap: 27,
            }
          )
        : rc.path(el.getAttribute('d'), opts)
    el.style.stroke = 'none'
    g.classList.add('sketch-shape')
    el.after(g)
  }
}
function renderStory() {
  storyMount?.destroy()
  const host = document.querySelector('#story-chart')
  host.replaceChildren()
  storyMount = mount(host, storySource, {
    fontFamily: fonts[theme],
    fontSize: 13,
    padding: 24,
    idPrefix: 'nephi-story-',
    responsive: false,
    zoom: { always: true, controls: true },
    onRender() {
      svg = host.querySelector('svg')
      if (!svg) return
      if (theme === 'notebook') sketch(host)
      ink = element('path', {
        class: 'play-ink',
        fill: 'none',
        pathLength: 1,
        'stroke-dasharray': '1 1',
      })
      token = element('circle', { class: 'play-token', r: 5 })
      ring = element('rect', { class: 'play-ring', rx: 7 })
      // The outline is a sibling of the source node. Copy its transform below.
      svg.querySelector('.pele-nodes').append(ring)
      for (const node of svg.querySelectorAll('.pele-node[data-id]')) {
        node.setAttribute('tabindex', '0')
        node.setAttribute('role', 'button')
        node.setAttribute('aria-label', node.textContent)
        const select = () => {
          const i = current.trace.findIndex((s) => s.nodeId === node.dataset.id)
          if (i >= 0) jump(i)
          else
            setStatus(
              'This state is outside the selected concrete path. Choose another path to inspect it.'
            )
        }
        node.addEventListener('click', select)
        node.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            select()
          }
        })
      }
      draw()
    },
  })
}
function renderArgument() {
  const host = document.querySelector('#argument-chart')
  host.replaceChildren()
  argumentMount = mount(host, argumentSource, {
    fontFamily: fonts[theme],
    fontSize: 14,
    padding: 24,
    idPrefix: 'nephi-argument-',
    responsive: false,
    zoom: { always: true, controls: true },
    onRender() {
      if (theme === 'notebook') sketch(host)
    },
  })
}
function setStatus(text) {
  const el = document.querySelector('#path-status')
  if (el.textContent !== text) el.textContent = text
}
function stop() {
  running = false
  cancelAnimationFrame(raf)
  play.textContent = motion.checked
    ? position === current.trace.length - 1
      ? '↻ Replay'
      : '▶ Play path'
    : 'Next state'
}
function pathEdge(index) {
  return edgeIds.get(
    `${current.trace[index].nodeId}>${current.trace[index + 1].nodeId}`
  )
}
function draw(progress = 0) {
  if (!svg) return
  svg.classList.toggle('path-focused', focused)
  for (const n of svg.querySelectorAll('.on-path,.current-node,.active-edge'))
    n.classList.remove('on-path', 'current-node', 'active-edge')
  ink.remove()
  token.remove()
  ring.style.display = focused ? '' : 'none'
  if (!focused) return
  const nodes = new Set(current.trace.map((s) => s.nodeId))
  for (const id of nodes)
    svg.querySelector(`.pele-node[data-id="${id}"]`)?.classList.add('on-path')
  for (let i = 0; i < current.trace.length - 1; i++) {
    const id = pathEdge(i)
    svg.querySelector(`.pele-edge[data-id="${id}"]`)?.classList.add('on-path')
    svg
      .querySelector(`.pele-edge-label[data-id="${id}"]`)
      ?.classList.add('on-path')
  }
  const node = svg.querySelector(
    `.pele-node[data-id="${current.trace[position].nodeId}"]`
  )
  node.classList.add('current-node')
  const r = node.querySelector('rect')
  if (r) {
    for (const [k, v] of Object.entries({
      x: +r.getAttribute('x') - 5,
      y: +r.getAttribute('y') - 5,
      width: +r.getAttribute('width') + 10,
      height: +r.getAttribute('height') + 10,
    }))
      ring.setAttribute(k, String(v))
    ring.setAttribute('transform', node.getAttribute('transform') || '')
  }
  if (progress > 0 && position < current.trace.length - 1) {
    const id = pathEdge(position),
      edge = svg.querySelector(`.pele-edge[data-id="${id}"]`),
      path = edge.querySelector(':scope>path:not(.pele-marker)')
    edge.classList.add('active-edge')
    svg
      .querySelector(`.pele-edge-label[data-id="${id}"]`)
      ?.classList.add('active-edge')
    ink.setAttribute('d', path.getAttribute('d'))
    ink.setAttribute('stroke-dashoffset', String(1 - progress))
    const p = path.getPointAtLength(path.getTotalLength() * progress)
    token.setAttribute('cx', p.x)
    token.setAttribute('cy', p.y)
    edge.append(ink, token)
    setStatus(current.trace[position + 1].actionLabel)
  } else setStatus(`State ${position} · ${current.trace[position].label}`)
}
function renderReadout() {
  const steps = document.querySelector('#trace')
  steps.replaceChildren()
  for (const s of current.trace) {
    const li = document.createElement('li'),
      b = document.createElement('button')
    b.type = 'button'
    const n = document.createElement('span'),
      label = document.createElement('span')
    n.textContent = s.index
    label.textContent = s.label
    b.append(n, label)
    if (s.index === position && focused) b.setAttribute('aria-current', 'step')
    b.onclick = () => jump(s.index)
    li.append(b)
    steps.append(li)
  }
  document.querySelector('#position').max = current.trace.length - 1
  document.querySelector('#position').value = position
  document.querySelector(
    '#position-label'
  ).textContent = `State ${position} of ${current.trace.length - 1}`
  const dl = document.querySelector('#values')
  dl.replaceChildren()
  for (const key of ['stage', 'response', 'descendants', 'judged']) {
    const row = document.createElement('div'),
      dt = document.createElement('dt'),
      dd = document.createElement('dd')
    dt.textContent = key
    const val = current.trace[position].values[key]
    dd.textContent = typeof val === 'boolean' ? (val ? 'TRUE' : 'FALSE') : val
    if (position && val !== current.trace[position - 1].values[key])
      dd.classList.add('changed')
    row.append(dt, dd)
    dl.append(row)
  }
  const rawTrace = document.querySelector('#raw-trace')
  rawTrace.href = traces.get(current.id)
  rawTrace.download = `${current.id}.out`
  document.querySelector('#previous').disabled = position === 0
  document.querySelector('#next').disabled =
    position === current.trace.length - 1
}
function jump(index) {
  stop()
  position = Math.max(0, Math.min(current.trace.length - 1, index))
  elapsed = 0
  focused = true
  renderReadout()
  draw()
  stop()
}
function choosePath(id) {
  stop()
  current = paths.find((p) => p.id === id)
  position = 0
  elapsed = 0
  focused = true
  document.querySelector('#path-description').textContent = {
    repentance:
      'A concrete path changes from captivity-facing choice to a Mediator-facing response before judgment. This depends on the revisability assumption A3.',
    life: 'A concrete path reaches life through the represented response to the Mediator. It illustrates a possibility, not a guarantee for every history.',
    captivity:
      'A concrete path reaches captivity and death. Its earlier probation states retain the option to change direction.',
  }[id]
  renderReadout()
  draw()
  stop()
}
function tick(time) {
  if (!running) return
  if (lastTime)
    elapsed +=
      (time - lastTime) * Number(document.querySelector('#speed').value)
  lastTime = time
  if (elapsed >= 1850) {
    position++
    elapsed = 0
    renderReadout()
    if (position === current.trace.length - 1) {
      draw()
      stop()
      return
    }
  }
  draw(Math.max(0, Math.min(1, (elapsed - 500) / 1350)))
  raf = requestAnimationFrame(tick)
}
play.onclick = () => {
  if (running) {
    stop()
    play.textContent = '▶ Resume'
    return
  }
  if (!motion.checked) {
    jump(position === current.trace.length - 1 ? 0 : position + 1)
    return
  }
  if (position === current.trace.length - 1) {
    position = 0
    elapsed = 0
    renderReadout()
  }
  focused = true
  running = true
  lastTime = 0
  play.textContent = 'Ⅱ Pause'
  draw()
  raf = requestAnimationFrame(tick)
}
document.querySelector('#previous').onclick = () => jump(position - 1)
document.querySelector('#next').onclick = () => jump(position + 1)
document.querySelector('#position').oninput = (e) =>
  jump(Number(e.target.value))
document.querySelector('#overview').onclick = () => {
  stop()
  focused = false
  draw()
  setStatus(
    'Full reachable graph. Select a path or a numbered state to focus it.'
  )
}
document.querySelector('#path').onchange = (e) => choosePath(e.target.value)
motion.onchange = () => {
  stop()
  elapsed = 0
  draw()
}
reduced.addEventListener('change', (e) => {
  if (e.matches) {
    motion.checked = false
    stop()
    elapsed = 0
    draw()
  }
})
document.addEventListener('visibilitychange', () => {
  if (document.hidden && running) {
    stop()
    play.textContent = '▶ Resume'
  }
})
document.querySelector('#theme').onchange = (e) => {
  stop()
  elapsed = 0
  theme = e.target.value
  for (const sheet of document.querySelectorAll('.chart-sheet'))
    sheet.className = `chart-sheet ${theme}`
  renderStory()
  argumentMount?.destroy()
  argumentMount = undefined
  if (!document.querySelector('#argument').hidden) renderArgument()
}
for (const b of document.querySelectorAll('[data-tab]'))
  b.onclick = () => {
    stop()
    for (const x of document.querySelectorAll('[data-tab]'))
      x.setAttribute('aria-pressed', String(x === b))
    for (const panel of document.querySelectorAll('.tab-panel'))
      panel.hidden = panel.id !== b.dataset.tab
    if (b.dataset.tab === 'argument') {
      if (!argumentMount) renderArgument()
      else argumentMount.zoom?.refresh()
    }
    if (b.dataset.tab === 'story') storyMount.zoom?.refresh()
  }
const ruleLabels = new Map([
  ['TypeOK', 'All modeled states have the declared shape.'],
  ['NoFallNoChildren', 'No descendants are introduced in Eden.'],
  ['OutcomeFollowsJudgment', 'Every terminal observation follows judgment.'],
  [
    'LifeRequiresMediatorResponse',
    'Judgment alone does not imply eternal life.',
  ],
  [
    'ProbationOffersBothChoices',
    'Both responses remain enabled during probation (A3).',
  ],
  ['NoDeadlock', 'Every reachable state admits a next observation.'],
])
for (const rule of evidence.passingRules) {
  const row = document.createElement('div')
  row.className = 'check'
  const mark = document.createElement('b')
  mark.textContent = '✓'
  const detail = document.createElement('div'),
    code = document.createElement('code'),
    p = document.createElement('div')
  code.textContent = rule
  p.textContent = ruleLabels.get(rule) ?? ''
  detail.append(code, p)
  row.append(mark, detail)
  document.querySelector('#checks').append(row)
}
for (const c of evidence.cases.filter((c) => c.kind === 'negative-control')) {
  const box = document.createElement('article')
  box.className = 'control'
  const b = document.createElement('b'),
    p = document.createElement('p'),
    a = document.createElement('a')
  b.textContent = c.title
  p.textContent = `Rejected by ${c.goal} after ${
    c.trace.length - 1
  } transitions${c.assumption ? ' · ' + c.assumption : ''}.`
  a.textContent = 'Download concrete failure trace'
  a.href = traces.get(c.id)
  a.download = `${c.id}.out`
  box.append(b, p, a)
  document.querySelector('#controls').append(box)
}
for (const a of interpretation.assumptions) {
  const row = document.createElement('div')
  row.className = 'assumption'
  const id = document.createElement('b'),
    text = document.createElement('span')
  id.textContent = a.id
  text.textContent = a.text
  row.append(id, text)
  document.querySelector('#assumptions').append(row)
}
for (const m of interpretation.mappings) {
  const row = document.createElement('div')
  row.className = 'mapping-row'
  const a = document.createElement('a'),
    claim = document.createElement('p'),
    model = document.createElement('p')
  a.href = interpretation.source + '#p' + m.verses.split('–')[0]
  a.textContent = 'vv. ' + m.verses
  claim.textContent = m.claim
  model.textContent = m.model
  row.append(a, claim, model)
  document.querySelector('#mapping').append(row)
}
document.querySelector('#limits-text').textContent = interpretation.limits
renderStory()
choosePath('repentance')
focused = false
renderReadout()
draw()
setStatus(
  'Full graph shown. Step through the path or turn on Animate to play it.'
)
window.nephiStudy = {
  evidence,
  interpretation,
  paths,
  edgeIds,
  nodeIds,
  get position() {
    return position
  },
  get running() {
    return running
  },
  get focused() {
    return focused
  },
  jump,
}
