const path = require('path');
const webpack = require('webpack');
const WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
const HappyPack = require('happypack');

const config = require('./config.js');
const isomorphicConfig = require('./isomorphic.config');

const webpackIsomorphicToolsPlugin =
  new WebpackIsomorphicToolsPlugin(isomorphicConfig).development();

module.exports = {
  target: 'web',
  devtool: 'cheap-module-eval-source-map',
  context: config.ROOT_DIR,
  cache: true,
  entry: {
    main: [
      'react-hot-loader/patch',
      `webpack-hot-middleware/client?reload=true
        &path=http://localhost:${config.HMR_PORT}/__webpack_hmr`,
      path.join(config.SRC_DIR, 'client.js')
    ]
  },
  output: {
    path: path.resolve(config.ASSETS_DIR),
    filename: '[name].js',
    chunkFilename: '[name]-[id].chunk.js',
    publicPath: `http://localhost:${config.HMR_PORT}/assets/`
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.css', '.scss'],
    modules: ['src', 'node_modules']
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'happypack/loader?id=jsx'
      },
        { test: /\.json$/, loader: 'json-loader' },
        { test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff' },
        { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=application/octet-stream' },
        { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader' },
        { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=image/svg+xml' },
        { test: webpackIsomorphicToolsPlugin.regular_expression('images'), loader: 'url-loader?limit=10240' },
    ]
  },
  modules: [
    'src',
    'node_modules'
  ],
  plugins: [
    new HappyPack({
      id: 'jsx',
      threads: 6,
      loaders: ['babel-loader']
    }),
    webpackIsomorphicToolsPlugin,
    new webpack.HotModuleReplacementPlugin()
  ]
};

