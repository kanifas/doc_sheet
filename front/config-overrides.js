const {
  override,
  addDecoratorsLegacy,
  addWebpackAlias,
  disableEsLint,
} = require("customize-cra");
const path = require("path");

module.exports = override(
  // enable legacy decorators babel plugin
  addDecoratorsLegacy(),

  addWebpackAlias({
    '~': path.resolve(__dirname, 'src'),
  }),

  // disable eslint in webpack
  disableEsLint(),
);
