/**
 * pipeline.js — Core Pipeline Simulation Engine
 * Handles instruction parsing, pipeline state, PC management
 */

export const STAGE_NAMES = {
  2: ['IF', 'WB'],
  3: ['IF', 'EX', 'WB'],
  4: ['IF', 'ID', 'EX', 'WB'],
  5: ['IF', 'ID', 'EX', 'MEM', 'WB'],
  6: ['IF', 'ID', 'EX', 'MEM', 'WB', 'WB2'],
};

export const STAGE_COLORS = {
  IF:   { bg: '#0ff2fe', text: '#000', glow: '0 0 12px #0ff2fe88' },
  ID:   { bg: '#43e97b', text: '#000', glow: '0 0 12px #43e97b88' },
  EX:   { bg: '#f7971e', text: '#000', glow: '0 0 12px #f7971e88' },
  MEM:  { bg: '#f953c6', text: '#000', glow: '0 0 12px #f953c688' },
  WB:   { bg: '#b621fe', text: '#fff', glow: '0 0 12px #b621fe88' },
  WB2:  { bg: '#6a0dad', text: '#fff', glow: '0 0 12px #6a0dad88' },
  STALL:{ bg: '#ff4444', text: '#fff', glow: '0 0 12px #ff444488' },
  NOP:  { bg: '#2a2a3a', text: '#666', glow: 'none' },
};

/**
 * Parse raw assembly text into instruction objects
 */
export function parseInstructions(text) {
  const lines = text.trim().split('\n').filter(l => l.trim() && !l.trim().startsWith('//') && !l.trim().startsWith('#'));
  return lines.map((line, idx) => {
    const clean = line.trim().toUpperCase().replace(/,/g, ' ').replace(/\s+/g, ' ');
    const parts = clean.split(' ');
    const op = parts[0];
    let dest = null, src1 = null, src2 = null, imm = null;

    if (['ADD', 'SUB', 'AND', 'OR', 'MUL', 'XOR', 'SLT'].includes(op)) {
      dest = parts[1]; src1 = parts[2]; src2 = parts[3];
    } else if (['ADDI', 'SUBI', 'ANDI', 'ORI'].includes(op)) {
      dest = parts[1]; src1 = parts[2]; imm = parts[3];
    } else if (op === 'LOAD' || op === 'LW') {
      dest = parts[1]; src1 = parts[2]; imm = parts[3] || '0';
    } else if (op === 'STORE' || op === 'SW') {
      src1 = parts[1]; src2 = parts[2]; imm = parts[3] || '0';
    } else if (op === 'MOV') {
      dest = parts[1]; src1 = parts[2];
    } else if (op === 'NOP') {
      // no-op
    } else {
      dest = parts[1] || null; src1 = parts[2] || null; src2 = parts[3] || null;
    }

    return { id: idx, raw: line.trim(), op, dest, src1, src2, imm, label: `I${idx + 1} ${line.trim()}` };
  });
}

/**
 * Core pipeline state machine
 */
export class PipelineSimulator {
  constructor(instructions, numStages) {
    this.instructions = instructions;
    this.numStages = numStages;
    this.stages = STAGE_NAMES[numStages];
    this.reset();
  }

  reset() {
    this.cycle = 0;
    this.pc = 0;
    this.done = false;
    // pipeline slots: array of {instr, stage, stall}
    this.pipeline = [];
    // cycle log: array of rows, each row is array of stage labels per instruction
    this.cycleLog = []; // [{instrIdx, stages: [{cycle, stageName, type}]}]
    this.registers = {};
    for (let i = 0; i <= 7; i++) this.registers[`R${i}`] = i + 1;
    this.hazardLog = [];
    this.totalStalls = 0;
    this.completedInstructions = 0;

    // Initialize per-instruction cycle tracking
    this.instrCycles = this.instructions.map(() => []);
    // in-flight: [{instrIdx, stageIdx}]
    this.inFlight = [];
    // forwarding state: {instrIdx -> {ex_result_ready_cycle, mem_result_ready_cycle}}
    this.forwardingMap = {};
  }

