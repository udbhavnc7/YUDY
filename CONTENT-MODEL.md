# YUDY — Content Model

Content is data. Components render data. A project name, a school, or a
GitHub link written inside a component instead of a data file is a bug.

## The one rule above all others

**Use only real information.** Do not invent project features, awards, team
sizes, metrics, technologies, or links. Where something is genuinely missing,
put a clearly marked placeholder in the data file (`"TODO: confirm date"`) —
never a plausible-sounding invention. A recruiter who catches one fabricated
detail stops trusting all of it.

## Types

```ts
// src/data/education.ts
export type Education = {
  id: string;
  type: 'school' | 'college';
  institution: string;
  details?: string;        // degree, years, whatever is actually true
};
```

```ts
// src/data/achievements.ts
export type AchievementStatus = 'winner' | 'top' | 'participated';

export type Achievement = {
  id: string;
  title: string;
  event: string;
  year: number;
  status: AchievementStatus;   // drives the poster's glow color — see below
  description?: string;
  link?: string;
  poster?: string;             // asset path once real posters exist
};
```

Status-to-color mapping is fixed. Do not add a fourth status or remix the
colors — this is the exact scheme specified for the site:

| `status` | Glow color | Meaning |
|---|---|---|
| `'winner'` | Gold | Won / received a prize |
| `'top'` | Navy | Top placement / finalist |
| `'participated'` | Emerald | Took part |

```ts
// src/data/projects.ts
export type ProjectType = 'solo' | 'group';

export type Project = {
  id: string;
  title: string;
  type: ProjectType;
  author: 'Udbhav NC' | 'VAPORLOGIC';   // solo -> your name, group -> team name
  github: string;
  live?: string;
  description: string;
  technologies: string[];
  asset?: string;           // book model/texture variant reference
};
```

Group projects are credited to **VAPORLOGIC**, not to individual teammates,
unless a specific project genuinely needs to name someone. Group-project
books are physically larger and visually distinct from solo books, but use
the same interaction pattern.

```ts
// src/data/hobbies.ts
export type Hobby = {
  id: string;
  title: string;
  description: string;
  asset?: string;           // which showcase object represents this
};
```

## Where content lives

| Kind | Location | Committed |
|---|---|---|
| Education, achievements, projects, hobbies | `src/data/*.ts` | Yes |
| 3D models, textures, HDRIs | `assets/models/`, `assets/textures/`, `assets/environment/` | Yes (check size — see `VISUAL-QUALITY.md` §5) |
| Third-party asset license log | `docs/ASSET-LICENSES.md` | Yes |
| Secrets, API keys (if any service is ever added) | `.env.local` | **No** |

## Adding a new item

1. Add a row to the matching data file with real information only.
2. If it needs a new physical representation (a new book, a new showcase
   object), source or build that asset per `VISUAL-QUALITY.md`, log its
   license, and reference it from the data row via `asset`.
3. The scene reads from data — it should never need a code change to add one
   more project, achievement, or hobby, only a new asset and a new row.
