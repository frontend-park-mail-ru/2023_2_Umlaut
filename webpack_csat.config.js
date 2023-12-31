const path = require('path');
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack5-plugin');
const CopyPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  entry: ['./csat/index.js'], 
  output: {
    filename: 'main.js',
    path: path.resolve( __dirname, 'dist', 'csat')
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
    ]
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: 'index.css',
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'csat/index.html'),
          to: path.resolve(__dirname, 'dist/csat/')
        }
      ]
    })
  ]
};