  /**
   * Step one cycle forward. Returns false if simulation complete.
   */
  step() {
    if (this.done) return false;
    this.cycle++;

    // Advance all in-flight instructions
    const newInFlight = [];
    const stallSet = new Set();

    // Check hazards before advancing
    for (let i = 0; i < this.inFlight.length; i++) {
      const slot = this.inFlight[i];
      const instr = this.instructions[slot.instrIdx];
      const stageName = this.stages[slot.stageIdx];

      // RAW hazard check: instruction moving to ID (decode) needs its sources
      if (stageName === 'ID' && slot.stageIdx > 0) {
        const hazard = this._checkRAWHazard(slot.instrIdx, i);
        if (hazard.stall) {
          stallSet.add(i);
          this.hazardLog.push({
            cycle: this.cycle,
            instrIdx: slot.instrIdx,
            raw: instr.raw,
            reason: hazard.reason,
            forwarded: false,
          });
          this.totalStalls++;
        } else if (hazard.forwarded) {
          this.hazardLog.push({
            cycle: this.cycle,
            instrIdx: slot.instrIdx,
            raw: instr.raw,
            reason: hazard.reason,
            forwarded: true,
          });
        }
      }
    }

    // Advance non-stalled instructions
    for (let i = 0; i < this.inFlight.length; i++) {
      const slot = { ...this.inFlight[i] };
      if (stallSet.has(i)) {
        // stay in current stage — record stall
        this.instrCycles[slot.instrIdx].push({ cycle: this.cycle, stage: this.stages[slot.stageIdx], type: 'stall' });
        newInFlight.push(slot);
      } else {
        slot.stageIdx++;
        if (slot.stageIdx < this.numStages) {
          this.instrCycles[slot.instrIdx].push({ cycle: this.cycle, stage: this.stages[slot.stageIdx], type: 'normal' });
          newInFlight.push(slot);
          // If entering WB, update registers
          if (this.stages[slot.stageIdx] === 'WB' || (this.numStages <= 3 && slot.stageIdx === this.numStages - 1)) {
            this._writeBack(slot.instrIdx);
          }
        } else {
          // instruction completed
          this.completedInstructions++;
        }
      }
    }

    // Issue new instruction if PC not exhausted and no structural hazard at IF
    const ifBusy = newInFlight.some(s => s.stageIdx === 0);
    if (this.pc < this.instructions.length && !ifBusy) {
      const instrIdx = this.pc++;
      this.instrCycles[instrIdx].push({ cycle: this.cycle, stage: this.stages[0], type: 'normal' });
      newInFlight.push({ instrIdx, stageIdx: 0 });
    }

    this.inFlight = newInFlight;

    // Done when all instructions completed
    if (this.pc >= this.instructions.length && this.inFlight.length === 0) {
      this.done = true;
    }

    return true;
  }

  /**
   * Run to completion
   */
  runAll() {
    let guard = 0;
    while (!this.done && guard < 500) {
      this.step();
      guard++;
    }
  }

  _checkRAWHazard(instrIdx, flightIdx) {
    const instr = this.instructions[instrIdx];
    const sources = [instr.src1, instr.src2].filter(s => s && s.startsWith('R'));
    if (sources.length === 0) return { stall: false };

    // Find preceding instructions still in pipeline
    for (let j = 0; j < flightIdx; j++) {
      const prev = this.inFlight[j];
      const prevInstr = this.instructions[prev.instrIdx];
      if (!prevInstr.dest || !prevInstr.dest.startsWith('R')) continue;
      if (!sources.includes(prevInstr.dest)) continue;

      const prevStage = this.stages[prev.stageIdx];
      const stageIdx = prev.stageIdx;

      // Forwarding: EX result available after EX stage (stageIdx >= 2 for 5-stage)
      const exIdx = this.stages.indexOf('EX');
      const memIdx = this.stages.indexOf('MEM');

      // LOAD-USE hazard: if prev is LOAD and still in EX, must stall
      if ((prevInstr.op === 'LOAD' || prevInstr.op === 'LW') && stageIdx === exIdx) {
        return { stall: true, reason: `Load-use: ${prevInstr.raw} → ${instr.raw}` };
      }

      // Can forward from EX or MEM
      if (stageIdx >= exIdx) {
        return { stall: false, forwarded: true, reason: `Forward EX→ID: ${prevInstr.dest} from ${prevInstr.raw}` };
      }

      // Still in IF or ID, cannot forward
      if (stageIdx < exIdx) {
        return { stall: true, reason: `RAW hazard: ${prevInstr.raw} → ${instr.raw}` };
      }
    }
    return { stall: false };
  }

  _writeBack(instrIdx) {
    const instr = this.instructions[instrIdx];
    if (!instr.dest || !instr.dest.startsWith('R')) return;
    const r = parseInt(instr.dest.slice(1));
    const s1 = this.registers[instr.src1] || 0;
    const s2 = instr.src2 ? (this.registers[instr.src2] || 0) : (parseInt(instr.imm) || 0);
    switch (instr.op) {
      case 'ADD': case 'ADDI': this.registers[instr.dest] = s1 + s2; break;
      case 'SUB': case 'SUBI': this.registers[instr.dest] = s1 - s2; break;
      case 'AND': case 'ANDI': this.registers[instr.dest] = s1 & s2; break;
      case 'OR':  case 'ORI':  this.registers[instr.dest] = s1 | s2; break;
      case 'MUL': this.registers[instr.dest] = s1 * s2; break;
      case 'XOR': this.registers[instr.dest] = s1 ^ s2; break;
      case 'MOV': this.registers[instr.dest] = s1; break;
      case 'LOAD': case 'LW': this.registers[instr.dest] = (s1 + parseInt(instr.imm || 0)) % 256; break;
      default: this.registers[instr.dest] = s1 + s2;
    }
  }

  getCPI() {
    if (this.completedInstructions === 0) return 0;
    return (this.cycle / this.completedInstructions).toFixed(2);
  }

  getNonPipelinedCycles() {
    return this.instructions.length * this.numStages;
  }

  getSpeedup() {
    if (this.cycle === 0) return 0;
    return (this.getNonPipelinedCycles() / this.cycle).toFixed(2);
  }
}
