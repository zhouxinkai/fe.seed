'use strict';
const webpack = require('webpack')
const config = require('config');
const path = require('path');
const root = config.get('root'); // webpack want absolute path

const tsConfig = require(path.resolve(root, './src/client/tsconfig'));
const clientTsOptions = Object.assign({}, tsConfig);

// 如何把 webpack-dev-server 的 hot-load 通知到 node server
// http://www.boiajs.com/2015/08/25/webpack-dev-server-and-express-server
const webpackConfig = {

  module: {
    rules: [
      {
        test: /\.ts?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: clientTsOptions,
      },
      {
        test: /\.html$/,
        loader: 'vue-template-loader'
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader?minimize',
          'postcss-loader',
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: 'statics/imgs/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: 'statics/fonts/[name].[hash:7].[ext]'
        }
      },
      {
        test: /routes\.json$/,
        loader: 'router-loader',
      }
    ]
  },

  // http://www.ferecord.com/webpack-summary.html#resolve
  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      components: path.resolve(root, 'src/client/components'),
      pages: path.resolve(root, 'src/client/pages'),
      utils: path.resolve(root, 'src/client/utils'),
      declarations: path.resolve(root, 'src/declarations'),
      store: path.resolve(root, 'src/client/store'),
      styles: path.resolve(root, 'src/client/styles'),
      client: path.resolve(root, 'src/client')
    }
  },
  resolveLoader: {
    modules: ['node_modules', 'web_loaders'],
  }
};

module.exports = webpackConfig;
