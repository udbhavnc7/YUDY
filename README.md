# YUDY

Udbhav NC’s portfolio takes place in one interior. Phase 1 builds the room shell and the scroll-driven camera path.

## Run locally

From this checkout, run `npm ci` if dependencies are missing. Run `npm run dev` and open the local URL printed by Vite.

- Open `/?proof=grey` to inspect the plain grey box under the same HDRI, studio light, tone mapping and camera.
- Open `/` to see the lamp warm up. Click the shade or focus the power switch and press Space.
- Scroll down through the chair, sofa, poster wall, two shelf bays and window alcove. Press End for the full-room reveal. Press Home to return.
- Open `/?proof=lamp` to inspect the isolated Phase 0 lamp.
- Resize to a portrait viewport to check the lamp and full-room framing. With reduced motion enabled, scrolling steps between views.
- Run `npm run build` and `npm run preview` to check the production bundle.

## Project documents

Read the [vision](docs/VISION.md), [visual quality guide](docs/VISUAL-QUALITY.md), [camera guide](docs/SCENE-AND-CAMERA.md), [content model](docs/CONTENT-MODEL.md) and [roadmap](docs/ROADMAP.md) in that order. The [working agreement](AGENTS.md) governs the reset. Third-party assets used in the running scene are listed in the [licence log](docs/ASSET-LICENSES.md).
