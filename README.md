# ⬡ Pipeline Processor Simulator

> An interactive, educational CPU pipeline visualizer with real-time animation, hazard detection, forwarding logic, and live performance metrics — built as a final-year engineering project.

![Pipeline Simulator](https://img.shields.io/badge/status-live-brightgreen?style=flat-square)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=flat-square&logo=chartdotjs&logoColor=white)

---

## 🔗 Live Demo

**👉 [https://your-username.github.io/pipeline-sim/](https://Vimlachouhan16.github.io/pipeline-sim/)**

*(Replace `your-username` with your GitHub username after deployment)*

---

## 📸 Features

| Feature | Description |
|---|---|
| 🔢 **Variable Stages** | Select 2 to 6 pipeline stages dynamically |
| ✏️ **Custom Instructions** | Enter your own assembly-like instructions |
| 📋 **Preset Programs** | 4 built-in examples (RAW, Load-Use, Independent, Mixed) |
| ⚡ **Hazard Detection** | RAW hazard detection with EX→ID forwarding |
| 🔄 **Stall Insertion** | Load-use stalls automatically inserted when forwarding fails |
| 📊 **Live Metrics** | CPI, Speedup, Total Cycles, Stall count |
| 📈 **Charts** | Bar chart (pipelined vs non-pipelined) + CPI over time line chart |
| 🗂️ **Register File** | Live register updates on WB stage |
| 🎨 **Dark Neon UI** | Color-coded pipeline stages with smooth animations |

---

## 🧠 Pipeline Stage Colors

| Stage | Color | Description |
|---|---|---|
| **IF** | 🔵 Cyan | Instruction Fetch |
| **ID** | 🟢 Green | Instruction Decode |
| **EX** | 🟠 Orange | Execute |
| **MEM** | 🩷 Pink | Memory Access |
| **WB** | 🟣 Purple | Write Back |
| **STALL** | 🔴 Red | Pipeline Stall |

---

## 🎮 Controls

| Button | Action |
|---|---|
| ▶ **RUN** | Auto-step simulation cycle by cycle |
| ⏸ **PAUSE** | Freeze at current cycle |
| ⏭ **STEP** | Manually advance one cycle |
| ↺ **RESET** | Clear all state and start fresh |

---

## 📝 Supported Instructions

```
ADD  R1, R2, R3     // R1 = R2 + R3
SUB  R1, R2, R3     // R1 = R2 - R3
MUL  R1, R2, R3     // R1 = R2 * R3
AND  R1, R2, R3     // R1 = R2 & R3
OR   R1, R2, R3     // R1 = R2 | R3
XOR  R1, R2, R3     // R1 = R2 ^ R3
ADDI R1, R2, 5      // R1 = R2 + 5  (immediate)
SUBI R1, R2, 3      // R1 = R2 - 3
ANDI R1, R2, 7      // R1 = R2 & 7
ORI  R1, R2, 1      // R1 = R2 | 1
LOAD R1, R2, 0      // R1 = MEM[R2 + 0]
LW   R1, R2, 4      // same as LOAD
STORE R1, R2, 0     // MEM[R2 + 0] = R1
SW   R1, R2, 4      // same as STORE
MOV  R1, R2         // R1 = R2
NOP                 // No operation
```

---

## 🗂️ Project Structure

```
pipeline-sim/
│
├── index.html              ← Main application entry point
│
├── css/
│   └── styles.css          ← Full dark neon dashboard theme
│
├── js/
│   ├── main.js             ← App controller (run/pause/step/reset logic)
│   ├── pipeline.js         ← Core simulation engine & instruction parser
│   ├── ui.js               ← Grid rendering, animations, metrics display
│   ├── graph.js            ← Chart.js bar + line chart integration
│   └── hazard.js           ← Hazard detection & forwarding analysis
│
└── README.md               ← This file
```

---

## 🖥️ Run Locally

> ⚠️ Must use a local server — ES6 modules don't work with `file://` protocol directly.

**Option 1 — Python (recommended, no install needed):**
```bash
cd pipeline-sim
python -m http.server 8080
```
Then open: http://localhost:8080

**Option 2 — Node.js:**
```bash
npx serve pipeline-sim
```

**Option 3 — VS Code:**
Install the **Live Server** extension → right-click `index.html` → *Open with Live Server*

---

## 🚀 Deploy to GitHub Pages

1. Create a **public** GitHub repository
2. Upload all project files (make sure `index.html` is at the root)
3. Go to **Settings → Pages**
4. Set Source: **Branch: `main` / Folder: `/ (root)`**
5. Click **Save**
6. Your site goes live at: `https://your-username.github.io/repo-name/`

---

## 🔬 How the Simulation Works

### Pipeline Execution
Each instruction moves through the pipeline stages one per cycle. Multiple instructions overlap (pipelining), improving throughput.

### Hazard Detection (RAW)
A **Read After Write (RAW)** hazard occurs when an instruction needs a register value that hasn't been written yet by a previous instruction.

**Example:**
```
LOAD R1, R0, 0    ← writes R1 in MEM stage
ADD  R2, R1, R1   ← reads R1 in ID stage — HAZARD!
```

### Forwarding (EX → ID)
When the result is available early (after EX stage), it is **forwarded** directly to the next instruction — no stall needed.

### Load-Use Stall
A **LOAD** instruction's result is only available after MEM, so if the next instruction immediately uses that register, **1 stall cycle** is inserted — forwarding alone cannot help here.

### Performance Metrics
- **CPI** = Total Cycles ÷ Instructions Completed
- **Speedup** = Non-pipelined cycles ÷ Pipelined cycles
- **Non-pipelined cycles** = Instructions × Stages (sequential execution)

---

## 📚 Technologies Used

- **HTML5** — Structure
- **CSS3** — Dark neon theme, animations, grid layout
- **Vanilla JavaScript (ES6 Modules)** — Simulation logic, DOM rendering
- **Chart.js 4.4** — Performance graphs
- **Google Fonts** — Orbitron (display) + Share Tech Mono (monospace)

---

## 👨‍💻 Author

Built as a Final Year Engineering Project — Computer Architecture & Organization.

---

## 📄 License

MIT License — free to use, modify, and distribute.
