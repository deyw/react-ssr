require('babel-polyfill');

// Webpack config for development
var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var SvgStore = require('webpack-svgstore-plugin');
var HappyPack = require('happypack');
var happyThreadPool = HappyPack.ThreadPool({ size: 5 });

// var staticPath = path.resolve(__dirname, '../static');

module.exports = {
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, include: [path.resolve(__dirname, '..')], loaders: ['happypack/loader?id=jsx']},
      { test: /\.scss$/, loader: 'style-loader!css-loader?modules&importLoaders=2&sourceMap&localIdentName=[local]_[hash:base64:5]!postcss-loader' },
      { test: /\.css$/, loader: 'style-loader!css-loader?modules&importLoaders=2&sourceMap&localIdentName=[local]_[hash:base64:5]!postcss-loader' },
      { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
      { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader?limit=10000&mimetype=application/octet-stream" },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader" },
      { test: /\.png$/, loader: "url-loader?limit=100000"},
      { test: /\.jpg$/, loader: "url-loader?limit=100000"},
    ]
  },

  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      path.resolve(__dirname, '..'),
      'src',
      'static',
      'node_modules'
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
        __HELLO__: JSON.stringify('Hello, World!'),
        __WORLD__: JSON.stringify('world'),
        __STORY_BOOK__: JSON.stringify(`${process.env.STORY_BOOK}`)
    }),
    new HappyPack({
      id: 'jsx',
      loaders: ['babel-loader', 'eslint-loader'],
      threadPool: happyThreadPool
    }),
    new SvgStore(),

    // hot reload
    new webpack.IgnorePlugin(/webpack-stats\.json$/, /moment$/),
  ],
};