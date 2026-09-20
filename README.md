# YUDY

A portfolio represented as one photorealistic interior room. Scrolling moves
a real, authored camera through it. The furniture is the content — a lamp is
the intro, a chair is a transition, a sofa is education, a poster wall is
achievements, two bookshelves are solo and group projects, a showcase is
hobbies, and a final pull-back reveals the whole room at once.

Built by Udbhav NC.

## Start here

| File | What it is |
|---|---|
| [`docs/VISION.md`](docs/VISION.md) | The concept, and why the last two attempts looked bad. Read this first. |
| [`docs/VISUAL-QUALITY.md`](docs/VISUAL-QUALITY.md) | Where real 3D assets come from, and the renderer setup that fixes "looks cheap." The most important doc here. |
| [`docs/SCENE-AND-CAMERA.md`](docs/SCENE-AND-CAMERA.md) | Scroll-to-camera-waypoint system and per-zone interaction. |
| [`docs/CONTENT-MODEL.md`](docs/CONTENT-MODEL.md) | Data types for education, achievements, projects, hobbies. |
| [`docs/ROADMAP.md`](docs/ROADMAP.md) | Phases, starting with proving one object before building the room. |
| [`AGENTS.md`](AGENTS.md) | Working agreement for AI coding agents. |

`CLAUDE.md` and `GEMINI.md` point at `AGENTS.md`.

## The one thing to internalize before building anything

Coding agents write code. They cannot sculpt a couch or bake a lamp's
material. A believable room needs real assets sourced from somewhere (see
`VISUAL-QUALITY.md`) plus a correctly configured renderer (color space, tone
mapping, HDRI environment) — that combination is what separates "photoreal"
from "blocky," not a longer prompt asking an agent to try harder.

## Setup

```bash
npm create vite@latest yudy -- --template react-ts
cd yudy && npm install
npm install three @react-three/fiber @react-three/drei zustand gsap
npm run dev
```

## Stack

React · TypeScript · Vite · Three.js · @react-three/fiber · @react-three/drei
· GSAP · Zustand · native CSS · Blender

## Current milestone

Phase 0 — prove one lamp, alone, in a dark, correctly lit scene, before
building anything else. See `AGENTS.md`.
