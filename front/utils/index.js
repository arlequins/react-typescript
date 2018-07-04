var path = require('path')
var config = require('../config')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const CleanWebPackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const OfflinePlugin = require('offline-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const S3Uploader = require('webpack-s3-uploader')

// the path(s) that should be cleaned
const pathsToClean = config.common.path.cleanUp

// the clean options to use
const cleanOptions = {
  root:     config.build.assetsCleanUpPath,
  exclude:  [],
  verbose:  true,
  dry:      false
}

let deployMode = !(process.argv.indexOf('--progress') >= 0)

const awsInfo = {
  id: process.env.AWS_ACCESS_KEY_ID,
  key: process.env.AWS_SECRET_ACCESS_KEY,
  bucket: process.env.AWS_BUCKET,
  path: process.env.BASE_PATH
}

if (awsInfo.key === undefined || awsInfo.key.length === 0) {
  deployMode = false
}

exports.deployMode = deployMode

exports.deployPath = process.env.DEPLOY_PATH

exports.devMode = !(process.argv.indexOf('-p') >= 0 || process.env.NODE_ENV === 'production')

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

exports.s3Uploader = new S3Uploader({
  s3Options: {
    accessKeyId: awsInfo.id,
    secretAccessKey: awsInfo.key
  },
  s3UploadOptions: {
    Bucket: awsInfo.bucket
  },
  basePath: awsInfo.path
})

exports.assetsPath = (_path) => {
  var assetsSubDirectory = config.build.assetsForCopyingSubDirectory
  return path.posix.join(assetsSubDirectory, _path)
}

exports.resolve = (dir) => {
  return path.join(config.dev.resolve, dir)
}
