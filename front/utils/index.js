var path = require('path')
var config = require('../config')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const CleanWebPackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const OfflinePlugin = require('offline-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

// the path(s) that should be cleaned
const pathsToClean = config.common.path.cleanUp

// the clean options to use
const cleanOptions = {
  root:     config.build.assetsCleanUpPath,
  exclude:  [],
  verbose:  true,
  dry:      false
}

exports.devMode = process.env.NODE_ENV !== 'production'

exports.MiniCssExtractPlugin = MiniCssExtractPlugin

exports.miniCssExtractPlugin = new MiniCssExtractPlugin({
  // // Options similar to the same options in webpackOptions.output
  // // both options are optional
  filename: config.build.miniCssExtractPlugin.filename,
  chunkFilename: config.build.miniCssExtractPlugin.chunkFilename
})

exports.offlinePlugin = new OfflinePlugin({
  autoUpdate: 1000 * 60 * 60 * 24
})

exports.copyWebpackPlugin = new CopyWebpackPlugin([
  {
    from: `${config.common.path.public}/*`,
    to: '[name].[ext]',
    toType: 'template',
    cache: true
  }],
  {
    ignore: [ '*.html', '*.css', '*.png', '*.jpg', '*.jpeg', '*.gif', '*.svg', '*.woff2', '*.eot', '*.ttf', '*.otf' ]
  }
)

exports.htmlWebpackPlugin = new HtmlWebPackPlugin({
  template: config.dev.template,
  filename: config.dev.filename
})

exports.cleanWebPackPlugin = new CleanWebPackPlugin(pathsToClean, cleanOptions)

exports.uglifyJsPlugin = new UglifyJsPlugin({
  cache: true,
  parallel: true,
  sourceMap: true // set to true if you want JS source maps
})

exports.optimizeCSSAssetsPlugin = new OptimizeCSSAssetsPlugin({})

exports.assetsPath = (_path) => {
  var assetsSubDirectory = config.build.assetsForCopyingSubDirectory
  return path.posix.join(assetsSubDirectory, _path)
}

exports.resolve = (dir) => {
  return path.join(config.dev.resolve, dir)
}
