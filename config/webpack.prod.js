'use strict';
const webpack = require('webpack')
const config = require('config');
const path = require('path');
const root = config.get('root'); // webpack want absolute path
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const webpackConfig = merge(baseWebpackConfig, {
  output: {
    filename: '[name].[hash].js',
    path: path.resolve(root, './statics'),
    publicPath: `${config.get('onlineHost')}/@/statics/`,
  },
  entry: {
    app: [path.resolve(root, './src/client/main.ts')]
  },
  plugins: [
    new UglifyJSPlugin(),
  ],
});

module.exports = webpackConfig;
