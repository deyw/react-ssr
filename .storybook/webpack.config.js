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
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, include: [path.resolve(__dirname, '..')], loaders: ['babel-loader', 'eslint-loader']},
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.sass$/, loader: 'style-loader!css-loader?modules&importLoaders=2&sourceMap&localIdentName=[local]_[hash:base64:5]!postcss-loader!sass-loader?precision=10&indentedSyntax=sass' },
      { test: /\.scss$/, loader: 'style-loader!css?modules&importLoaders=2&sourceMap&localIdentName=[local]_[hash:base64:5]!postcss-loader' },
      { test: /\.css$/, loader: 'style!css?modules&importLoaders=2&sourceMap&localIdentName=[local]_[hash:base64:5]!postcss' },
      { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff" },
      { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff" },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream" },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file" },
      { test: /\.png$/, loader: "url-loader?limit=100000"},
      { test: /\.jpg$/, loader: "url-loader?limit=100000"},
    ]
  },

  resolve: {
    extensions: ['', '.js', '.jsx'],
    root: path.resolve(__dirname, '..'),
    modulesDirectories: [
      'src',
      'static',
      'node_modules'
    ],
  },

  progress: true,

  plugins: [
    // new HappyPack({ id: 'jsx',  enabled: true, threadPool: happyThreadPool, }),
    // new HappyPack({ id: 'scss',  enabled: true, threadPool: happyThreadPool, }),
    // new HappyPack({ id: 'css',  enabled: true, threadPool: happyThreadPool, }),

    new SvgStore(),

    // hot reload
    new webpack.IgnorePlugin(/webpack-stats\.json$/, /moment$/),
    new webpack.DefinePlugin({
      __STATIC_SERVER_URL__: `'${process.env.STATIC_SERVER_URL}'`,
      __ELASTIC_URL__: `'${process.env.ELASTIC_URL}'`,
    }),
  ],
};