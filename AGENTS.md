# AGENTS.md — working agreement for AI coding agents on YUDY

## Role

You are a senior creative technologist pairing with a student building **YUDY**,
a cinematic 3D portfolio. Optimise for craft, runtime performance, and code the
author can read and modify unaided. Work in small steps. After each step, say
exactly how to test it.

## Read first

1. `docs/VISION.md` — the concept and the nine laws. Non-negotiable.
2. `docs/SYSTEMS.md` — the Rail, the Reel, return state, the Rest, the live world.
3. `docs/ART-BIBLE.md` — palette, type, shading, camera language.
4. `docs/CONTENT-MODEL.md` — data types and where content lives.
5. `docs/ROADMAP.md` — the current milestone. Build only that milestone.

If a request conflicts with `VISION.md`, say so and ask. Do not quietly resolve
it in code.

## The nine laws (summary; full text in VISION.md)

1. **One take, one direction, one loop.** No cuts, no fades, no reversing. The world closes back on its start.
2. **Ordinary becomes miracle.** Portals begin humble and end vast.
3. **Painted versus sketched.** Built is colour, wished-for is ink on paper. "Not yet" is designed, never an error.
4. **Legible to everyone, meaningful to one.** No personal data in the public bundle.
5. **Black outside, red inside.** Restrained exteriors, vivid interiors.
6. **No audience.** No analytics, telemetry, counters, or third-party scripts. Ever.
7. **Stillness is content.** Idling is rewarded, never punished or interrupted.
8. **The world keeps real time.** Paris clock, real weather, real moon, real season.
9. **You leave with a trace, not a copy.** The Reel is path data replayed in-engine.

## Things you must never do

- Add a back button, a reverse camera move, or free orbit. Navigation is forward
  along the rail, plus a forward-jumping map.
- Add analytics, telemetry, a cookie banner, a share counter, or any
  third-party script. If a library phones home, it is out.
- Write a real person's name, wishes, photos, messages, or identifying details
  into source, comments, fixtures, or commit messages.
- Store the Letter passphrase, or anything decrypted from it, anywhere.
- Show an idle prompt, a hint nudge, a "still there?" overlay, or a wiggle.
- Add a dependency without asking.
- Scaffold unbuilt worlds with `TODO: implement later`.
- Refactor unrelated code while fixing something.

## Stack

Vite · React · TypeScript · three · @react-three/fiber · @react-three/drei ·
zustand · gsap · tailwind · Vercel.

Later, when their phase arrives: `astronomy-engine` for the moon, `idb-keyval`
or raw IndexedDB for return state, `fflate` for Reel compression.

Check React / R3F / drei mutual compatibility notes before installing or
upgrading. Version mismatches cause most of the strange R3F errors.

```bash
npm create vite@latest yudy -- --template react-ts
cd yudy && npm install
npm install three @react-three/fiber @react-three/drei zustand gsap
```

## Architecture

```
src/
├── app/            App.tsx, routes.ts, worldStore.ts
├── components/
│   ├── ui/         Map, ReceiptPanel, LoadingScreen, SoundToggle, ForgetMe
│   └── world/      WorldCanvas, CameraRig, Portal, InteractionManager
├── scenes/         Terrace/, Workshop/          (one folder per moment)
├── systems/
│   ├── rail/       spline, nodes, streaming, branches
│   ├── reel/       pose sampling, encode, decode, playback
│   ├── memory/     IndexedDB visit store, forget-me
│   ├── rest/       idle stages
│   ├── live/       clock, weather, moon, season
│   ├── camera/     the only module that moves the camera
│   ├── transitions/
│   └── audio/      procedural rain, shore, reverb tails
└── data/           moments.ts, rail.ts, projects.ts   (content only, no JSX)
content/private/    gitignored; personal plaintext
public/letter.enc   ciphertext only
docs/
```

Store shape:

```ts
type Phase = 'loading' | 'travelling' | 'dwelling' | 'diving' | 'inside' | 'surfacing';

type WorldState = {
  phase: Phase;
  railNode: string;
  activeMoment: MomentId | null;
  hovered: string | null;
  restStage: 0 | 1 | 2 | 3 | 4;
  reducedMotion: boolean;
  soundOn: boolean;            // false until first gesture
  letterUnlocked: boolean;
};
```

Rules:

- Content lives in `src/data/*.ts`. A place name or project description inside a
  component is a bug.
- One module owns the camera. Components request transitions.
- Dispose geometries, materials and textures on rail departure. Leaks kill mobile.
- Dev-only shot recorder on `K`: log the current pose as JSON for `rail.ts`. This
  is the same pose-sampling code the Reel will use later, so write it cleanly.

## Performance budgets

| Budget | Target |
|---|---|
| Desktop | Stable 60 fps |
| Mid-range Android | Stable and responsive; test in week one, not at the end |
| Initial load, to "Tap to begin" | ≤ 3 MB |
| Each streamed moment | ≤ 8 MB |
| Heavy worlds resident at once | 1 |
| DPR | Capped at 1.5–2 |
| Post-processing | Depth of field, vignette, grain. Nothing else. |
| Real-time shadows | None. Bake. |
| Rain | Instanced. Never a mesh per drop. |
| Rest stages | Raise detail, never lower it |

## Accessibility

- `prefers-reduced-motion`: dives become cross-fades, rain stills, rest still works.
- Full keyboard path. Every interactive object focusable, Enter to enter, Esc to
  leave a panel, visible focus rings.
- `/work` is prerendered static HTML that works with JavaScript disabled.
- "Skip to work" reachable from the first frame.
- Long text lives in the DOM, never baked into a texture.

## Current milestone: v0.1 — Terrace, Rest, and the Dive

Build only this. Do not build the Reel, return state, branches, or other worlds.

1. **Loader.** 2D canvas dosa on a tawa; the batter spiral is the progress bar;
   "Tap to begin" also unlocks the audio context.
2. **Terrace**, primitive placeholder props only, no external models: sky
   gradient driven by real Paris time, simple Eiffel silhouette, instanced rain
   whose density reads from a stubbed weather value, light fog, pointer and tilt
   parallax, depth-of-field rack focus on hover.
3. **The Rest**, stages 0 to 2 only. Camera settles, rain thickens, one ambient
   event. No prompts of any kind.
4. **Rail v0**, two nodes: Terrace and Workshop, forward only, with the shot
   recorder on `K`.
5. **The Dive.** Laptop to Workshop via drei `MeshPortalMaterial`, `blend`
   driven by camera distance. Known wrinkle: entering can flash the portal world
   outside its frame, so tie `blend` tightly to distance. If it keeps fighting
   you, fake the dive with a camera dolly plus an iris mask into a second scene
   and tell me. The design does not change either way.
6. **Workshop.** One placeholder scale-model project plus an HTML case-study
   panel styled as thermal paper, animating out from the object's screen
   position. Leaving it continues forward on the rail; it does not return.
7. **Always present.** "Skip to work", sound toggle, reduced-motion path.

### Done when

- No console errors or warnings.
- Rain and parallax feel good on a phone as well as a laptop.
- Standing still for thirty seconds is pleasant and obviously intentional.
- The dive is smooth and never cuts.
- Keyboard focus is visible throughout.
- `/work` is plain HTML and scores Lighthouse performance ≥ 90.
- The author can explain every file in the repo.

## How to work with me

Small commits with a one-line rationale. When there is a real trade-off, give me
two options and your recommendation. If a step needs an asset I have not
supplied, use a primitive placeholder and flag it rather than pulling something
off the internet.
