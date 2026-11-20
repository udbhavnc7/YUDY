# YUDY — Visual Quality

This is the document that fixes what actually went wrong last time. Read it
before writing a single line of scene code. Everything here exists to answer
one question: **how does a solo project, with no modeling budget, get a room
that looks real instead of blocky?**

Two separate problems, two separate fixes. Don't skip either one.

---

## 1. The rule of thumb: sourced model, or good primitive?

Not everything needs a downloaded file. This single distinction is probably
worth more than every other rule in this document combined.

**Needs a real sourced or AI-generated mesh** — procedural geometry cannot
fake these no matter how good the texture is:
- The chair, the sofa (upholstery, cushions, tufting)
- Plants (organic leaf shapes)
- Books when seen close (worn covers, page-block texture, uneven stacking)
- Anything with a silhouette a viewer's eye already knows intimately

**A primitive with an excellent PBR texture is genuinely enough:**
- Floor (a plane with a good wood or boards texture + normal map)
- Walls (a plane with subtle paint/plaster texture)
- Rug (a plane with a carpet texture + normal map for pile)
- Shelf carcass (boxes — the *books on it* need to be real, the shelf frame
  usually doesn't)
- A simple lamp body (a cylinder base + a cone or tapered-cylinder shade with
  a warm emissive/translucent material reads convincingly; it's a simple
  enough silhouette that good lighting sells it)

Spend the asset-hunting budget on the first list. Don't spend it on the
second — a well-lit primitive plane with a real texture is often
indistinguishable from a modeled one once the lighting in §4 is correct.

---

## 2. Where real assets actually come from (current as of 2026)

**Poly Haven** — polyhaven.com. CC0, public domain, no attribution required.
The first stop for HDRIs (essential, see §4) and for high-quality PBR
textures (wood, fabric, rug, paper). Also has some models.

**ambientCG** — ambientcg.com. CC0, 2,000+ PBR materials, 400+ HDRIs. Go here
when Poly Haven doesn't have the specific material you need.

**Sketchfab** — sketchfab.com. The largest model marketplace by far, but
licenses vary per upload. Filter to "Downloadable" and check the license on
every model individually before use — CC0 and CC-BY are safe, anything else
needs its terms read. Good source for a specific chair, sofa, or lamp
silhouette close to your references.

**Kenney (kenney.nl) and Quaternius** — CC0, stylized/low-poly. Not
photoreal, but a legitimate fallback aesthetic: a well-lit, intentionally
stylized room beats a broken attempt at photorealism that ran out of time.
Worth knowing this door exists if the realism target proves too slow to hit.

**BlenderKit** — mixed free/paid, filterable by license, integrated into
Blender directly if you're doing any modeling or cleanup there.

**AI mesh generation, for the specific pieces nothing off-the-shelf
matches** (that orange swivel chair, that woven-shade tower lamp): Meshy AI
or Tripo AI can generate a mesh from a text prompt or one of your own
reference photos, exported straight to GLB. Meshy's free tier gives monthly
credits with CC BY 4.0 output (commercial use is fine, but it requires
attribution — log it). Treat the output as a strong starting mesh, not a
finished asset: expect to clean up topology or UVs in Blender afterward, not
drop it straight in.

## 3. Licensing, practically

This is a public site with your name on it. Before any third-party asset
ships:

- Confirm its license (CC0 needs nothing further; CC-BY needs a credit
  somewhere reachable — a `/credits` route is enough, it doesn't need to be
  prominent; anything else, read the terms).
- Log it in `docs/ASSET-LICENSES.md`: file, source URL, license, any
  attribution text required.
- Prefer CC0 when a CC0 option is close enough to what you need — it's one
  less thing to track forever.

## 4. The Three.js checklist that fixes "cheap" before you add a single asset

This is the highest-leverage section in this document. A well-modeled couch
in a badly configured scene still looks like a game. Get this right first,
then test it against a single primitive box before trusting it with real
assets.

- **Color space.** `renderer.outputColorSpace = THREE.SRGBColorSpace`. Every
  color/albedo texture: `texture.colorSpace = THREE.SRGBColorSpace`. Every
  normal, roughness, metalness, and AO map: leave linear — do **not** set
  sRGB on these. Setting color space on the wrong maps is one of the most
  common single causes of PBR materials looking washed out, flat, or wrong.
- **Tone mapping.** `renderer.toneMapping = THREE.ACESFilmicToneMapping`,
  with `toneMappingExposure` tuned by eye — start around 0.8–1.2.
- **Environment lighting, non-negotiable.** Use drei's
  `<Environment files="your-hdri.hdr" />` with a Poly Haven HDRI, in every
  scene, always. Without an HDRI feeding ambient reflection, PBR materials
  look dead no matter how good their textures are. This is not an optional
  polish step — it's the single highest-leverage fix available, and it costs
  no new assets.
- **Shadows.** `THREE.PCFSoftShadowMap`. Tune the shadow camera's frustum to
  the actual room size (not the default huge box), and tune `bias` /
  `normalBias` to kill acne and peter-panning. Add baked or screen-space
  ambient occlusion for contact grounding — this is what makes objects feel
  like they're actually resting on the floor rather than floating just above
  it.
- **Post-processing, used sparingly.** A subtle bloom isolated to the lamp's
  emissive material (selective bloom, not a global pass over the whole scene
  — global bloom is exactly what makes a scene read as "a game"), a light
  vignette, minimal or no chromatic aberration. Less than the reference
  images might suggest. Restraint here is what reads as "photographed" rather
  than "filtered."
- **Depth of field, if used at all.** Subtle, with focus distance tied to the
  camera's current waypoint target — never a constant blur applied uniformly.

Test this configuration against one grey primitive box under the HDRI before
placing a single real asset. If the box already looks like it's sitting in a
real room, the pipeline is sound and every asset placed after it will benefit.
If the box still looks like a Three.js demo, nothing placed after it will look
right either — fix this first.

## 5. Performance, so none of this melts a phone

- Draco or Meshopt compression on every GLB.
- KTX2 for textures.
- One HDRI environment reused across the whole room, not one per zone.
- Bake shadows for anything the camera never gets close enough to need
  real-time shadow detail on.
- Cap device pixel ratio at 1.5–2.
- Lazy-load each zone's heavier assets as scroll approaches it; dispose
  geometries, materials, and textures for zones behind the camera.
- Selective bloom and DOF are both more expensive than they look — measure
  on a mid-range phone, not the development laptop, before deciding they're
  affordable everywhere.
