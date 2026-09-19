# YUDY — Art Bible

Consistency beats polygon count. One coherent direction makes cheap geometry and
AI-generated props usable. A mix of styles makes expensive assets look wrong.

## 1. The direction in one line

Painterly toon shading, ink outlines, paper grain, baked light. Rain-washed
warmth against deep blue shadow. Restrained outside, vivid inside. Nothing neon,
nothing cluttered.

## 2. Law 5 as a material rule: black outside, red inside

The single strongest visual idea in the project, taken from a black heel with a
red sole.

- **Open world** (terrace, rail travel, exteriors): navy, charcoal, slate,
  ivory, gold. Colour is light, not pigment.
- **Interiors** (inside a portal, inside a panel, inside the Letter): cherry,
  blush, sky. The colour is *in* things.
- Never spray accent colour across an exterior. The reveal only works if the
  outside is disciplined.
- The Letter does not add colours. It shifts the weighting toward the interior
  palette, as though the whole world had been turned inside out.

## 3. Palette tokens

Defined once as CSS custom properties and a TS constant shared with shaders.
Never hand-pick a colour in a component.

| Token | Hex | Use |
|---|---|---|
| `--ink` | `#0E1726` | Deepest shadow, outlines, text on light |
| `--navy` | `#16233A` | Base surfaces, night sky |
| `--slate` | `#2C3A51` | Mid shadow, wet stone |
| `--paper` | `#F3EAD8` | Sketch ground, receipts, postcards |
| `--ivory` | `#FBF6EC` | Warm light, highlights |
| `--gold` | `#E3B25C` | Golden-hour key, lamplight, fireflies |
| `--cherry` | `#C9424B` | Interior accent, focus states |
| `--blush` | `#EBA9B4` | Interior accent, dominant in the Letter |
| `--sky` | `#8FB8D8` | Rain glint, cold rim light |

Two accents maximum in any frame. Sketched worlds use `--paper` and `--ink`
only, with no accents at all.

## 4. Typography

| Role | Direction |
|---|---|
| Display | High-contrast serif, large and rare (titles, moment names) |
| Body and UI | Clean neutral sans, generous line height |
| Annotation | Handwriting face, for margin notes, door labels, the Letter |
| Receipt | Condensed monospace, for `/work` and case-study panels |
| Her doors | A second handwriting face, distinct from yours |

Self-host, subset, preload only the display face. Record licences in
`docs/ASSET-LICENSES.md`.

## 5. Materials

Glass, wet stone, paper, brushed metal, worn wood. Everything should look
touched. No chrome, no plastic, no mirror-perfect reflections.

- Baked light everywhere. No real-time shadows.
- Toon ramp, three bands maximum: shadow, mid, light.
- Ink outline via inverted hull or a post-pass, thin and slightly irregular.
- Paper grain and a soft vignette over the whole frame, canvas and DOM alike, so
  the two layers share a surface.

## 6. Light and the live world

Golden hour is the house light: low warm key from one side, cool `--sky` fill
opposite. Rain streaks glint only when lit from the key direction, which is what
makes the terrace read as expensive.

Because of Law 8, the grade is a continuous function of real Paris time, not
three presets. Author the curve, not the states:

| Real hour | Reads as |
|---|---|
| 05–08 | Blue hour into first gold, windows still lit |
| 08–16 | Flat daylight, rain silver rather than gold |
| 16–20 | House light. The signature frame. |
| 20–23 | Warm windows against navy, tower lit |
| 23–05 | Night terrace, second cup, moon is real |

Each moment has one signature light condition and must be recognisable from a
thumbnail by its lighting alone.

## 7. Camera language

- 35–50 mm equivalent. Present, never fisheye.
- Rack focus on hover. Depth of field is the main way the world says what is
  clickable.
- Parallax on pointer and tilt is a few degrees only. Motion sickness ends the
  session.
- Dives accelerate in and decelerate out, 1.2 to 1.8 s.
- Travel along the rail breathes: a slow vertical float of about 2 cm amplitude,
  halved when the Rest begins.
- Calm branches are slow, low and steady. Wild branches float, roll slightly,
  and move faster.
- Every pose is data captured with the shot recorder. Agents cannot see your
  compositions. You can.

## 8. The Rest, visually

Stillness must look like generosity, never like a screensaver.

- Stage 1: the breathing halves and the frame settles. Almost subliminal.
- Stage 2: rain density rises 30%, drops slow, the world gets quieter and wetter.
- Stage 3: one ambient event with a clear source. A shutter, a train, a bell.
- Stage 4: the light moves one notch toward the next hour. The visitor should
  suspect they imagined it.
- Nothing pulses, blinks, bounces, or asks for attention.

## 9. Sketch state

- Cream ground, single ink weight, visible construction lines.
- Doors drawn in real architectural vocabulary: a London panelled door, a Kochi
  shutter, a Rajasthani arch, a Hampi lintel.
- Knock and it opens a crack, gold light spills, then it closes with a soft
  *not yet*.
- Never grey it out, never a lock icon, never a disabled cursor.
- A door that has been knocked on before carries a pencil note in the margin.

## 10. Concept frames to draw before any scene code

1. **Terrace**, golden hour in rain, table foreground, tower soft.
2. **Workshop** interior, one project building mid-explode.
3. **A sketched door** opening a crack.
4. **Terrace at night**, second cup, the unopened objects still on the table.

These double as the parallax fallback for devices without WebGL.

## 11. Asset pipeline

Self-made in Blender, CC0 packs, or AI-generated meshes cleaned up. Roughly 10k
triangles per hero prop, far less for background. Export GLB, compress with
`gltf-transform` (Draco or Meshopt) plus KTX2. One shared material library; a
new material needs a reason. Log every third-party asset in
`docs/ASSET-LICENSES.md`.

## 12. Copyright boundary

No film stills, clips, lyrics, scraped photographs, or uploaded copyrighted
audio. Films and songs are evoked through colour, architecture and light. Named
tracks appear only as official embeds.
