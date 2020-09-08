const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    'cell-selection': './src/client/js/scripts/cell-selection.js',
    'sign-tabs': './src/client/js/scripts/sign-tabs.js',
    toolbar: './src/client/js/scripts/toolbar.js',
    'register-page': './src/client/js/scripts/register-page.js',
    'personal-account-page': './src/client/js/scripts/personal-account-page.js',
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
