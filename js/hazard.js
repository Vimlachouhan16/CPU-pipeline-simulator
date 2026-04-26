/**
 * hazard.js — Hazard Detection & Forwarding Analysis
 * Provides detailed hazard reports for the UI
 */

/**
 * Analyze a completed simulation for hazard summary
 */
export function analyzeHazards(sim) {
  const raw = sim.hazardLog.filter(h => !h.forwarded);
  const forwarded = sim.hazardLog.filter(h => h.forwarded);

  return {
    totalHazards: sim.hazardLog.length,
    rawHazards: raw.length,
    forwardedHazards: forwarded.length,
    stalledCycles: sim.totalStalls,
    details: sim.hazardLog,
  };
}

/**
 * Classify an instruction's operation type
 */
export function classifyOp(op) {
  const arith = ['ADD','SUB','MUL','AND','OR','XOR','SLT','ADDI','SUBI','ANDI','ORI','MOV'];
  const mem = ['LOAD','LW','STORE','SW'];
  if (arith.includes(op)) return 'ALU';
  if (mem.includes(op)) return 'MEM';
  return 'OTHER';
}
