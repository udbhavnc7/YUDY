# YUDY — Content Model

Content is data. Components render data. A place name, project description, or
date inside a component is a bug.

## 1. Moments

```ts
// src/data/moments.ts

export type MomentId = string;
export type MomentStatus = 'painted' | 'sketch';

export type Verb =
  | 'build' | 'rise' | 'sit' | 'listen'
  | 'send' | 'read' | 'lie-back' | 'take-the-odd-road';

export type Shot = {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
  duration: number;            // seconds
  easing?: string;             // gsap easing string
};

export type DoorStyle =
  | 'london-panel' | 'kochi-shutter'
  | 'rajasthani-arch' | 'hampi-lintel';

export type Moment = {
  id: MomentId;
  title: string;
  status: MomentStatus;
  verb: Verb;                  // unique among painted moments
  portalObject: string;        // key of the object on the table
  signatureLight: string;      // must be recognisable in a thumbnail
  interiorPalette: string[];   // Law 5: interiors only, max 2 accents
  doorStyle?: DoorStyle;       // sketch only
  opensOn?: string;            // ISO date; a sketch may unlock itself
  private?: boolean;           // lives in the Letter, never in the public bundle
};
```

Invariants an agent must enforce:

- No two `painted` moments share a `verb`.
- A `sketch` moment has a `doorStyle` and no scene module.
- `private: true` rows live in `content/private/`, never in `src/data/`.
- Accent colours appear only in `interiorPalette`, never in exterior config.

## 2. The Rail

```ts
// src/data/rail.ts

export type RailNode = {
  id: string;
  momentId: MomentId | null;   // null = a travel segment
  enter: Shot;
  rest: Shot;
  exit: Shot;
  next: string[];              // 1 = linear, 2 = branch (calm, wild)
  preloadAhead: string[];
  disposeBehind: string[];
};
```

Forward only. There is no `previous` field and there never will be. The final
node's `next` points at the terrace node, which closes the loop and makes every
moment reachable by continuing.

## 3. Projects

```ts
// src/data/projects.ts

export type Project = {
  id: string;
  name: string;
  oneLine: string;             // the sentence a recruiter remembers
  building: string;            // the architectural metaphor
  role: string;                // what YOU did, specifically
  stack: string[];
  year: number;
  links: { label: string; href: string }[];
  caseStudy: string;           // markdown path, rendered into the receipt panel
  featured: boolean;           // featured projects get a 3D building
};
```

Only `featured` projects get a model. The rest are line items on the receipt.
Four excellent buildings beat nine placeholders.

## 4. The visit store (return state)

See `docs/SYSTEMS.md` §3 for the full type and rules. Summary of the contract:

- IndexedDB, origin-local, never transmitted, no IDs, no fingerprinting.
- A visible **forget me** control wipes it and confirms in words.
- Stores `letterUnlocked` as a boolean and nothing else derived from the Letter.

## 5. The Reel

See `docs/SYSTEMS.md` §2 for the format. Content rules:

- The trace records poses, branch choices, dwell times, and world conditions.
- It never records anything about the person: no ID, no IP, no user agent, no
  finer timestamp than the hour.
- Shared through the URL fragment, which never reaches a server.

## 6. The Letter

### Files

```
content/private/letter.json     plaintext, GITIGNORED, never committed
public/letter.enc               AES-GCM ciphertext, committed
scripts/seal-letter.ts          plaintext -> ciphertext
```

`.gitignore` must contain `content/private/`, `*.plain.json`, and `.env*`.

### Scheme

Passphrase to PBKDF2-SHA256 with at least 250,000 iterations and a random
16-byte salt. Key to AES-GCM 256 with a random 12-byte IV. Output
`{ v, salt, iv, ciphertext }`, all base64. Decryption happens entirely in the
browser through Web Crypto. A wrong passphrase throws, and the UI says "not this
one" without hinting.

### Shape

```ts
type Letter = {
  greeting: string;
  moonLine: string;                                 // 月が綺麗ですね
  acts: { date: string; text: string }[];           // fireflies in Night
  tapes: { title: string; embedUrl: string }[];     // titles and official embeds only
  doors: LetterDoor[];
  receiptLine: string;
};

type LetterDoor = {
  momentId: MomentId;
  realTitle: string;
  date?: string;
  author: 'mine' | 'hers';     // hers render in the second handwriting face
  note?: string;
};
```

No photographs. No message logs. Titles and dates only.

### Co-authoring

A passphrase-gated authoring view lets her add a `LetterDoor` with
`author: 'hers'`. It writes to her half of the plaintext, which is resealed and
redeployed. Her doors appear on the Wish Map in her handwriting face.

Consent gates, not engineering gates:

- Anything pulling her accounts or data, including the Firefly Repository,
  happens only after she has explicitly agreed.
- She sees the whole Letter before launch.
- The most personal doors stay inside the Letter and never get a public row.

## 7. Where content may live

| Kind | Location | Committed |
|---|---|---|
| Moments, rail, projects, copy | `src/data/*.ts` | Yes |
| Case studies | `content/case-studies/*.md` | Yes |
| Personal plaintext | `content/private/` | **No** |
| Personal ciphertext | `public/letter.enc` | Yes |
| Secrets and keys | `.env.local`, Vercel env | **No** |

## 8. Adding a new world

1. Add a row to `moments.ts` with `status: 'sketch'` and a `doorStyle`. Ship it.
   It is now a pencil door, and that is a complete feature.
2. When you build it: add `src/scenes/<Name>/`, insert a `RailNode` in the
   forward chain, record the shots with `K`, flip `status` to `painted`, give it
   a table object.
3. The door dissolves on the next load and the object appears on the table. That
   transition is the entire point of the design, so make it good.
