var path = require("path");
var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  context: __dirname,

  entry: {
    'js/stayhome': './pubsite/static/pubsite/js/app/index',
    'css/stayhome': './pubsite/static/pubsite/css/stayhome.scss'
  },

  output: {
      publicPath: '/static/pubsite/bundles/',
      path: path.resolve('./pubsite/static/pubsite/bundles/'),
      filename: "[name]-[hash].js",
  },

  plugins: [
    new BundleTracker({filename: './webpack-stats.json'}),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].bundle.css',
    })
  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
              presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      },
      {
          test: /\.(jpg|jpeg|png|svg)$/,
          use: [
              {
                  loader: 'file-loader',
                  options: {
                      name: 'img/[name].[ext]'
                  },
              },
          ]
      }
    ]
  },

  resolve: {
    extensions: ['*', '.js', '.jsx', '.scss']
  }

};