const fs = require("node:fs");
const path = require("node:path");

function exportStudioHome(outputDir = path.join(__dirname, "..", "out")) {
  const source = fs.readFileSync(path.join(outputDir, "studio", "index.html"), "utf8");
  if (!source.includes("<head>") || !source.includes('id="studio"')) {
    throw new Error("The studio homepage was not copied into the static export");
  }
  const home = source.replace("<head>", '<head>\n  <base href="/studio/">');
  fs.writeFileSync(path.join(outputDir, "index.html"), home);
}

if (require.main === module) exportStudioHome();
module.exports = exportStudioHome;
