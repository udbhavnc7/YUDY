# YUDY — Scene and Camera

The camera is the navigation system. This document is the contract for how
scroll drives it, and how each zone handles hover and click. One module owns
the camera; nothing else moves it directly.

## 1. Scroll-to-waypoint mapping

Normalize scroll to a single progress value, 0 to 1. Map that progress to
authored camera waypoints — never drive position directly from scroll.

```ts
export type Waypoint = {
  id: string;
  position: [number, number, number];
  target: [number, number, number];
  fov?: number;
  easing?: string;      // gsap easing string
};

export type Zone = {
  id: string;
  range: [number, number];     // [start, end) of the 0–1 scroll progress
  waypoints: Waypoint[];       // interpolated across the zone's range
};
```

**Never** `camera.position.y = scrollProgress * someConstant`. That produces
the "robotic elevator" feel this project is explicitly trying to avoid. Use
smooth interpolation between authored waypoints (Catmull-Rom or a GSAP
timeline scrubbed by scroll progress), with easing, so it feels like a camera
operator moving deliberately rather than a scrollbar wearing a 3D costume.

Starting scroll ranges (tune these visually — they are not fixed):

| Zone | Range | Note |
|---|---|---|
| Lamp / intro | 0.00–0.10 | Lamp glows on, name appears |
| Chair / identity | 0.10–0.22 | Twirl transition |
| Sofa / education | 0.22–0.32 | Two pillows |
| Poster wall / achievements | 0.32–0.47 | Widest zone — most content to browse |
| Solo books | 0.47–0.62 | |
| Group books | 0.62–0.74 | |
| Plants / showcase | 0.74–0.87 | Calmer pacing, transition from work to person |
| Final reveal | 0.87–1.00 | Pull back to the whole room |

Some zones should breathe longer than others — don't give every zone equal
scroll distance by default. The achievement wall, with the most items to
browse, earns more room than the chair transition.

## 2. Per-zone interaction pattern

Consistent across posters, books, and showcase objects:

- **Hover:** the object responds physically — a poster brightens and its
  status border sharpens, a book shifts subtly forward, a showcase object
  gets a small focus pull. A small readable label appears, anchored to the
  object's screen position.
- **Click:** a contextual detail panel opens, anchored near the object —
  never a full-screen or centered modal. It should feel like the room handed
  you a piece of paper, not like a website interrupted itself.
- **Scope:** an object is only interactive while its zone owns the camera.
  This falls out naturally from the waypoint system — a poster isn't in
  frame once the camera has moved to the bookshelf, so it isn't hoverable
  either. Don't add extra gating logic beyond what the camera position
  already implies.

## 3. The chair as transition device

The chair is both an object (identity) and a mechanism (it points the camera
toward the sofa next). Its rotation should feel like a real object with mass:

- Slow angular acceleration in, slow deceleration out — never a linear spin.
- Driven by scroll progress within its zone, not by time, so it stays in
  sync with an impatient or a slow scroller alike.
- The camera's target drifts to follow the chair's facing direction as it
  turns, so the rotation itself does the work of redirecting attention to the
  sofa — no separate "look here" cue needed.

## 4. Cursor states

Minimal, never a giant glowing circle:

- Default — small, understated.
- Interactive — a subtle ring or indicator when hovering anything clickable.
- Per-zone focus states (book, poster, showcase object) can shift the cursor
  slightly, but keep the change subtle enough that it reads as polish, not as
  a UI element competing with the room.

## 5. Final reveal

The camera pulls back and/or rises until the whole composed room is in frame
— lamp, chair, sofa, poster wall, both bookshelves, plants, showcase, all
visible together. This is the moment the visitor understands the whole site
was one room. The closing overlay is minimal: name, field of study, and
GitHub/LinkedIn/email. No footer, no site map, no "thanks for visiting."

## 6. Mobile

Desktop is the primary cinematic experience; mobile must still function, not
attempt to reproduce it literally:

- Simplify the camera path — fewer intermediate waypoints, more direct moves.
- Hover doesn't exist on touch: tap reveals what hover would have shown, a
  second tap (or a visible close affordance) dismisses it.
- Reduce simultaneous real-time lights and shadows; lean more on baked
  lighting than desktop does.
- Lower DPR further than desktop's cap.
- Preserve the zone order and the story beats — cut fidelity before cutting
  narrative.
