const path = require('path');
const WebpackIsomorphicTools = require('webpack-isomorphic-tools');
const webpackIsomorphicToolsConfig = require('../webpack/isomorphic.config');

const rootDir = path.resolve(__dirname, '..');

global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DISABLE_SSR__ = false;
global.__DEV__ = false;

global.webpackIsomorphicTools = new WebpackIsomorphicTools(webpackIsomorphicToolsConfig)
  .server(rootDir, () => require('../src/server'));
