# YUDY — Vision v2

> Read this before writing any code. Everything else in `docs/` follows from it.

---

## 0. The honest part, first

Features can be copied. A studio with four people and a month could copy every
mechanic in this document.

Three things they cannot copy:

1. **The private layer is co-authored by someone real.** She can add a door to
   the world. No agency can ship that, because they do not have her.
2. **The work in it is yours.** The Workshop is real systems you built and can
   defend for an hour.
3. **The commitments are commercially unreasonable.** No analytics. No
   backtracking. Rewarding the visitor for doing nothing. Launching with most of
   the world deliberately unbuilt. Every one of these would be argued out of a
   client project in the first review. You have no client.

So the answer to "build something nobody has built" is not more features. It is
holding the commitments below when they get inconvenient. They will.

---

## 1. What YUDY is

YUDY is one continuous shot through a world that keeps real time, remembers you,
and can never be walked backwards.

It begins on a rooftop terrace in Paris at golden hour, in the rain, with the
Eiffel Tower soft on the horizon. On a round table sit ordinary things: a
laptop, a coffee, a cassette player, postcards, a receipt, a crescent earring, a
folded map.

You dive into one. The camera goes *through* the object into a world. You come
out somewhere further along. You keep going forward. There is no back button, no
menu, and no hub to return to.

Go far enough and you arrive at the terrace again, at night. A second cup is on
the table. The objects you never opened are still sitting there, waiting. The
place you started turns out to have been the destination.

You leave with a four-kilobyte trace of the path you took, which can only be
played back as a film inside the world it came from.

It has to work simultaneously as:

- an engineering portfolio a recruiter can read in ninety seconds,
- a piece of craft a stranger enjoys with zero context,
- and a letter to one person.

Law 4 is how those three stop fighting.

---

## 2. The nine laws

Every decision, in code or in art, satisfies all nine. If one has to break, stop
and ask which.

**1 — One take, one direction, one loop.**
The camera never cuts, never fades to black, and never reverses. Every
transition is a continuous move forward. Travel far enough and you arrive where
you began, changed. Reduced-motion mode is the single sanctioned exception.

**2 — Ordinary becomes miracle.**
Every portal starts on a humble object and ends somewhere vast. Steam becomes
cloud. A screen's glow becomes lamplight. A ripple in coffee becomes a river.
The scale change is the payload. Never shortcut it with a teleport.

**3 — Painted versus sketched.**
Built things are colour. Wished-for things are ink on cream paper, drawn as
doors that open a crack and close with a soft *not yet*. "Not yet" is a designed
state and never an error state.

**4 — Legible to everyone, meaningful to one.**
A recruiter sees craft. A stranger sees a beautiful world. One person sees
herself. No personal data about any real person ships in the public bundle.

**5 — Black outside, red inside.**
Every object is restrained on its exterior and vivid within. Deep navy, charcoal
and ivory in the open world; cherry, blush and gold only once you are inside
something. Restraint that opens into colour, never colour sprayed everywhere.

**6 — No audience.**
No analytics, no telemetry, no view counters, no share metrics, no cookie
banner, no third-party scripts. The site states this plainly and keeps a visible
"forget me" control. Whatever the world remembers about a visitor lives on that
visitor's own device and nowhere else.

**7 — Stillness is content.**
Stop moving and the world does not nag, dim, or time out. It rewards you. Rain
thickens, the camera settles, ambient detail blooms, a distant train passes.
Every other site on the internet punishes idling. This one has things that only
happen if you stop.

**8 — The world keeps real time.**
Paris clock, Paris weather, tonight's real moon phase, the actual season. Visit
in January and you get Paris in January. Visit at 3 a.m. and the terrace is
dark. The world is never the same twice because the world is not the same twice.

**9 — You leave with a trace, not a copy.**
The souvenir is the path you took, stored as a few kilobytes of camera poses and
timestamps. It is not a video. It only becomes a film when played back inside
the world. You genuinely cannot pack it in a suitcase.

---

## 3. Structure: the Long Way Round

Kill the hub. Hub-and-spoke is what every 3D portfolio does, and it is what
makes them feel like a menu wearing a costume.

YUDY is a **rail**: an authored spline through the whole world, with branch
points. You always travel forward along it. Worlds are rooms the camera passes
through, not destinations it bounces between.

```
Terrace (dusk) ──▶ dive ──▶ Workshop ──▶ Riverbank ──▶ ◇ branch ──▶ Night
                                                        └─▶ Kochi ──▶ ...
                                                                       │
Terrace (night) ◀──────────────── the long way round ◀─────────────────┘
```

