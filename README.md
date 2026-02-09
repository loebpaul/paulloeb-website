This is the personal website for [Paul Loeb](http://paulloeb.net)

## Tech Stack

- **Next.js 15** (Pages Router) with static export (`output: "export"` in `next.config.js`)
- **React 18**
- **Bootstrap 3** / React Bootstrap
- **Node.js >= 18.18.0** (required by Next.js 15)

## Running In Development

```
nvm use 20
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Building For Production

```
nvm use 20
npm install
npm run build
```

The static export will be generated in the `out` directory.

## Deploying

After building, upload the contents of the `out` folder to SiteGround via the File Manager:

https://tools.siteground.com/filemanager?siteId=TEEzMmEzME1KZz09

## Important Notes

- **Node.js version**: Next.js 15 requires Node.js `^18.18.0 || ^19.8.0 || >= 20.0.0`. Use `nvm` to manage versions.
- **Static export**: `next export` was removed in Next.js 15. Static export is configured via `output: "export"` in `next.config.js` and runs automatically during `next build`.
- **Images**: Next.js image imports (e.g. `import img from "./photo.jpg"`) return an object, not a string. Use `img.src` when passing to a plain `<img>` tag. Image optimization is disabled (`images.unoptimized: true`) for static export compatibility.
- **sharp**: The `sharp` package is required for image processing during build. It is listed as a dependency.
