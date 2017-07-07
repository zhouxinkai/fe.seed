'use strict';
const webpack = require('webpack')
const config = require('config');
const path = require('path');
const root = config.get('root'); // webpack want absolute path
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base');

const webpackConfig = merge(baseWebpackConfig, {
  entry: {
    app: [path.resolve(root, './src/client/main.ts'), 'webpack/hot/dev-server', `webpack-dev-server/client?http://localhost:${config.get('webpack.port')}`],
    // vendor: ['vue', 'vuex', 'vue-router', 'axios']
  },
  output: {
    filename: '[name].js',
    path: path.resolve(root, './statics'),
    publicPath: `http://${require('ip').address()}:${config.get('webpack.port')}/statics/`,
  },
  module: {
    rules: [{
      test: /(components\/|pages\/).*\.(js|ts)$/,
      use: [{
        loader: 'vue-component-loader',
      }]
    }]
  },
  devtool: 'source-map',
  plugins: [
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
  ],
  resolveLoader: {
    modules: ['node_modules', 'web_loaders'],
  }
});

module.exports = webpackConfig;
