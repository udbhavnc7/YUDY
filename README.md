# YUDY

YUDY is being rebuilt from the room outward. The current milestone is Phase 0: prove one lamp in a dark, correctly lit scene before adding room objects.

## Run locally

From this checkout, run `npm ci` if dependencies are missing. Run `npm run dev` and open the local URL printed by Vite.

- Open `/?proof=grey` first. Check that the box reads as an object in a real studio space under the same HDRI and tone mapping.
- Open `/`. Watch the lamp turn on. Inspect the linen weave, pleated shade edges, brass reflections, wood grain, contact shadow and light falloff. Compare it with a photograph of a lamp in a dark room; if it still reads like a Three.js demo, stop and identify whether the asset, material or lighting needs work.
- Click the lamp or focus the power switch with Tab and press Space. Check the light and name reveal with the lamp both on and off.
- Enable reduced motion and toggle the lamp again. The state should change immediately.
- Run `npm run build` and `npm run preview` to check the production bundle.

## Project documents

Read the [vision](docs/VISION.md), [visual quality guide](docs/VISUAL-QUALITY.md), [camera guide](docs/SCENE-AND-CAMERA.md), [content model](docs/CONTENT-MODEL.md) and [roadmap](docs/ROADMAP.md) in that order. The [working agreement](AGENTS.md) governs the reset. Third-party assets used in the running scene are listed in the [licence log](docs/ASSET-LICENSES.md).
