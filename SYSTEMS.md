# YUDY — Systems

Technical specification for the five systems that carry the concept. Each one
exists because of a law in `VISION.md`. Build them in the order given in
`ROADMAP.md`.

---

## 1. The Rail (Law 1)

An authored spline through the entire world, with branch points. The camera
travels along it forward only.

```ts
export type RailNode = {
  id: string;
  momentId: MomentId | null;   // null = travel segment between moments
  enter: Shot;                 // pose on arrival
  rest: Shot;                  // pose while dwelling
  exit: Shot;                  // pose at departure
  next: string[];              // 1 entry = linear, 2 = branch point
  preloadAhead: string[];      // asset bundles to stream while approaching
  disposeBehind: string[];     // bundles to free on departure
};
```

Rules:

- The camera is owned by one module. Nothing else touches it.
- `next` is forward only. There is no `previous`. The last node's `next` points
  at the terrace node, closing the loop.
- The map UI can jump to any node reachable forward, which after the loop closes
  means any node at all.
- Poses come from the shot recorder, never hand-typed.

**Streaming.** Because the next one or two nodes are always known, load their
bundles during the current dwell and dispose everything behind. Target one heavy
world resident at a time. This is the performance win that pays for the whole
design.

**Branches.** A branch node offers two continuations, `calm` and `wild`. Record
the choice into the visit trace. Nobody sees both in one pass.

---

## 2. The Reel (Law 9)

### Recording

Sample at 10 Hz while the camera moves, plus event markers.

```ts
export type ReelEvent =
  | { t: number; k: 'enter'; node: string }
  | { t: number; k: 'branch'; node: string; took: 'calm' | 'wild' }
  | { t: number; k: 'dwell'; node: string; ms: number }
  | { t: number; k: 'open';  moment: MomentId }
  | { t: number; k: 'knock'; moment: MomentId };

export type Reel = {
  v: 1;
  started: string;             // ISO, rounded to the hour, never finer
  sky: { paris: string; weather: string; moon: number };  // world conditions
  poses: Float32Array;         // [t, px,py,pz, tx,ty,tz, fov] * n, quantised
  events: ReelEvent[];
};
```

Quantise positions to 2 decimals and time to 10 ms. A three-minute visit lands
around 3 to 5 KB before compression.

### Playback

The engine re-performs the trace. It is not video.

- Reconstruct the pose stream with Catmull-Rom interpolation.
- Cut on `dwell` events longer than 2 s. Those are the visitor's own edit points.
- Restore the recorded sky conditions, so the Reel plays in the weather it was
  made in, not today's.
- Playback runs at 1.4x with the slow parts held, which turns a three-minute
  visit into roughly forty seconds.

### Sharing

- URL: deflate the Reel, base64url it, put it in the `#fragment`. Never a query
  string, so it never reaches a server.
- File: `*.reel`, which does nothing outside this world.
- Optional MP4 via `MediaRecorder` on the canvas, offered as a lesser copy and
  labelled as one.

### Order of work

The dev shot recorder built in Phase 2 is the same code. Write the pose-sampling
layer once and use it for authoring first, then expose it to visitors in
Phase 6.

---

## 3. Return state (Law 6 and Law 8)

IndexedDB, origin-local, never transmitted.

```ts
export type Visit = {
  v: 1;
  visits: number;
  lastAt: string;              // ISO hour
  seen: MomentId[];
  skipped: MomentId[];
  branches: Record<string, 'calm' | 'wild'>;
  dwellMs: Record<MomentId, number>;
  knocked: MomentId[];
  tape: string | null;
  letterUnlocked: boolean;     // never stores the passphrase or the plaintext
};
```

What it changes on return, and nothing more:

| Signal | Effect |
|---|---|
| `skipped` non-empty | The map offers a skipped moment first |
| `tape` set | The deck is already cued |
| Highest `dwellMs` | A nearby unopened door glows faintly |
| `knocked` | Those doors carry a pencil note in the margin |
| `visits > 1` | The terrace opens at the visitor's real local hour |

Hard rules:

- A visible **forget me** control wipes the store and says so.
- No fingerprinting, no IDs, no hashing of anything identifying.
- Never store the passphrase, decrypted Letter content, or anything derived from
  it beyond the single `letterUnlocked` boolean.
- The site states in plain language, in the footer and on `/work`, that nothing
  leaves the device.

---

## 4. The Rest (Law 7)

An inverted idle system. Most apps degrade on idle. This one invests.

```ts
const REST_STAGES = [
  { afterMs:  8000, do: 'camera settles, breathing amplitude halves' },
  { afterMs: 16000, do: 'rain density +30%, drop ticks slow' },
  { afterMs: 30000, do: 'an ambient event fires (shutter, train, bell)' },
  { afterMs: 60000, do: 'the light moves one notch toward the next hour' },
  { afterMs:120000, do: 'a rare event, once per visit maximum' },
];
```

- Any pointer, key, or touch input resets to stage 0, smoothly, never with a snap.
- Rest raises the detail budget rather than lowering it. The frame is cheap when
  nothing is moving, so spend it.
- Never show a prompt, a hint, a wiggle, or a "still there?" overlay.
- One legibility cue only: the rain answers within the first stage, so the
  visitor learns that stopping does something.
- Rest is suspended during dives and while an HTML panel is open.

---

## 5. The Live World (Law 8)

| Source | Use | Fallback |
|---|---|---|
| Local clock, `Europe/Paris` | Sun position, terrace hour, window lights | System clock |
| Open-Meteo (check its terms) | Rain density, cloud, wind on the streaks | Cached last value, then "light rain" |
| `astronomy-engine`, computed client-side | Real moon phase and altitude in Night | Computed, no network needed |
| Date | Season: bare trees, spring in the London door, January light | Always available |

Rules:

- Every network source is optional. The world must be beautiful offline.
- Cache weather for 30 minutes in `localStorage`. No key in the client; if a
  source needs one, put it behind a Vercel function.
- Record the resolved conditions into the Reel so playback stays truthful.
- Sunrise and sunset drive the grade continuously, not in three presets.

---

## 6. Two sides (branch design)

Every branch offers the same destination by two temperaments.

| | Calm | Wild |
|---|---|---|
| Camera | Slow, low, steady | Faster, handheld float, more roll |
| Audio | Panned left, long reverb | Panned right, close and dry |
| Light | Even, soft | Contrasted, rim-lit |
| Rest behaviour | Reaches stage 4 sooner | Ambient events are louder, rarer |

Author branches in pairs, never as a main route with a variant. If one side is
clearly better, it is not a branch, it is the route.
