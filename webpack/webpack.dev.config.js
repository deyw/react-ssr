const path = require('path');
const webpack = require('webpack');
const WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
const HappyPack = require('happypack');

const config = require('./config.js');
const isomorphicConfig = require('./isomorphic.config');

const webpackIsomorphicToolsPlugin =
  new WebpackIsomorphicToolsPlugin(isomorphicConfig).development();
const AUTOPREFIXER_BROWSERS = config.autoprefixerBrowsers;

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
    path: path.resolve(config.STATIC_DIR),
    filename: 'dist/[name]-[hash].js',
    chunkFilename: 'dist/[name]-[chunkhash].js',
    publicPath: `http://localhost:${config.HMR_PORT}/`
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.css', '.scss'],
    modules: ['src', 'node_modules']
  },
  module: {
    rules: [
      // {
      //   test: /\.jsx?$/,
      //   exclude: /node_modules/,
      //   loader: 'happypack/loader?id=jsx'
      // },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
        { test: /\.json$/, loader: 'json-loader' },
        { test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff' },
        { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=application/octet-stream' },
        { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader' },
        { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=image/svg+xml' },
        { test: webpackIsomorphicToolsPlugin.regular_expression('images'), loader: 'url-loader?limit=10240' },
    ],
    noParse: /\.min\.js/
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        SSR_PORT: JSON.stringify(process.env.SSR_PORT),
        DEBUG: JSON.stringify(process.env.DEBUG)
      },
      __DEV__: process.env.NODE_ENV !== 'production',
      __DISABLE_SSR__: false,
      __CLIENT__: true,
      __SERVER__: false,
    }),
    new HappyPack({
      id: 'jsx',
      threads: 4,
      loaders: [{
        path: 'babel-loader',
        query: {
          babelrc: false,
          // plugins: [
          //   'transform-runtime'
          // ],
          presets: ['react', 'stage-3', ['latest', { es2015: { modules: false } }]],
          plugins: ['react-hot-loader/babel'],
          cacheDirectory: false
        }
      }]
    }),
    webpackIsomorphicToolsPlugin,
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.IgnorePlugin(/webpack-stats\.json$/),
    new webpack.LoaderOptionsPlugin({
      options: {
        context: path.resolve(__dirname, '..'),
        postcss: [
          require('postcss-import')({
          // addDependencyTo: webpack,
            path: [
              `${process.cwd()}/src/styles/`,
              `${process.cwd()}/src/components/`
            ],
          }),
          require('precss')(),
          require('rucksack-css')(),
          require('postcss-calc')({ mediaQueries: true }),
          require('postcss-color-function')(),
          require('postcss-inline-svg')({
            path: path.join(config.STATIC_DIR, 'icons', 'inline'),
          }),
          require('postcss-svgo'),
          require('autoprefixer')({ browsers: AUTOPREFIXER_BROWSERS }),
        ]
      }
    }),

  ]
};