**The move that makes one-way navigation usable:** the folded map lets you jump
*forward* to any moment on the rail, including all the way round to the
beginning. Nothing is unreachable. You simply never rewind. Every route out is a
route onward.

**Why this is also the right engineering call.** Because the path is known, you
can stream assets along the rail ahead of the camera, keep exactly one heavy
world resident, and dispose everything behind you. Free-roam hubs cannot do
this. The most unusual design decision in the project is also the fastest one.

**Branch points (two sides).** At marked points the rail splits into a calm
route and a wild route, taken from the two-sided beach at Sasihithlu. Same
destination, different experience, different audio panning. Two visitors compare
notes and find they saw different things. Nobody sees the whole world in one
pass, by design.

---

## 4. The first ninety seconds

| Time | Beat |
|---|---|
| 0:00 | Black. A tawa hisses. Batter spirals onto iron, and the spiral is the progress bar, going pale to golden as assets arrive. Pure 2D canvas, so the loader costs almost nothing. |
| 0:07 | "Tap to begin", which also unlocks audio. The dosa folds, steam rises, the camera follows it up. |
| 0:11 | Steam thins into cloud, cloud parts, terrace. Wet roofs, tower soft, rain backlit by the low sun so every streak glitters. The clock and the weather are Paris, right now. |
| 0:16 | Title, quietly: *YUDY — an unfinished world.* |
| 0:22 | The camera drifts to the table. Hover and focus racks onto the object while the city blurs. |
| 0:30 | Do nothing and Law 7 begins. The rain thickens. A shutter closes somewhere below. The world is content to wait. |
| 0:40 | Dive into the laptop. Screen-glow becomes lamplight. Workshop. |
| 1:10 | Leave forward, not back. The rail carries on. |
| Always | "Skip to work" (plain HTML), sound toggle, reduced-motion path, forget-me control. |

---

## 5. Moments and their verbs

Each moment owns **one verb**. No two painted moments may share one. The verb is
what stops eight worlds reading as one world reskinned eight times.

| Object | Moment | Verb | Carries |
|---|---|---|---|
| Laptop | Workshop | build | Projects as scale-model buildings |
| Dosa | Origin | rise | About; doubles as the opening |
| Coffee | Riverbank | sit | Live "now": building, reading, listening |
| Cassette | Sound Room | listen | Music; each tape re-grades the world |
| Postcards | Postcards | send | Places unvisited; the blank card is contact |
| Receipt | The Receipt | read | Résumé and case studies, printable |
| Earring | Night | lie back | Tonight's real moon, aurora, fireflies |
| Map | Wish Map | take the odd road | Every unbuilt world, as drawn doors |

Launch with **one painted world and seven pencil doors**. Under Law 3 that is
not a reduced launch. It is the launch.

---

## 6. The Workshop: architecture drawn as architecture

Projects are buildings. Hover and a building explodes into its system diagram.
The metaphor must be structurally true, or it is decoration.

- **KRON** — a toll-gate arch that turns coins away unless the policy engine approves.
- **Vioris** — a lighthouse of four concentric permission rings, lamp always lit when it acts. *Never act invisibly.*
- **VAni** — a house with one window per family member, each glowing with a pulse.
- **FarmLoop** — terraced fields with a wireframe twin hovering above.
- **LUME** — a survey grid over contested ground, delay risk rising as heat.
- Plus VORTEX, KAWACH, Nayana Pulse, Continuum as they earn a place.

Four excellent buildings beat nine placeholders. The 3D object introduces the
project; HTML explains it. Never make anyone read long text off a texture.

---

## 7. The Reel: the souvenir you cannot pack

While you travel, the world records your camera path, your branch choices, and
the moments you lingered on. At the end it offers you **your Reel**.

The Reel is a JSON trace of a few kilobytes. Played back, the engine re-performs
your exact journey as a continuous shot, cut to its own rhythm, with your
lingering as the edit points. Someone who opens your Reel link does not watch a
recording of you. They watch their machine perform your path through the same
world, live.

- Shareable as a URL with the trace compressed into the fragment.
- Downloadable as `yourname.reel`, which is useless anywhere except here.
- Optional MP4 export via `MediaRecorder` for people who want to post it, marked
  clearly as a lesser copy.

This is the "movie edit" idea turned into a mechanic, and it is the thing that
makes the site spread, because every visitor leaves holding a different film.

The machinery is already in the build: the dev shot recorder is the Reel
recorder. Build it in Phase 2 as a tool for yourself and it becomes a feature
for everyone in Phase 6.

---

## 8. The world remembers you

Local only, in IndexedDB, never sent anywhere, erasable from a visible control.

On a second visit:

