# ⬡ Pipeline Processor Simulator

> An interactive, educational CPU pipeline visualizer built for engineering students.  
> Simulates real pipeline execution with hazard detection, data forwarding, stall insertion, live register updates, and step-by-step execution traces.

![Status](https://img.shields.io/badge/status-live-brightgreen?style=flat-square)
![Version](https://img.shields.io/badge/version-5.0-blue?style=flat-square)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=flat-square&logo=chartdotjs&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Deployed-success?style=flat-square&logo=github)

---

## 🔗 Live Demo

**👉 [https://Vimlachouhan16.github.io/CPU-pipeline-simulator/](https://Vimlachouhan16.github.io/CPU-pipeline-simulator/)**

---

##  Preview

```
┌─────────────────────────────────────────────────────────────────┐
│  ⬡  PIPELINE PROCESSOR // SIM          ● READY  STAGES 5  CPI —│
├──────────────────┬──────────────────────────────────────────────┤
│  01 // INPUT     │  06 // PIPELINE VISUALIZATION                │
│  LOAD R1,R0,10   │  INSTR   C1   C2   C3   C4   C5   C6  ...   │
│  ADD  R2,R1,R1   │  LOAD  [ IF ][ ID ][ EX ][MEM][ WB ]        │
│  SUB  R3,R2,R1   │  ADD        [ IF ][ ID ][ EX ][MEM][ WB ]   │
│  ...             │  SUB             [ IF ][ ID ][ EX ][MEM][WB] │
├──────────────────│─────────────────────────────────────────────-│
│  02 // CONTROLS  │  07 // METRICS   08 // GRAPH                 │
│  ▶RUN ⏸PAUSE    │  CPI: 1.83   Speedup: 2.73x   Cycles: 11     │
│  ⏭STEP ↺RESET   │  [Bar Chart]           [CPI Line Chart]       │
├──────────────────│──────────────────────────────────────────────│
│  03 // HAZARDS   │  09 // REGISTER FILE                         │
│  ⚡ FORWARDED    │  R0=0  R1=10  R2=20  R3=10                   │
│  ⚠ STALL        │  R4=200 R5=8  R6=200  R7=0                   │
├──────────────────┤                                              │
│  04 // SOLUTION  │  FORWARDING UNIT                             │
│  05 // STAGE REF │  ⚡ EX→ID: ENABLED                           │
└──────────────────┴──────────────────────────────────────────────┘
```

---

##  Features

### 🔧 Core Simulation
| Feature | Description |
|---|---|
| **Variable Pipeline Stages** | Select 2 to 6 stages dynamically |
| **Sequential Diagonal Execution** | Each instruction starts 1 cycle after the previous |
| **RAW Hazard Detection** | Read-After-Write hazards detected automatically |
| **Data Forwarding** | EX→ID and MEM→EX forwarding eliminates unnecessary stalls |
| **Load-Use Stalls** | 1-cycle stall inserted when LOAD result needed immediately |
| **Correct Register Values** | Sequential forwarding simulation gives exact results |

###  UI / Visualization
| Feature | Description |
|---|---|
| **Pipeline Grid** | Cycle-vs-instruction table with color-coded stages |
| **Transparent Cells** | Colored border + glowing text, no fill — clean look |
| **Live Register File** | Registers update at WB stage with flash animation |
| **Hazard Log** | Real-time RAW / Forwarded / Stall log with explanations |
| **Performance Metrics** | CPI, Speedup, Total Cycles, Stall Count |
| **Bar Chart** | Pipelined vs Non-Pipelined cycle comparison |
| **CPI Line Chart** | CPI trend over the simulation |

### 📋 New Sections
| Section | Description |
|---|---|
| **Execution Solution** | Step-by-step trace — shows operand values, binary for bitwise ops, final result |
| **Stage Reference Guide** | What each stage does, updated when stage count changes |

---

##  Supported Instructions

###  Data Transfer
| Instruction | Syntax | Operation |
|---|---|---|
| `LOAD` / `LW` | `LOAD R1, R0, 10` | `R1 = Memory[R0 + 10]` or `R1 = 0 + 10 = 10` |
| `STORE` / `SW` | `STORE R1, R0, 4` | `Memory[R0 + 4] = R1` |
| `MOV` | `MOV R2, R1` | `R2 = R1` |

###  Arithmetic
| Instruction | Syntax | Operation |
|---|---|---|
| `ADD` | `ADD R3, R1, R2` | `R3 = R1 + R2` |
| `ADDI` | `ADDI R3, R1, 5` | `R3 = R1 + 5` |
| `SUB` | `SUB R3, R1, R2` | `R3 = R1 - R2` |
| `MUL` | `MUL R3, R1, R2` | `R3 = R1 × R2` |
| `DIV` | `DIV R3, R1, R2` | `R3 = R1 ÷ R2` (integer) |
| `INC` | `INC R1` | `R1 = R1 + 1` |
| `DEC` | `DEC R1` | `R1 = R1 - 1` |
| `NEG` | `NEG R1` | `R1 = -R1` |

###  Logical / Bitwise
| Instruction | Syntax | Operation |
|---|---|---|
| `AND` | `AND R3, R1, R2` | `R3 = R1 & R2` (bitwise AND) |
| `OR` | `OR R3, R1, R2` | `R3 = R1 \| R2` (bitwise OR) |
| `XOR` | `XOR R3, R1, R2` | `R3 = R1 ⊕ R2` (bitwise XOR) |
| `NOT` | `NOT R1` | `R1 = ~R1` (1's complement) |

###  Shift
| Instruction | Syntax | Operation |
|---|---|---|
| `SHL` | `SHL R1, R1, 2` | `R1 = R1 << 2` (multiply by 4) |
| `SHR` | `SHR R1, R1, 1` | `R1 = R1 >> 1` (divide by 2) |

### Compare & Control
| Instruction | Syntax | Operation |
|---|---|---|
| `CMP` | `CMP R1, R2` | Flags = R1 - R2 (no register write) |
| `JMP` | `JMP label` | Unconditional jump |
| `BEQ` | `BEQ R1, R2` | Branch if R1 == R2 |
| `BNE` | `BNE R1, R2` | Branch if R1 ≠ R2 |

---

##  Example: Verified Register Computation

```asm
LOAD R1, R0, 10   → R1 = 0 + 10         = 10
ADD  R2, R1, R1   → R2 = 10 + 10        = 20
SUB  R3, R2, R1   → R3 = 20 - 10        = 10
MUL  R4, R3, R2   → R4 = 10 × 20        = 200
AND  R5, R4, R3   → 11001000            (200)
                     00001010  AND       (10)
                   = 00001000 → R5       = 8
OR   R6, R5, R4   → 00001000            (8)
                     11001000  OR        (200)
                   = 11001000 → R6       = 200
```

**Result: R0=0, R1=10, R2=20, R3=10, R4=200, R5=8, R6=200, R7=0** ✓

---

##  Pipeline Stage Colors

| Stage | Color | What Happens |
|---|---|---|
| **IF** | 🔵 Light Blue | Instruction fetched from memory, PC incremented |
| **ID** | 🟢 Mint Green | Opcode decoded, registers read, hazards detected |
| **EX** | 🟡 Soft Yellow | ALU computes result / address; forwarding applied |
| **MEM** | 🩷 Blush Pink | LOAD reads / STORE writes memory |
| **WB** | 🟣 Lavender | Result written back to destination register |
| **STALL** | 🔴 Light Coral | Pipeline bubble inserted due to load-use hazard |

---

## 🔬 How the Simulation Works

### Sequential Issue
Instructions enter IF one per cycle:
```
Cycle:  1    2    3    4    5    6    7    8    9   10   11
I1:    [IF] [ID] [EX] [MEM][WB]
I2:         [IF] [ID] [EX] [MEM][WB]
I3:              [IF] [ID] [EX] [MEM][WB]
```

### RAW Hazard + Forwarding
```
I1: LOAD R1, R0, 10   ← writes R1 at MEM
I2: ADD  R2, R1, R1   ← reads R1 at ID — needs R1 from I1
```
With **forwarding**, I1's result is passed directly from EX/MEM to I2's ALU — no stall (except load-use which needs 1 stall).

### Load-Use Stall
```
I1: LOAD R1, R0, 4    ← result only ready after MEM
I2: ADD  R2, R1, R0   ← reads R1 — 1 stall cycle inserted
```

### Performance Metrics
```
CPI     = Total Cycles ÷ Instructions Completed
Speedup = Non-pipelined Cycles ÷ Pipelined Cycles
Non-pipelined Cycles = Instructions × Stages
```

---

##  Controls

| Button | Shortcut | Action |
|---|---|---|
| **▶ RUN** | — | Auto-simulate cycle by cycle |
| **⏸ PAUSE** | — | Freeze at current cycle |
| **⏭ STEP** | — | Advance exactly one cycle |
| **↺ RESET** | — | Clear all state, start fresh |

**Speed options:** 0.5x (slow) · 1x (normal) · 2x (fast) · 4x (turbo)

---

##  Project Structure

```
CPU-pipeline-simulator/
│
└── index.html          ← Complete single-file application
                           (HTML + CSS + JS all in one)
```

> All CSS, JavaScript, and HTML are embedded in one file.
> No build tools, no dependencies, no server required beyond serving the file.

**External CDN resources loaded at runtime:**
- [Chart.js 4.4.1](https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js) — performance graphs
- [Google Fonts](https://fonts.googleapis.com) — Orbitron + Share Tech Mono

---

##  Run Locally

> The file uses no ES6 modules, so it can even be opened directly.
> For best results, serve over HTTP:

**Python (simplest — no install needed):**
```bash
# Navigate to the folder containing index.html
cd CPU-pipeline-simulator

# Python 3
python -m http.server 8080

# Then open in browser:
# http://localhost:8080
```

**Node.js:**
```bash
npx serve .
# or
npx http-server . -p 8080
```

**VS Code:**
Install the **Live Server** extension → right-click `index.html` → *Open with Live Server*

---


```
https://YOUR-USERNAME.github.io/REPO-NAME/
```

> ⚠️ The file **must** be named `index.html` (not `pipeline-sim-v4.html` etc.)  
> ⚠️ It must be at the **root** of the repo, not inside any subfolder

---

##  Sections in the UI

| Panel | Description |
|---|---|
| **01 // Instruction Input** | Assembly source textarea + sample presets |
| **01b // Pipeline Config** | Stage count slider (2–6), speed selector, stage legend |
| **02 // Controls** | Run / Pause / Step / Reset buttons + progress bar |
| **03 // Hazard Detection** | Live log of RAW hazards, forwarding events, stalls |
| **04 // Execution Solution** | Step-by-step trace with operand values and binary breakdown |
| **05 // Stage Reference Guide** | What each stage does for the current pipeline depth |
| **06 // Pipeline Visualization** | Cycle × Instruction grid with color-coded stage cells |
| **07 // Performance Metrics** | Cycles, CPI, Speedup, Completed instructions, Stalls |
| **08 // Performance Graph** | Bar chart (pipeline vs non-pipeline) + CPI over time |
| **09 // Register File** | Live R0–R7 values, green flash on update |

---

##  Preset Programs

| Preset | What it demonstrates |
|---|---|
| **RAW + FORWARD** | Classic forwarding scenario — LOAD followed by dependent ALU ops |
| **LOAD-USE STALL** | Shows 1-cycle stall bubble insertion |
| **INDEPENDENT** | No hazards — perfect pipeline throughput |
| **MIXED OPS** | LOAD, ADD, STORE, SUB, MUL, AND together |
| **BITWISE OPS** | AND, OR, XOR, NOT with binary trace in solution |
| **SHIFT OPS** | SHL, SHR with INC/DEC |
| **DIV + NEG** | Division, negation, and MOV |

---

##  Technologies Used

| Technology | Purpose |
|---|---|
| **HTML5** | Structure and markup |
| **CSS3** | Dark neon theme, animations, grid layout, glassmorphism |
| **Vanilla JavaScript (ES5/6)** | Simulation engine, DOM rendering, event handling |
| **Chart.js 4.4** | Bar and line performance charts |
| **Orbitron** (Google Font) | Display headings and labels |
| **Share Tech Mono** (Google Font) | Monospace code and instruction text |

---

##  Educational Concepts Covered

- CPU Pipelining fundamentals
- Pipeline stages: IF, ID, EX, MEM, WB
- Data hazards — Read After Write (RAW)
- Structural hazards overview
- Data forwarding / bypassing
- Load-use stall insertion
- CPI (Cycles Per Instruction)
- Pipeline speedup calculation
- Binary arithmetic: AND, OR, XOR, NOT, SHL, SHR
- Register file and writeback

---

##  License

MIT License — free to use, modify, and distribute for educational purposes.
