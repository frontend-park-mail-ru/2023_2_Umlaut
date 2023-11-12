const path = require('path');
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack5-plugin');

module.exports = {
  entry: ['./public/index.js'],
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },

  module: {
    rules: [
      { test: /\.hbs$/, loader: "handlebars-loader" },
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
    new ServiceWorkerWebpackPlugin({
        entry: path.join(__dirname, 'public/sw.js'),
    })
  ]
};