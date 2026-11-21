# Asset licences

The [Phase 0 licence log](docs/ASSET-LICENSES.md) lists the files shipped by Vite. This inventory also includes source assets stored for later phases.

Every third-party model, texture, or HDRI used in YUDY is recorded here
before it is committed. No entry, no asset. This matters more than usual on
this project — the room is built substantially from sourced assets rather
than from-scratch geometry.

| Asset | File | Source + URL | Licence | Attribution needed? | Notes |
|---|---|---|---|---|---|
| Venice Sunset HDRI | `assets/environment/venice_sunset_1k.hdr` | Poly Haven (https://polyhaven.com/a/venice_sunset) | CC0 | No | 1k resolution, 1.44 MB |
| Wood Floor 042 PBR set | `public/textures/woodfloor/` (Color, NormalGL, Roughness 1K JPG) | ambientCG (https://ambientcg.com/view?id=WoodFloor042) | CC0 | No | Floor albedo + normal + roughness |
| Plaster 001 PBR set | `public/textures/plaster/` (Color, NormalGL, Roughness 1K JPG) | ambientCG (https://ambientcg.com/view?id=Plaster001) | CC0 | No | Wall albedo + normal + roughness |
| Sofa 03 mesh + 1k PBR | `public/models/sofa_03/` (glTF + bin + diffuse/normal/roughness) | Poly Haven (https://polyhaven.com/a/sofa_03) | CC0 | No | Sofa hero mesh |
| Wooden Chair 01 mesh + 1k PBR | `public/models/WoodenChair_01/` (glTF + bin + diffuse/normal/arm) | Poly Haven (https://polyhaven.com/a/WoodenChair_01) | CC0 | No | Chair hero mesh |
| Potted Plant 04 mesh + 1k PBR | `public/models/potted_plant_04/` (glTF + bin + diffuse/normal/arm) | Poly Haven (https://polyhaven.com/a/potted_plant_04) | CC0 | No | Showcase plant mesh |
| Carpet 001 PBR set | `public/textures/carpet/` (Color, NormalGL, Roughness 1K JPG) | ambientCG (https://ambientcg.com/view?id=Carpet001) | CC0 | No | Rug albedo + pile normal + roughness |
| Fabric 025 PBR set | `public/textures/fabric/` (Color, NormalGL, Roughness 1K JPG) | ambientCG (https://ambientcg.com/view?id=Fabric025) | CC0 | No | Pillow + lampshade weave |
| Dark Wooden Planks 1k PBR | `public/textures/darkwood/` (diffuse, nor_gl, rough 1K JPG) | Poly Haven (https://polyhaven.com/a/dark_wooden_planks) | CC0 | No | Bookshelf carcass wood |
| Wallpaper 001B PBR set | `public/textures/wallpaper/` (Color, NormalGL, Roughness 1K JPG) | ambientCG (https://ambientcg.com/view?id=Wallpaper001B) | CC0 | No | Damask accent wall |

## Rules

- CC0 (Poly Haven, ambientCG, Kenney, Quaternius): no attribution needed, log
  it anyway for provenance.
- CC-BY or similar: add the required credit to a `/credits` route (doesn't
  need to be prominent, just reachable) and note it in this table.
- Meshy/Tripo free-tier output: CC BY 4.0 — treat like CC-BY above.
- Anything else: read the actual license before use. When in doubt, don't
  ship it.
- No film stills, no scraped photographs of real interiors as textures
  without checking their license, no copyrighted posters or album art used
  as literal poster/book content — use your own real achievement and project
  data instead.
