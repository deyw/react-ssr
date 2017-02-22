const path = require('path');

const staticPath = path.resolve(__dirname, '../static');

const AUTOPREFIXER_BROWSERS = [
  'Android 2.3',
  'Android >= 4',
  'Chrome >= 35',
  'Firefox >= 31',
  'Explorer >= 10',
  'iOS >= 7',
  'Opera >= 12',
  'Safari >= 7.1',
];

module.exports = {
  plugins: [
    require('postcss-import')({
      // addDependencyTo: webpack,
      path: [
        `${process.cwd()}/src/styles/`,
        `${process.cwd()}/src/components/`
      ],
    }),
    require('precss')(),
    require('rucksack-css')(),
    require('postcss-calc')({
      mediaQueries: true
    }),
    require('postcss-color-function')(),
    require('postcss-inline-svg')({
      path: path.join(staticPath, 'icons', 'inline'),
    }),
    require('postcss-svgo'),
    require('autoprefixer')({
      browsers: AUTOPREFIXER_BROWSERS
    }),
  ]
};
