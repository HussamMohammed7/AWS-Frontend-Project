const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = function override(config, env) {
  // Add your webpack customization here
  config.resolve.fallback = {
    "path": require.resolve("path-browserify"),
    "util": require.resolve("util/")
  };

  // Exclude mammoth from being bundled and let it be resolved at runtime
  config.externals = [nodeExternals()];

  return config;
};
