const path = require('path');
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack5-plugin');

module.exports = {
  entry: ['./public/index.js'],
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new ServiceWorkerWebpackPlugin({
        entry: path.join(__dirname, 'public/sw.js'),
    })
  ]
};