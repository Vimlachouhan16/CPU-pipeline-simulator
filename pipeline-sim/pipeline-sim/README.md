# Pipeline Processor Simulator

An interactive educational CPU pipeline visualizer with real-time animation, hazard detection, and performance metrics.

## Features
- Variable pipeline stages (2–6)
- RAW hazard detection with forwarding
- Load-use stall insertion
- Register file with writeback
- CPI, speedup, cycle metrics
- Bar + line charts (Chart.js)
- Preset programs + custom input

## Run Locally

```bash
# Option 1: Python
python -m http.server 8080
# then open http://localhost:8080

# Option 2: Node.js
npx serve .
```

## Deploy to GitHub Pages
1. Push to a GitHub repo
2. Settings → Pages → Deploy from branch `main` / `root`
3. Your site will be at `https://<user>.github.io/<repo>/`

## Supported Instructions
`ADD, SUB, MUL, AND, OR, XOR, ADDI, SUBI, ANDI, ORI, LOAD/LW, STORE/SW, MOV, NOP`

## Controls
- **RUN**: Auto-step through simulation
- **PAUSE**: Freeze current state
- **STEP**: Advance one cycle manually
- **RESET**: Clear all state
