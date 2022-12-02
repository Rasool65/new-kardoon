const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const outputFileName = 'bundle';
module.exports = {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    https: true,
    hot: true,
    open: true,
  },
  output: {
    path: path.resolve(__dirname, '..', './dist'),
    filename: `${outputFileName}.js`,
    publicPath: '/',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `${outputFileName}.css`,
    }),
  ],
};
