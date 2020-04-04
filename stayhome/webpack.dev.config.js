var config = require('./webpack.base.config.js')
var webpack = require('webpack')

// Mode
config.mode = 'development'

// Override django’s STATIC_URL for webpack bundles
config.output.publicPath = 'http://localhost:3000/pubsite/static/pubsite/bundles/'

config.devServer = {
  contentBase: './pubsite/static/pubsite/bundles/',
}

module.exports = config