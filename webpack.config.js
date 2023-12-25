const path = require('path');
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack5-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = {
  entry: ['./public/index.js'],
  output: {
    filename: 'main.js',
    path: path.resolve( __dirname, 'dist')
  },

  module: {
    rules: [
      { test: /\.hbs$/, loader: "handlebars-loader" },
      {
        test: /\.s?css$/,
        use: [
          {
              loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.js$/,
        include: /public/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: "defaults" }]
            ]
          }
        }
      },
      {
        test: /\.(jpe?g|png)$/i,
        type: "asset",
      },
    ]
  },

  optimization: {
    minimizer: [
      new CssMinimizerPlugin(),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.sharpMinify,
          options: {
            encodeOptions: {},
          },
        },
      }),
    ],
  },

  plugins: [
    new ServiceWorkerWebpackPlugin({
        entry: path.join(__dirname, 'public/sw.js'),
    }),
    new MiniCssExtractPlugin({
      filename: 'index.css',
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'public/index.html'),
          to: path.resolve(__dirname, 'dist')
        },
        {
          from: path.resolve(__dirname, 'static'),
          to: path.resolve(__dirname, 'dist/')
        }
      ]
    })
  ]
};