- The route you skipped is the route the map offers first.
- The tape you played last time is already cued in the deck.
- An object you lingered on has moved slightly, as if someone picked it up.
- Doors you knocked on carry a pencil note in the margin.
- The terrace opens at the hour it actually is for you, not the hour it was.

Her four small acts of love become the manners of the software:

| Act | How the world performs it |
|---|---|
| *I watched the one you suggested* | The world picks up where the rail left you |
| *I listened to the song you recommended* | The deck remembers the tape |
| *That reminded me of you* | An unopened door glows near what you lingered on |
| *You'd probably like this* | The map's first suggestion is the road you did not take |

Most sites are stateless. A portfolio that remembers a stranger, without
watching them, is close to unheard of, costs almost nothing, and does not
screenshot, which is exactly why nobody builds it.

---

## 9. The Letter, co-authored

All personal content ships as one encrypted blob. The browser derives a key from
a passphrase (Web Crypto, PBKDF2 into AES-GCM) and decrypts locally. Without the
phrase the public bundle contains nothing personal. A wrong phrase simply fails.

Entry: a notebook on the table asking *Who am I to you?*, or a link carrying the
key in the URL fragment, which never reaches a server.

Unlocked, the grade shifts toward cherry, blush and sky. A second cup appears.
The moon says 月が綺麗ですね. Dated acts become fireflies in Night. The cassette
rack fills with titles. Wish Map doors get their real names and dates. The
receipt gains one line.

**The part that matters most:** she can add a door. A small authoring view,
passphrase-gated, writes a new sketch moment into her half of the Letter. Her
doors appear on the map in her handwriting face. From then on the world has two
authors, and the site stops being a gift and becomes a place.

**Hard rules, no exceptions.** No real person's name, wishes, photos, messages
or identifying details in the public bundle, in source, in comments, or in
commit messages. Plaintext lives only in `content/private/`, gitignored.
Ciphertext only in the repo. The private route is `noindex`. Anything touching
her data or accounts needs her explicit consent first, and she sees the Letter
before launch.

---

## 10. The paper layer and the recruiter route

Case studies open as thermal-paper receipts with a pen sketch of the
architecture. Real HTML, selectable, keyboard-reachable, animating out from the
object's screen position so they stay part of the world. The contact form is a
postcard you write, stamp and post.

`/work` is a prerendered static page styled as one long receipt: projects as
line items, `TOTAL: ∞`, a barcode linking to GitHub. It works with JavaScript
off, is reachable from the first frame, and is the SEO and accessibility route.
It is also the thing that lets Law 1 be uncompromising, because anyone who wants
the information without the journey already has a door.

---

## 11. Sound

Generated in code. No audio files shipped.

- Rain: filtered noise plus randomised drop ticks, density tied to the real
  Paris forecast.
- Shore: band-passed noise with a slow swell, panned so the calm branch and the
  wild branch are literally different sides of the stereo field.
- Each world gets a synthetic reverb tail: long for stone, tiny for an alley.
  People should hear the architecture.
- Named songs only as official embeds. No uploaded audio, no lyrics anywhere.

---

## 12. Corrections and constraints carried forward

- **Fireflies:** the festival is at **Bhandardara** near Akole in the Sahyadris,
  not Bhandara in the east of Maharashtra, and it runs in weekend batches from
  roughly mid-May to mid-June, before the monsoon. Keep Night dry and keep the
  rain on the terrace.
- **Copyright:** no film stills, clips, lyrics, scraped photographs, or uploaded
  copyrighted audio. Evoke films and songs through colour, architecture and
  light. Log every asset licence in `docs/ASSET-LICENSES.md`.
- **Scope:** a hundred wishes are not a hundred scenes. They are rows in
  `moments.ts`. Hand-build about eight. Everything else is a pencil door.

---

## 13. What this costs, honestly

| Commitment | The cost | Why it stays |
|---|---|---|
| No back button | Some visitors will be annoyed | Forward-only plus a forward-jumping map makes everything reachable, and `/work` catches anyone impatient |
| No analytics | You will never know what worked | Law 6 is the point, and asking three real people is better data anyway |
| Rewarding idleness | Reads as broken unless cued | One subtle cue: the rain answers before anything else does |
| Launching mostly unbuilt | Feels exposed | Law 3 makes it legible as intent, and it is the only honest way to ship this decade |
| The Reel | Hardest feature in the project | It is the same code as your dev shot recorder, so you pay for it once |

---

## 14. Non-goals

Photorealism. Reproducing real cities. A physics playground, which Bruno Simon
already owns. A CMS. A database. Multiplayer. Cleverness that costs legibility:
if a recruiter cannot find the work in ten seconds, the design failed no matter
how it looks.
