# Copilot Instructions

## Project Overview

This is a personal portfolio website built with **Next.js 15** using the **Pages Router** and configured for **static export**.

## Key Constraints

### Node.js Version
- Next.js 15 requires Node.js `^18.18.0 || ^19.8.0 || >= 20.0.0`.
- Use Node.js 22 (for example, `nvm use 22`) before running commands; CI and image tooling use this supported runtime.

### Static Export
- The site uses `output: "export"` in `next.config.js` to generate a fully static site.
- The `next export` CLI command was removed in Next.js 15. Do NOT use `npx next export`. Static export happens automatically during `next build`.
- All pages must be statically renderable (no server-side features like `getServerSideProps`, API routes, or middleware).

### Images
- Image optimization is disabled (`images.unoptimized: true`) for static export compatibility.
- Next.js image imports (e.g. `import img from "./photo.jpg"`) return an **object** with `{ src, width, height }`, NOT a plain URL string.
- When using a plain `<img>` tag, always access `.src`: `<img src={img.src} />`.
- Alternatively, use `next/image` with the `Image` component which accepts the object directly.

### Dependencies
- `sharp` is required for image processing during build. It must remain in `package.json` dependencies.
- The project uses unchanged vendored Bootstrap 3 CSS/fonts and React Bootstrap 0.33. Bootstrap JavaScript is deliberately absent. Swiper 12 imports modules from `swiper/modules` and styles from `swiper/css`.
