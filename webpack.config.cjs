const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    'cell-selection': './src/client/js/scripts/cell-selection.js',
    'sign-tabs': './src/client/js/scripts/sign-tabs.js',
    toolbar: './src/client/js/scripts/toolbar.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/scripts/[name].js',
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/client/img',
          to: 'img',
        },
        {
          from: 'src/client/styles',
          to: 'styles',
        },
        {
          from: 'src/client/*.html',
          to: '[name].html',
        },
      ],
    }),
  ],
  optimization: {
    minimize: false,
  },
};
