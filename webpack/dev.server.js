const Express = require('express');
const webpack = require('webpack');
const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');
const debug = require('debug');

const config = require('./config.js');
const devConfig = require('./webpack.dev.config');

const compiler = webpack(devConfig);

const serverOptions = {
  contentBase: `http://${config.HOST}:${config.HMR_PORT}`,
  quiet: true,
  noInfo: true,
  headers: { 'Access-Control-Allow-Origin': '*' },
  hot: true,
  inline: true,
  serverSideRender: true,
  lazy: false,
  stats: { colors: true },
  publicPath: '...'
};

const app = Express();
app.use(devMiddleware(compiler));
app.use(hotMiddleware(compiler, serverOptions));

/* eslint-disable */
app.listen(config.HMR_PORT, function onAppListening(err) {
  if (err) {
    debug(err);
  } else {
    debug('==> 🚧  Webpack development server listening on port %s', config.HMR_PORT);
  }
});
