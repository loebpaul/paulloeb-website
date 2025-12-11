const path = require("path");

module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Externalize react-lite-toast for server-side to avoid SVG import issues
      config.externals = config.externals || [];
      config.externals.push('react-lite-toast');
    }
    
    return config;
  },
};
