This is the personal website for [Paul Loeb](http://paulloeb.net)

## Tech Stack

- **Next.js 15** (Pages Router) with static export (`output: "export"` in `next.config.js`)
- **React 18**
- **Bootstrap 3** / React Bootstrap
- **Node.js >= 18.18.0** (required by Next.js 15)

## Running In Development

```
nvm use 22
npm install
npm run dev
```

Open [http://localhost:3000/studio/index.html](http://localhost:3000/studio/index.html) to work on the studio homepage in `public/studio`. The Next.js pages under `pages/portfolio` retain their own routes.

## Building For Production

```
nvm use 22
npm install
npm run build
```

The static export is written to `out`. The postbuild script places the studio at the root while the portfolio pages and their assets remain in the export.

## Deploying

Run the [Deploy to SiteGround workflow](https://github.com/loebpaul/paulloeb-website/actions/workflows/deploy.yml) from the revision you intend to publish. The workflow runs the same static export and uploads `out` to SiteGround. Cloudflare proxies the public domain.

The SiteGround File Manager is available for manual recovery:

https://tools.siteground.com/filemanager?siteId=TEEzMmEzME1KZz09

## Important Notes

- **Node.js version**: Next.js 15 requires Node.js `^18.18.0 || ^19.8.0 || >= 20.0.0`. Use `nvm` to manage versions.
- **Static export**: `next export` was removed in Next.js 15. Static export is configured via `output: "export"` in `next.config.js` and runs automatically during `next build`.
- **Images**: Next.js image imports (e.g. `import img from "./photo.jpg"`) return an object, not a string. Use `img.src` when passing to a plain `<img>` tag. Image optimization is disabled (`images.unoptimized: true`) for static export compatibility.
- **sharp**: The `sharp` package is required for image processing during build. It is listed as a dependency.
