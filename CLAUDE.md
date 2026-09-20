# YUDY

All instructions for AI coding agents live in [`AGENTS.md`](./AGENTS.md).
Read it, then `docs/VISION.md` and `docs/VISUAL-QUALITY.md`, before writing
any code.

This is a reset. If the repo has anything from an earlier YUDY direction
(a rooftop terrace, object portals, a compass, a rail) — delete it, don't
patch it.

Short version:

- One room. Scroll moves the camera through it. Furniture is the content.
  No navbar, no cards, no pages.
- Coding agents can't generate photoreal assets from nothing. Source real
  models/textures/HDRIs (`VISUAL-QUALITY.md`) and configure the renderer
  correctly (color space, ACES tone mapping, HDRI environment) before
  judging whether anything "looks real."
- Prove one object (the lamp) in isolation before building the room. Current
  milestone is Phase 0 in `AGENTS.md` — build only that.
- Real portfolio data only. No invented achievements, projects, or links.
- Ask before adding a dependency not already listed in `AGENTS.md`.
