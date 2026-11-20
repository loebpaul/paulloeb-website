# Paul Loeb’s recording studio

The files in `site/` serve [paulloeb.net](https://paulloeb.net/) directly.

## Preview and verify

Run `python3 -m http.server 8000 --directory site` and open [the local preview](http://localhost:8000/). With Node.js 22, run `node --test` to verify the release files and Analytics configuration. There are no packages to install or files to build.

## Deploy

Run the [Deploy to SiteGround workflow](https://github.com/loebpaul/paulloeb-website/actions/workflows/deploy.yml) from the revision to publish. The workflow verifies and syncs `site/` to the SiteGround origin. Cloudflare proxies the public domain.

## Analytics

Google Analytics collects pageviews and `studio_*` events on the public site. The Events report shows which studio areas visitors open and which interactions they use. Events for selections and links include the public item label in `studio_item`. Local previews skip collection.
