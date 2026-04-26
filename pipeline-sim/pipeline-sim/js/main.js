/**
 * main.js — Application Controller
 * Wires together simulation engine, UI, and graph modules
 */
import { parseInstructions, PipelineSimulator } from './pipeline.js';
import { renderPipelineGrid, renderRegisters, renderHazards, renderMetrics, updateStatusBadge, renderStageColors } from './ui.js';
import { renderPerformanceChart, renderCPIChart, destroyCharts } from './graph.js';

// ─── State ────────────────────────────────────────────────────────────────────
let sim = null;
let animTimer = null;
let stepDelay = 600; // ms between auto-steps
let cpiHistory = [];
let currentCycleView = 0;

// ─── Default program presets ──────────────────────────────────────────────────
const PRESETS = {
  'RAW + FORWARD': `LOAD R1, R0, 0
ADD R2, R1, R1
SUB R3, R2, R1
MUL R4, R3, R2
AND R5, R4, R3
OR R6, R5, R4`,

  'LOAD-USE STALL': `LOAD R1, R0, 4
ADD R2, R1, R0
SUB R3, R1, R2
OR R4, R3, R2`,

  'INDEPENDENT STREAM': `ADD R1, R0, R0
ADD R2, R0, R0
ADD R3, R0, R0
SUB R4, R0, R0
MUL R5, R0, R0
OR  R6, R0, R0`,

  'MIXED OPS': `LOAD R1, R0, 0
ADD R2, R1, R1
STORE R2, R0, 4
SUB R3, R2, R1
MUL R4, R3, R2
AND R5, R4, R3`,
};

// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initPresets();
  initControls();
  initStageSlider();
  initSpeedControl();
  loadPreset('RAW + FORWARD');
  updateStatusBadge('ready');
  renderStageColors(getNumStages());
});

function initPresets() {
  const container = document.getElementById('preset-buttons');
  if (!container) return;
  Object.keys(PRESETS).forEach(name => {
    const btn = document.createElement('button');
    btn.className = 'preset-btn';
    btn.textContent = name;
    btn.onclick = () => {
      loadPreset(name);
      document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    };
    container.appendChild(btn);
  });
}

function loadPreset(name) {
  const ta = document.getElementById('instruction-input');
  if (ta) ta.value = PRESETS[name];
}

function initControls() {
  document.getElementById('btn-run').onclick = () => startRun();
  document.getElementById('btn-pause').onclick = () => pauseRun();
  document.getElementById('btn-step').onclick = () => stepOnce();
  document.getElementById('btn-reset').onclick = () => resetAll();
}

function initStageSlider() {
  const slider = document.getElementById('stage-count');
  const label = document.getElementById('stage-label');
  if (!slider) return;
  slider.addEventListener('input', () => {
    label.textContent = slider.value + ' STAGES';
    renderStageColors(parseInt(slider.value));
  });
}

function initSpeedControl() {
  const sel = document.getElementById('speed-select');
  if (!sel) return;
  sel.addEventListener('change', () => {
    const map = { '0.5': 1200, '1': 600, '2': 300, '4': 100 };
    stepDelay = map[sel.value] || 600;
  });
}

function getNumStages() {
  const s = document.getElementById('stage-count');
  return s ? parseInt(s.value) : 5;
}

function buildSimulator() {
  stopTimer();
  const text = document.getElementById('instruction-input').value;
  if (!text.trim()) { showToast('Enter instructions first!'); return null; }
  const instrs = parseInstructions(text);
  if (instrs.length === 0) { showToast('No valid instructions found!'); return null; }
  sim = new PipelineSimulator(instrs, getNumStages());
  cpiHistory = [];
  currentCycleView = 0;
  destroyCharts();
  return sim;
}

function startRun() {
  if (!sim || sim.done) {
    if (!buildSimulator()) return;
  }
  if (animTimer) return; // already running
  updateStatusBadge('running');
  setControlState('running');
  scheduleStep();
}

function scheduleStep() {
  animTimer = setTimeout(() => {
    if (!sim || sim.done) {
      stopTimer();
      finalize();
      return;
    }
    doStep();
    scheduleStep();
  }, stepDelay);
}

function pauseRun() {
  stopTimer();
  updateStatusBadge('paused');
  setControlState('paused');
}

function stepOnce() {
  if (!sim) {
    if (!buildSimulator()) return;
    updateStatusBadge('paused');
  }
  if (sim.done) return;
  stopTimer();
  setControlState('paused');
  doStep();
  if (sim.done) finalize();
}

function doStep() {
  sim.step();
  currentCycleView = sim.cycle;
  renderAll();
  cpiHistory.push(parseFloat(sim.getCPI()) || 0);
  renderCPIChart(cpiHistory);
}

function resetAll() {
  stopTimer();
  sim = null;
  cpiHistory = [];
  destroyCharts();
  document.getElementById('pipeline-grid').innerHTML = `<div class="grid-placeholder">
    <div class="placeholder-icon">⬡</div>
    <p>Configure instructions and press <strong>RUN</strong> to start simulation</p>
  </div>`;
  document.getElementById('hazard-log').innerHTML = `<div class="hazard-empty"><span class="hazard-ok">✓</span> No hazards detected.</div>`;
  document.getElementById('register-file').innerHTML = Array.from({length:8},(_,i)=>`<div class="reg-cell"><span class="reg-name">R${i}</span><span class="reg-val">${i+1}</span></div>`).join('');
  ['metric-cycles','metric-cpi','metric-speedup','metric-instrs','metric-stalls'].forEach(id => {
    const e = document.getElementById(id); if(e) e.textContent = id==='metric-cpi'?'0.00':id==='metric-speedup'?'0.00x':'0';
  });
  document.getElementById('progress-bar').style.width = '0%';
  updateStatusBadge('ready');
  setControlState('idle');
}

function finalize() {
  updateStatusBadge('done');
  setControlState('done');
  renderAll();
  renderPerformanceChart(sim);
  renderCPIChart(cpiHistory);
  showToast(`✓ Simulation complete — ${sim.cycle} cycles, CPI ${sim.getCPI()}`);
}

function renderAll() {
  renderPipelineGrid(sim, currentCycleView);
  renderRegisters(sim.registers);
  renderHazards(sim);
  renderMetrics(sim);
}

function stopTimer() {
  if (animTimer) { clearTimeout(animTimer); animTimer = null; }
}

function setControlState(state) {
  const run   = document.getElementById('btn-run');
  const pause = document.getElementById('btn-pause');
  const step  = document.getElementById('btn-step');
  const reset = document.getElementById('btn-reset');
  run.disabled   = state === 'running';
  pause.disabled = state !== 'running';
  step.disabled  = state === 'running' || state === 'done';
  reset.disabled = false;
}

function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('toast-show');
  setTimeout(() => t.classList.remove('toast-show'), 3000);
}
