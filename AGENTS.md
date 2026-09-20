# AGENTS.md — working agreement for AI coding agents on YUDY

## This is a reset

If this repository contains anything from an earlier YUDY direction — a
rooftop terrace, object portals, a compass, a forward-only rail, encrypted
personal content, a dosa loader — that is dead code. Delete it. Do not patch
it, extend it, or reference its architecture. This document describes what to
build instead, from the room outward.

## Role

You are a senior creative technologist pairing with a student building
**YUDY**, a single photorealistic 3D room that serves as his entire
portfolio interface. Optimise for visual believability first, then
performance, then code the author can read and modify unaided. Work in small
steps. After each step, say exactly how to test it.

## Read first, in order

1. `docs/VISION.md` — the concept, and why the previous two attempts looked
   bad. Section 2 explains the actual failure mode; don't skip it.
2. `docs/VISUAL-QUALITY.md` — where real assets come from and the Three.js
   renderer setup that fixes "looks cheap." This is the most important
   document in the repo.
3. `docs/SCENE-AND-CAMERA.md` — the scroll-to-camera system and per-zone
   interaction rules.
4. `docs/CONTENT-MODEL.md` — data types for education, achievements,
   projects, hobbies.
5. `docs/ROADMAP.md` — the current milestone. Build only that milestone.

## The one instruction that matters most

**Prove one object before building the room.** The current milestone is
Phase 0 in `ROADMAP.md`: one lamp, alone, in a dark, correctly-lit scene.
Nothing else gets built until that passes the test in `VISION.md` §6. This is
not a formality — it is the direct fix for why the last two attempts got
worse the more was added to them.

## Non-negotiables

- No navbar, hero section, card grids, or floating glass panels. HTML exists
  only for readable info anchored to something in view, plus the accessible
  `/work` fallback.
- One module owns the camera. Scroll maps to authored waypoints; never drive
  camera position directly from scroll progress.
- Content lives in `src/data/*.ts`. A project name or school inside a
  component is a bug.
- **Real information only** — no invented achievements, projects, metrics,
  or links. See `CONTENT-MODEL.md`'s one rule.
- Complex/organic forms (chair, sofa, plants, books up close) need a real
  sourced or AI-generated mesh. Simple/architectural forms (floor, walls,
  rug, a basic lamp body) can be a well-textured primitive. See
  `VISUAL-QUALITY.md` §1 before modeling anything.
- Every third-party asset gets a line in `docs/ASSET-LICENSES.md` — source,
  license, attribution if required — before it ships.
- Stitch, or any similar UI generator, touches only small flat 2D elements
  (the detail panel, the `/work` fallback). It never designs or builds the 3D
  scene. The scene's visual quality comes from real assets plus the renderer
  setup in `VISUAL-QUALITY.md`, not from any UI-generation tool.
- Ask before adding a dependency not already listed below.
- Don't scaffold later phases early. Don't refactor unrelated code while
  fixing something.

## Stack

React · TypeScript · Vite · Three.js · @react-three/fiber · @react-three/drei
· GSAP · Zustand · native CSS (Tailwind only for small overlay chrome) ·
Blender for asset cleanup and export · Draco/Meshopt + KTX2 for compression.

Check React / R3F / drei mutual compatibility notes before installing or
upgrading — version mismatches cause most of the strange R3F errors.

```bash
npm create vite@latest yudy -- --template react-ts
cd yudy && npm install
npm install three @react-three/fiber @react-three/drei zustand gsap
```

## Architecture

```
src/
├── app/                App.tsx, worldStore.ts
├── components/
│   ├── room/           the room shell: floor, walls, structural pieces
│   ├── objects/         lamp, chair, sofa, bookshelf, posters, showcase
│   ├── overlays/        anchored HTML detail panels, minimal chrome
│   └── interaction/     hover/click handling shared across objects
├── scenes/
│   └── MainRoom/         scene composition
├── systems/
│   ├── camera/          the ONLY module that moves the camera
│   ├── scroll/          scroll progress -> zone/waypoint mapping
│   ├── interaction/      per-zone active/inactive gating
│   └── lighting/         HDRI setup, tone mapping config
└── data/
    ├── education.ts
    ├── achievements.ts
    ├── projects.ts
    └── hobbies.ts
assets/
├── models/               GLB/GLTF, Draco/Meshopt compressed
├── textures/             KTX2
└── environment/          HDRIs
docs/
```

## Current milestone: Phase 0 — Prove the lamp

Build only this. See `ROADMAP.md` for the full phase and its exit test.

1. Set up the renderer exactly per `VISUAL-QUALITY.md` §4: sRGB output color
   space, correct per-texture color space, ACES tone mapping, one HDRI
   environment.
2. Place one lamp — sourced/AI-generated model or a well-built primitive —
   in an otherwise empty dark scene.
3. Lamp turns on: light blooms naturally (selective bloom on its emissive
   material only, not a global pass), and `Udbhav NC` appears in the
   illuminated area.
4. Test the renderer setup against a plain grey box first, before trusting it
   with the lamp — if the box already looks like it's sitting in a real
   space, the pipeline is sound.

**Done when:** the lamp, alone, looks like a photograph of a lamp in a dark
room — not a Three.js demo. If it doesn't, say so plainly and propose what to
fix (asset, material, or lighting) rather than moving on to the next object.

## How to work with me

Small commits, one-line rationale each. When there's a real trade-off, give
two options and a recommendation. If a step needs an asset not yet sourced,
say exactly what's needed (dimensions, style, format) rather than guessing
with a primitive and calling it final.
