# ♟ Chess Coach

A full-stack real-time chess coaching app that plays at **2300 Elo** and teaches you how to improve after every single move.

Built from scratch — C daemon talking to Stockfish over Unix pipes, React frontend over WebSockets. No chess APIs. No cloud. Runs entirely on your machine.

---

![Chess Coach](https://img.shields.io/badge/engine-Stockfish%2017-green?style=flat-square)
![Language](https://img.shields.io/badge/backend-C-blue?style=flat-square)
![Frontend](https://img.shields.io/badge/frontend-React%2018-61DAFB?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-white?style=flat-square)

---

## What it does

- **Green arrow** — best move available in the position
- **Red arrow** — what your opponent will play if you miss it (threat detection)
- **Eval bar** — live centipawn score after every move
- **Evaluation timeline** — full game graph showing exactly where you went wrong
- **Coach panel** — plain English advice based on the position (not raw engine output)
- **Move history** — full game in SAN notation
- **2300 Elo strength** — engine plays and thinks like a human master, not a machine

---

## Architecture

```
┌──────────────────────┐              ┌──────────────────────┐              ┌───────────────┐
│  React + Tailwind    │◄─ WebSocket ►│    C Backend Daemon  │◄─ UCI pipes ►│  Stockfish 17 │
│  localhost:5173      │   JSON/8080  │    localhost:8080     │  fork+pipe   │  subprocess   │
└──────────────────────┘              └──────────────────────┘              └───────────────┘
```

The C daemon does three things:
1. Spawns Stockfish via `fork()` + `pipe()` — raw Unix IPC, no libraries
2. Limits strength to exactly **2300 Elo** via UCI `UCI_LimitStrength`
3. Runs a **two-pass threat detection loop** — analyzes your best move, then flips the board and finds what your opponent threatens next

---

## Tech stack

| Layer | Tech |
|-------|------|
| Chess engine | Stockfish 17 (UCI protocol) |
| Backend | C (gcc), libwebsockets, json-c |
| Frontend | React 18, Vite, Tailwind CSS |
| Board rendering | react-chessboard, chess.js |
| Eval graph | Recharts |

---

## Requirements

- Linux (Fedora / Ubuntu / Debian)
- `gcc`, `make`
- `stockfish`
- `libwebsockets-devel` / `libwebsockets-dev`
- `json-c-devel` / `libjson-c-dev`
- Node.js v20+

---

## Installation

**Fedora:**
```bash
sudo dnf install -y gcc make git stockfish libwebsockets-devel json-c-devel nodejs
```

**Ubuntu / Debian:**
```bash
sudo apt install -y gcc make git stockfish libwebsockets-dev libjson-c-dev
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

---

## Setup

```bash
# Clone
git clone https://github.com/YOUR_USERNAME/chess-coach.git
cd chess-coach

# Build C backend
cd backend
make

# Install frontend dependencies
cd ../frontend
npm install
```

---

## Run

Open two terminals:

**Terminal 1 — backend:**
```bash
cd backend
./chess-coach-backend
```

**Terminal 2 — frontend:**
```bash
cd frontend
npm run dev
```

Open **http://localhost:5173** and start playing.

---

## Project structure

```
chess-coach/
├── backend/
│   ├── main.c          # WebSocket server + request handler
│   ├── stockfish.c     # fork/pipe/UCI interface
│   ├── stockfish.h
│   ├── board.c         # FEN + move applicator
│   ├── board.h
│   ├── analysis.c      # two-pass threat detection
│   ├── analysis.h
│   ├── coach.c         # eval → human language
│   ├── coach.h
│   └── Makefile
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── EvalBar.jsx
│   │   │   ├── EvalTimeline.jsx
│   │   │   ├── CoachPanel.jsx
│   │   │   └── MoveList.jsx
│   │   └── hooks/
│   │       └── useWebSocket.js
│   └── package.json
└── README.md
```

---

## How threat detection works

After every move, the backend runs two Stockfish passes:

```
Pass 1 → position FEN → go movetime 800 → bestmove   (your best move)
Pass 2 → apply that move → go movetime 400 → bestmove (opponent's threat)
```

Pass 2 is the red arrow — what your opponent will do if you don't find the right plan.

---

## Coach advice logic

| Eval | Message |
|------|---------|
| Mate in 1–2 | Forced win — execute it |
| +3.00 and above | Winning — trade pieces, simplify |
| +1.00 to +3.00 | Press the advantage |
| ±1.00 | Equal — development and king safety |
| -1.00 to -3.00 | Seek counterplay |
| Below -3.00 | Look for a tactical shot |

---

## Roadmap

- [ ] Post-game blunder/mistake/inaccuracy report
- [ ] Opening recognition (detect and name the opening)
- [ ] PGN export
- [ ] Adjustable Elo slider (1200 → 2800)
- [ ] Endgame technique module

---

## License

MIT
