# YUDY

An unfinished world.

One continuous shot through a world that keeps real time, remembers you without
watching you, and can never be walked backwards. It starts on a Paris rooftop in
the rain, dives through the objects on a table, and comes back to the same
terrace at night. You leave with a four-kilobyte trace of your path that only
becomes a film inside the world it came from.

## Docs

| File | What it is |
|---|---|
| [`docs/VISION.md`](docs/VISION.md) | The concept and the nine laws. Read first. |
| [`docs/SYSTEMS.md`](docs/SYSTEMS.md) | The Rail, the Reel, return state, the Rest, the live world. |
| [`docs/ART-BIBLE.md`](docs/ART-BIBLE.md) | Palette, type, shading, camera language. |
| [`docs/CONTENT-MODEL.md`](docs/CONTENT-MODEL.md) | Data types, the Letter, privacy handling. |
| [`docs/ROADMAP.md`](docs/ROADMAP.md) | Ten phases with exit criteria. |
| [`AGENTS.md`](AGENTS.md) | Working agreement for AI coding agents. |

`CLAUDE.md` and `GEMINI.md` point at `AGENTS.md`, so Claude Code, Gemini,
Antigravity and Cursor all start from the same brief.

## The nine laws

1. One take, one direction, one loop.
2. Ordinary becomes miracle.
3. Painted versus sketched.
4. Legible to everyone, meaningful to one.
5. Black outside, red inside.
6. No audience.
7. Stillness is content.
8. The world keeps real time.
9. You leave with a trace, not a copy.

## Setup

```bash
npm create vite@latest yudy -- --template react-ts
cd yudy && npm install
npm install three @react-three/fiber @react-three/drei zustand gsap
npm install -D tailwindcss @tailwindcss/vite
npm run dev
```

Check React / R3F / drei compatibility notes before installing or upgrading.

## Repo layout

```
src/
├── app/            App.tsx, routes.ts, worldStore.ts
├── components/
│   ├── ui/         Map, ReceiptPanel, LoadingScreen, SoundToggle, ForgetMe
│   └── world/      WorldCanvas, CameraRig, Portal, InteractionManager
├── scenes/         Terrace/, Workshop/
├── systems/        rail/ reel/ memory/ rest/ live/ camera/ transitions/ audio/
└── data/           moments.ts, rail.ts, projects.ts
content/
├── case-studies/   markdown, committed
└── private/        GITIGNORED, never committed
public/letter.enc   ciphertext only
docs/
```

## No audience

No analytics, no telemetry, no counters, no cookie banner, no third-party
scripts. Whatever the world remembers about a visitor lives on that visitor's
own device, and a visible control erases it. This is Law 6 and it is not
negotiable for a metric.

## Privacy

No personal data about any real person ships in the public bundle. Personal
content lives in `content/private/` (gitignored) and is committed only as
AES-GCM ciphertext. The private route is `noindex`. See §9 of `VISION.md`.

Add to `.gitignore` before the first commit:

```
content/private/
*.plain.json
.env*
```

## Accessibility route

`/work` is a prerendered static page styled as a receipt. It works with
JavaScript disabled and is reachable from the first frame. It is also what lets
Law 1 stay uncompromising.

## Current milestone

v0.1 — Terrace, the Rest, and the Dive. See `AGENTS.md`.
