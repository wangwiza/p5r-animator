# p5r-animator

Browser tool for making P5R-style dialogue clips. Pick a character preset or upload your own portrait, choose a background (preset image, your own image, or greenscreen), enter a name and dialogue, then export an H.264 MP4.

## How it works

- The browser renders a deterministic 1920×1080 canvas: selectable background, bottom-left portrait with a soft ground shadow, animated textbox, rotated name plate text, and a full dialogue block that fades in.
- Portraits use a two-level picker: choose a character, then choose one of that character's base portraits. The catalog contains every base with at least one mouth layer. Eye overlays are optional; variants without eyes still animate their mouths.
- Portrait bases stay full-size, while eye and mouth overlays are cropped to their visible pixels. Their original offsets are stored in `presets.json` so the renderer can paste them back in exactly the right place.
- The speaker name accepts multiple zero-based box positions, e.g. `0,6,14`. Boxes alternate black and dark grey from left to right.
- The textbox frames come from a keyed sprite sheet based on `text_box_ps4.mp4`. Bright green is fully transparent, dark green shadows become soft dark pixels, and the baked-in blinking arrow is preserved. Frames play at their original speed, and there is no exit animation — the UI hard-cuts at the end of the hold. Sprites are cropped at native resolution and drawn 1:1 — they are never scaled up.
- Export runs entirely in the browser. There is no server, no upload, and no ffmpeg installation.

### Export formats

Export picks the best format the current browser supports:

1. **MP4 (H.264)** — when WebCodecs can encode an H.264 profile suitable for 1920×1080@30. Mediabunny muxes the encoded frames into an MP4.
2. **WebM (VP8) via Mediabunny** — when WebCodecs is available but H.264 encoding is not (some Linux browsers). The UI tells the user the clip was saved as WebM.
3. **WebM via MediaRecorder** — for browsers without WebCodecs at all. This is the original realtime capture path.

`ffmpeg.wasm` is intentionally not bundled — it would add a ~32 MB download for a rare fallback.

## Setup

Requires Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Open <http://localhost:5173>. No Python, virtualenv, or ffmpeg is needed.

The committed WebP files in `public/` are copied directly into `dist/` by Vite and served as ordinary static files. Browsers download only the selected portrait variant, background, and shared UI assets on demand.

Production build:

```bash
npm run build      # outputs dist/
npm run preview    # serve the built site locally
```

Deploy the `dist/` directory to any static host (Vercel, Cloudflare Pages, GitHub Pages, Netlify). No environment variables or server configuration are required.

### GitHub Pages

Production builds use the base path `/p5r-animator/`, which matches the default project-site URL:

```text
https://wangwiza.github.io/p5r-animator/
```

`.github/workflows/deploy.yml` builds and publishes `dist/` on every push to `main` and can also be run manually from the Actions tab. In the repository settings, set **Settings → Pages → Build and deployment → Source** to **GitHub Actions**.

`.github/workflows/release.yml` creates a GitHub Release with generated notes whenever a `v*` tag is pushed, for example:

```bash
git tag -a v0.1.0 -m "First public release"
git push origin v0.1.0
```

## Project layout

```
src/app/           thin App container + state/asset/preview/export hooks
src/components/    presentational controls and preview canvas
src/domain/        types, constants, defaults, spec builder, timeline
src/assets/        manifest/image loading, AssetStore, base-path URLs
src/render/        canvas drawing modules
src/export/        export tier logic and encoders
.github/workflows/ GitHub Pages deploy and tag-triggered releases
public/presets.json       generated character/variant/layer manifest
public/preset-defaults.json hand-edited display names and defaults
public/presets/**          committed portrait WebP layers
public/backgrounds.json    background manifest
public/backgrounds/**      committed background WebPs
public/textbox.*           animated textbox manifest and sheet
public/fonts/**            committed font files
tools/generate-presets.mjs one-off local asset generator
```

Raw extracted frames and source videos are intentionally not part of this repository. The committed WebP assets are the source of truth.

### Regenerating portrait assets

The portrait generator is a local development script and is not bundled into the website. It requires ImageMagick's `magick` executable on your `PATH`.

Place the raw character frames in an ignored `assets/frames/<character>/` directory, then run:

```bash
npm run generate:presets
```

It writes `public/presets.json` and all files under `public/presets/`. It keeps each base at its native source resolution (768×768 or 1536×1536 in the current catalog) and crops eye/mouth overlays with a 1px padding. The manifest stores each overlay's original position and size in source-image coordinates; the renderer scales those rects to the destination portrait. Only bases with at least one mouth layer are included. Hand-edited values in `public/preset-defaults.json` are preserved.

Restart `npm run dev` after regenerating assets. Vite does not reliably pick up newly created public directories in an already-running dev server.

## Customization

- `public/preset-defaults.json` contains per-character display names, default speaker names, black-box indices, and default variants. `defaultHighlightIndices` is an array; boxes alternate black and dark grey from left to right.
- `src/render/constants.ts` contains portrait placement, name position, dialogue position, and font sizes.
- `src/render/portrait/animation.ts` contains blink cadence and mouth-flap timing.
- `src/domain/timeline.ts` controls hold time, name/dialogue timing, and the portrait fade tail. Dialogue text auto-fits inside the box instead of using a typewriter effect.
- `src/domain/constants.ts` contains canvas size and export frame rate.
- `src/export/` contains the export tier logic, codec candidate list, bitrate, and encoders.

## License

The original source code in this project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

### Third-party assets

This project is an unofficial fan-made tool and is not affiliated with or endorsed by ATLUS or SEGA.

The MIT License does not apply to third-party materials, including:

- Persona 5 Royal character artwork and portraits
- Extracted animation frames
- Persona 5 Royal UI and textbox graphics
- Logos, trademarks, and other game assets
- Optima Nova font software

These materials remain subject to their respective owners' copyrights and licensing terms. The MIT License does not grant permission to use them outside this project.

### Asset sources

- Persona 5 Royal character sprites: [The Spriters Resource — Persona 5 Royal (PS4)](https://www.spriters-resource.com/playstation_4/persona5royal/)
- Textbox animation asset: Vermillionaire on [YouTube](https://www.youtube.com/@Vermilionaire/featured)

This repository currently includes these third-party assets because the repository owner chose to include them. Their presence here does not grant any rights to reuse, copy, or redistribute them. Please review the source terms before publishing or redistributing this project.
