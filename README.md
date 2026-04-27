# Pipeline Processor Simulator  
###  Cyberpunk-Themed CPU Pipeline Visualizer

---

## Overview

This project is a **Pipeline Processor Simulator** that visually demonstrates how instructions are executed in a CPU using a **5-stage pipeline architecture**.

It provides an interactive interface to understand:

- Instruction execution flow  
- Pipeline stages (IF, ID, EX, MEM, WB)  
- Data hazards and forwarding  
- Pipeline stalls  
- Performance metrics (CPI, cycles, etc.)  

---

##  Demo

> Open `index.html` in your browser to run the simulator.

---

## ✨ Features

- ⚙️ 5-stage pipeline simulation  
- 🎯 Real-time pipeline visualization  
- ⚠️ Hazard detection (RAW hazards)  
- 🔄 Forwarding support  
- ⏸️ Stall insertion  
- 📊 Performance metrics display  
- 🎨 Cyberpunk-themed UI  

---

##  Pipeline Stages

| Stage | Description |
|------|------------|
| IF | Instruction Fetch |
| ID | Instruction Decode |
| EX | Execute |
| MEM | Memory Access |
| WB | Write Back |

---

## Sample Instructions
LOAD R1, R0, 10
ADD R2, R1, R1
SUB R3, R2, R1
MUL R4, R3, R2
AND R5, R4, R3
OR R6, R5, R4


---

##  How to Run

1. Download or clone the repository  
2. Open the project folder  
3. Double-click `index.html`  

_or_

Right-click → **Open with Browser**

---

##  Controls

- ▶ Run → Start simulation  
- ⏸ Pause → Pause execution  
- ⏭ Step → Execute one cycle  
- 🔄 Reset → Restart simulation  

---

##  Output Metrics

- Total Cycles  
- Instructions Executed  
- CPI (Cycles Per Instruction)  
- Pipeline Stalls  
- Forwarding Status  

---

##  Concepts Covered

- Instruction Pipelining  
- Data Hazards (RAW)  
- Forwarding Techniques  
- Pipeline Optimization  
- CPU Performance Analysis  

---

##  Future Improvements

- Branch prediction  
- Cache simulation  
- Multi-core pipeline  
- File input for instructions  
- Export results  

