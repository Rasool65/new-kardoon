const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');

const cssLoaders = (extra) => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
    },
    { loader: 'css-loader', options: { importLoaders: 2 } },
  ];

  loaders.push('postcss-loader');

  if (extra) {
    loaders.push(extra);
  }

  return loaders;
};
module.exports = {
  entry: path.resolve(__dirname, '..', './src/index.tsx'),
  resolve: {
    modules: [path.resolve(__dirname, './src'), 'node_modules'],
    extensions: ['.ts', '.tsx', '.js', '.png', '.json', '.svg'],
    enforceExtension: false,
    mainFiles: ['index'],
    alias: {
      src: path.resolve(__dirname, 'src/'),
      '@src': path.resolve(__dirname, '../src'),
      '@styles': path.resolve(__dirname, '../src/scss'),
      '@hooks': path.resolve(__dirname, '../src/utility/hooks'),
      '@configs': path.resolve(__dirname, '../src/configs'),
      '@layouts': path.resolve(__dirname, '../src/layouts'),
      '@store': path.resolve(__dirname, '../src/redux'),
      '@components': path.resolve(__dirname, '../src/components'),
    },
    fallback: {
      fs: false,
      tls: false,
      net: false,
      path: false,
      zlib: false,
      http: false,
      https: false,
      stream: false,
      crypto: false,
    },
  },
  devServer: {
    port: 2000,
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      {
        test: /\.css$/,
        use: cssLoaders(),
      },
      {
        test: /\.s[ac]ss$/,
        use: cssLoaders('sass-loader'),
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name][ext]',
        },
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[name][ext]',
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '..', './public/index.html'),
    }),
    new CopyPlugin({
      patterns: [
        { from: 'public/favicon.ico', to: 'favicon.ico' },
        { from: 'public/serviceWorker.js', to: 'serviceWorker.js' },
      ],
    }),
    new WebpackPwaManifest({
      filename: 'manifest.json',
      name: 'کار رو به کاردون بسپار!',
      short_name: 'کاردون',
      description: 'نرم افزار مدیریت درخواست های مشتریان و تکنسین ها',
      background_color: '#000000',
      display: 'standalone',
      start_url: '.',
      orientation: 'portrait',
      crossorigin: 'use-credentials', //can be null, use-credentials or anonymous
      ios: true,
      inject: true,
      icons: [
        {
          src: path.resolve('public/assets/logo.png'),
          sizes: [96, 128, 192, 256, 384, 512], // multiple sizes
        },
        {
          src: path.resolve('public/assets/solid-logo.png'),
          size: '1024x1024', // you can also use the specifications pattern
        },
        {
          src: path.resolve('public/assets/logo.png'),
          size: '1024x1024',
          purpose: 'maskable',
        },
      ],
    }),
  ],
  stats: 'errors-only',
};
