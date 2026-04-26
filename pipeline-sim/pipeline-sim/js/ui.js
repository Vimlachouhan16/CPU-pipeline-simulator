/**
 * ui.js — UI Rendering & Animation
 */
import { STAGE_COLORS, STAGE_NAMES } from './pipeline.js';
import { analyzeHazards } from './hazard.js';

export function renderPipelineGrid(sim, currentCycle) {
  const container = document.getElementById('pipeline-grid');
  if (!container) return;

  const maxCycle = currentCycle || sim.cycle;
  const stages = sim.stages;
  const instructions = sim.instructions;

  // Build lookup: instrIdx -> {cycle -> {stage, type}}
  const lookup = {};
  instructions.forEach((_, idx) => {
    lookup[idx] = {};
    sim.instrCycles[idx].forEach(entry => {
      lookup[idx][entry.cycle] = entry;
    });
  });

  let html = `<div class="grid-wrapper">`;
  // Header row
  html += `<div class="grid-header-row">`;
  html += `<div class="grid-cell grid-label-cell">INSTRUCTION</div>`;
  for (let c = 1; c <= maxCycle; c++) {
    html += `<div class="grid-cell grid-cycle-header">C${c}</div>`;
  }
  html += `</div>`;

  // Instruction rows
  instructions.forEach((instr, idx) => {
    const isActive = sim.inFlight.some(f => f.instrIdx === idx);
    html += `<div class="grid-row ${isActive ? 'row-active' : ''}">`;
    html += `<div class="grid-cell grid-instr-label" title="${instr.raw}">
      <span class="instr-id">I${idx + 1}</span>
      <span class="instr-op">${instr.op}</span>
    </div>`;

    for (let c = 1; c <= maxCycle; c++) {
      const entry = lookup[idx][c];
      if (entry) {
        const color = entry.type === 'stall'
          ? STAGE_COLORS['STALL']
          : (STAGE_COLORS[entry.stage] || STAGE_COLORS['NOP']);
        html += `<div class="grid-cell stage-cell ${entry.type === 'stall' ? 'stall-cell' : 'stage-active'}"
          style="background:${color.bg};color:${color.text};box-shadow:${color.glow};"
          title="${entry.type === 'stall' ? 'STALL' : entry.stage} @ Cycle ${c}">
          ${entry.type === 'stall' ? '✕' : entry.stage}
        </div>`;
      } else {
        html += `<div class="grid-cell stage-empty"></div>`;
      }
    }
    html += `</div>`;
  });

  html += `</div>`;
  container.innerHTML = html;

  // Animate newly added cells
  requestAnimationFrame(() => {
    container.querySelectorAll('.stage-active, .stall-cell').forEach((el, i) => {
      el.style.animationDelay = `${i * 8}ms`;
      el.classList.add('cell-enter');
    });
  });
}

export function renderRegisters(registers) {
  const container = document.getElementById('register-file');
  if (!container) return;
  const regs = Object.entries(registers).filter(([k]) => k.startsWith('R'));
  container.innerHTML = regs.map(([name, val]) => `
    <div class="reg-cell">
      <span class="reg-name">${name}</span>
      <span class="reg-val">${val}</span>
    </div>
  `).join('');
}

export function renderHazards(sim) {
  const container = document.getElementById('hazard-log');
  if (!container) return;
  const analysis = analyzeHazards(sim);

  if (analysis.totalHazards === 0) {
    container.innerHTML = `<div class="hazard-empty">
      <span class="hazard-ok">✓</span> No hazards detected up to current cycle.
    </div>`;
    return;
  }

  const items = analysis.details.slice(-8).reverse().map(h => `
    <div class="hazard-item ${h.forwarded ? 'hazard-forwarded' : 'hazard-stall'}">
      <div class="hazard-cycle">C${h.cycle}</div>
      <div class="hazard-info">
        <div class="hazard-type">${h.forwarded ? '⚡ FORWARDED' : '⚠ STALL'}</div>
        <div class="hazard-reason">${h.reason}</div>
      </div>
    </div>
  `).join('');

  container.innerHTML = `
    <div class="hazard-summary">
      <span class="hs-item raw">RAW: ${analysis.rawHazards}</span>
      <span class="hs-item fwd">FWD: ${analysis.forwardedHazards}</span>
      <span class="hs-item stl">Stalls: ${analysis.stalledCycles}</span>
    </div>
    ${items}
  `;
}

export function renderMetrics(sim) {
  const el = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = val; };
  el('metric-cycles', sim.cycle);
  el('metric-cpi', sim.getCPI());
  el('metric-speedup', sim.getSpeedup() + 'x');
  el('metric-instrs', sim.completedInstructions + ' / ' + sim.instructions.length);
  el('metric-stalls', sim.totalStalls);

  const prog = Math.min(100, (sim.completedInstructions / sim.instructions.length) * 100);
  const bar = document.getElementById('progress-bar');
  if (bar) bar.style.width = prog + '%';
}

export function updateStatusBadge(state) {
  const badge = document.getElementById('status-badge');
  if (!badge) return;
  const map = {
    ready:   { text: '● READY',   cls: 'status-ready'   },
    running: { text: '▶ RUNNING', cls: 'status-running' },
    paused:  { text: '⏸ PAUSED',  cls: 'status-paused'  },
    done:    { text: '✓ DONE',    cls: 'status-done'    },
  };
  const s = map[state] || map.ready;
  badge.textContent = s.text;
  badge.className = 'status-badge ' + s.cls;
}

export function renderStageColors(numStages) {
  const legend = document.getElementById('stage-legend');
  if (!legend) return;
  const stages = STAGE_NAMES[numStages];
  legend.innerHTML = stages.map(s => {
    const c = STAGE_COLORS[s];
    return `<span class="legend-item" style="background:${c.bg};color:${c.text};box-shadow:${c.glow}">${s}</span>`;
  }).join('');
}
