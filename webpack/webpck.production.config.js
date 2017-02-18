const path = require('path');
const webpack = require('webpack');
const config = require('./config.js');
const isomorphicConfig = require('./isomorphic.config');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');


const webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(isomorphicConfig);


module.exports = {
  devtool: 'source-map',
  context: path.resolve(__dirname, '..'),
  entry: {
    main: [
      './src/client.js'
    ]
  },
  output: {
    path: config.STATIC_DIR
  },
  resolve: {
    modules: ['src', 'static', 'node_modules']
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        loaders: ['babel-loader', 'eslint-loader']
      },
      {
        test: /^(?!.*\.critical).*\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
              { loader: 'css-loader', query: { modules: true, importLoaders: 2, sourceMap: true } },
              { loader: 'postcss-loader' }
          ]
        }),
      },
      { test: /\.css$/, loaders: ['css-loader'] },
      { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, exclude: /node_modules/, loader: 'url-loader?limit=10000&mimetype=application/font-woff' },
      { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, exclude: /node_modules/, loader: 'url-loader?limit=10000&mimetype=application/font-woff' },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, exclude: /node_modules/, loader: 'url-loader?limit=10000&mimetype=application/octet-stream' },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, exclude: /node_modules/, loader: 'file-loader' },
      { test: webpackIsomorphicToolsPlugin.regular_expression('images'), exclude: /node_modules/, loader: 'url-loader?limit=10240' },
    ]
  },
  plugins: {},
};
