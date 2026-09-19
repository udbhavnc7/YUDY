# YUDY — Roadmap

One phase at a time. A phase is finished when its exit criteria pass on a
mid-range Android phone, not on the development laptop.

---

## Phase 0 — Art bible, no code

Palette tokens, type pairing plus two handwriting faces, and four concept
frames: Terrace at golden hour, Workshop mid-explode, a sketched door, Terrace
at night with the unopened objects.

**Exit:** the frames exist and you would be happy to post them as-is.

---

## Phase 1 — Terrace, live, at rest

Vite, React, TS, R3F. Dosa loader. Terrace with primitive props: sky gradient
driven by real Paris time, Eiffel silhouette, instanced rain, fog, pointer and
tilt parallax, rack focus on hover. The Rest, stages 0 to 2.

**Exit:** the terrace holds attention for sixty seconds with nothing to click,
and standing still is visibly rewarded. If it does not, fix the mood before
adding anything.

---

## Phase 2 — The Rail and the Dive

Rail v0 with two nodes and forward-only travel. Shot recorder on `K`, written as
the reusable pose-sampling layer the Reel will need later. Laptop to Workshop
through `MeshPortalMaterial` with `blend` driven by camera distance. Leaving the
Workshop continues forward. Reduced-motion cross-fade path.

**Exit:** ten dives in a row with no flash, no stutter, no warnings. Nothing
anywhere in the codebase moves the camera except the camera module.

---

## Phase 3 — Paper layer and the recruiter route

Thermal-paper receipt panels animating from the object's screen position.
Prerendered static `/work`. Postcard contact form. The forget-me control and the
plain-language "nothing leaves your device" line, even though there is nothing
to forget yet.

**Exit:** `/work` works with JavaScript disabled and scores Lighthouse
performance ≥ 90. Full keyboard traversal.

---

## Phase 4 — Painted versus sketched, and the map

Sketch shader. The Wish Map as a forward-jumping navigator. Three "not yet"
doors with knock, crack, spill, close. The loop closes: the last rail node
returns to the terrace at night.

**Exit:** a stranger meeting a closed door reads it as intentional, and a
stranger who wants to reach a specific moment finds it in under fifteen seconds
without a back button. Test both on actual strangers.

---

## Phase 5 — Sound and the live world

Procedural rain, shore, and per-world reverb tails. Weather and moon wired in
with offline fallbacks. Rest stages 3 and 4. Cassette embeds.

**Exit:** muted, nothing breaks. Unmuted, five minutes of rain stays pleasant.
Offline, the world is still beautiful.

---

## Phase 6 — The Reel and return state

Visitor-facing Reel recording, encoding, playback, and fragment sharing.
IndexedDB visit store with the four small acts as its manners. Forget-me wired
for real.

**Exit:** a three-minute visit produces a trace under 5 KB that replays as a
film someone would send to a friend. A second visit is noticeably different, and
nobody can tell you what a visitor did, because nothing left their machine.

---

## Phase 7 — The Letter

Encryption script, unlock flow, interior re-grade, moon line, fireflies, private
doors, her authoring view. `noindex` on the private route.

**Exit:** the public bundle, searched byte by byte, contains nothing personal.
A wrong passphrase fails cleanly. She has seen it, is happy with it, and has
added her first door.

---

## Phase 8 — Worlds, one per release

Each release moves one moment from door to colour. Suggested order:

1. **Night** — real moon, aurora, fireflies. Dry, per the Bhandardara note.
2. **Kashi** — dawn from the far bank; the ghats face east, so the light is
   behind the city at sunrise.
3. **Kochi** — a rain alley with the UI stripped away, so you actually get lost.
4. **Sasihithlu** — the first true branch, calm side and wild side.
5. **Hampi and Rajasthan** — stone, long reverb, a mirror hall built from
   architecture and light rather than film reference.
6. **Riverbank**, **Sound Room**, **Postcards** as time allows.

**Exit per world:** passes the thumbnail test on lighting alone, stays inside
the 8 MB streaming budget, and adds a verb no other painted moment owns.

---

## Phase 9 — Launch

Real-device pass across three phones. Error boundaries and a graceful
WebGL-unsupported fallback built from the concept frames. OG image. `noindex` on
the private route. Asset licences recorded. The no-audience statement in the
footer.

**Exit:** a cold load on a mid-range Android over 4G reaches "Tap to begin" in
under four seconds, and the first Reel you send to someone gets a reply.

---

## Deliberately out of scope for v1

All eight worlds at once. Multiplayer. Physics. VR. A CMS. A database. Any
feature that requires knowing what visitors did.
