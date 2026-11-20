# YUDY — Roadmap

One phase at a time. Do not start a phase until the previous one passes the
test in `VISION.md` §6, on the actual running scene — not on how convincing
the plan sounds.

---

## Phase 0 — Prove the lamp

Before the room, before the chair, before anything else: one object, alone,
in the dark.

1. Empty scene. Renderer configured per `VISUAL-QUALITY.md` §4 — color space,
   ACES tone mapping, one Poly Haven HDRI as environment.
2. One lamp: either a sourced/AI-generated model, or a well-built primitive
   (cylinder base, tapered shade, warm emissive material) per the primitive
   rule in `VISUAL-QUALITY.md` §1.
3. The lamp turns on: light blooms naturally, `Udbhav NC` appears in the
   illuminated area.

**Exit:** does this one object, by itself, look like a photograph of a lamp
in a dark room, or like a Three.js demo? If it still looks fake, fix
materials, lighting, or the asset itself here. Do not add a second object
until this passes. This single gate is the fix for both previous failed
attempts.

---

## Phase 1 — Room shell

Floor, walls, chair, sofa, bookshelf silhouette — placed, lit, no
interactivity yet, no real content. Non-interactive scroll camera moving
through all eight waypoint zones per `SCENE-AND-CAMERA.md`.

**Exit:** the same photograph-or-demo test, now for the whole shell. Depth
should already read: foreground, midground, background distinctly separated
by focus and light, not just distance.

---

## Phase 2 — Identity and education

Lamp intro copy and typography. Chair twirl transition, eased and
scroll-synced. Sofa pillows with real education data (school, college) on
hover.

**Exit:** the chair's rotation feels like it has mass. The pillow text is
legible and correctly sourced from `education.ts`.

---

## Phase 3 — Achievements

Poster wall, real achievement data, the three-color status glow, hover and
click interaction. Posters interactive only while their zone owns the camera.

**Exit:** gold/navy/emerald borders read clearly at a glance without looking
neon. Every poster's status matches real results — check this against actual
history before shipping a single one.

---

## Phase 4 — Solo projects

Bookshelf, real project data, hover-forward and click-to-open interaction,
GitHub and live links working.

**Exit:** every book's data is real. No placeholder project ships to
production.

---

## Phase 5 — Group projects

Oversized books, credited to VAPORLOGIC, same interaction pattern, visually
distinct scale from the solo shelf.

**Exit:** same real-data bar as Phase 4.

---

## Phase 6 — Hobbies and showcase

Plants and hanging greenery as a calmer transition; showcase objects
representing actual hobbies and interests, hover/click interaction.

**Exit:** the pacing genuinely feels calmer here than in the project zones —
test this by feel, not by a fixed scroll-distance number.

---

## Phase 7 — Final reveal

Camera pulls back to the whole room. Minimal closing overlay: name, field of
study, GitHub/LinkedIn/email.

**Exit:** every zone built in Phases 1–6 is visible and recognizable together
in this one shot.

---

## Phase 8 — Mobile and performance

Simplified mobile camera path, tap-based interaction, reduced lighting
complexity, Draco/Meshopt/KTX2 compression, lazy-loading and disposal per
zone, accessible `/work` fallback route with all real content in plain HTML.

**Exit:** a cold load on a mid-range Android over 4G is usable, and every
piece of content is reachable with JavaScript-only assumptions removed for
the fallback route.

---

## Deliberately out of scope for v1

Multiple rooms. A CMS. A database. Anything that requires knowing what
visitors did. Audio, until the room itself is proven — it's explicitly
optional and shouldn't block any phase above.
