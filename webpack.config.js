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
        { test: /\.hbs$/, loader: "handlebars-loader" }
    ]
  },

  plugins: [
    new ServiceWorkerWebpackPlugin({
        entry: path.join(__dirname, 'public/sw.js'),
    })
  ]
};