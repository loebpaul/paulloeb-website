const withImages = require("next-images");
const path = require("path");

module.exports = withImages({
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  future: {
    webpack5: true,
  },
});
