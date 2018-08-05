const path = require('path')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const CleanWebPackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')

const rawMode = {
  dev: process.argv.indexOf('--progress') >= 0,
  build: process.argv.indexOf('--colors') >= 0,
}

const additionalMode = {
  ssr: !rawMode.dev && !rawMode.build,
}

const mode = {
  ...rawMode,
  ...additionalMode,
}

console.log(mode)

const rootPath = {
  absolutePath: path.join(__dirname, '..'),
  relativePath: '',
  sitePath: '/'
}

const publish = ['dist', '../express/dist']

const commonPath = {
  src: 'src',
  static: 'static',
  public: 'public',
  publish: mode.dev? publish[0] : publish[1],
  server: '../express/server',
}

const config = {
  common: {
    path: commonPath
  },
  options: {
    tslintLoader: {
      configFile: 'tslint.json',
      tsConfigFile: 'tsconfig.json'
    },
    cssLoader: {
      importLoaders: 1,
      modules: true,
      localIdentName: !mode.dev ? '[hash:base64:5]' : '[local]__[hash:base64:5]',
      sourceMap: true,
      minimize: true,
      camelCase: true
    },
  },
  dev: {
    assetsPublicPath : '',
    webPackDevServer: 'http://localhost:5000/',
    title: 'index',
    template: path.join(rootPath.absolutePath, commonPath.src, 'assets', 'index.html'),
    filename: path.join('index.html'),
    resolve: path.join(rootPath.absolutePath, '/'),
    port: 5000
  },
  build: {
    assetsCleanUpPath: `${rootPath.absolutePath}`,
    assetsPublicPath: `${rootPath.sitePath}`,
    assetsJavascripts: path.join(rootPath.absolutePath, commonPath.publish),
    assetsForCopyingSubDirectory: path.join(rootPath.relativePath, commonPath.static),
  }
}

// the clean options to use
const cleanOptions = {
  root:     config.build.assetsCleanUpPath,
  allowExternal: true,
  exclude:  [],
  verbose:  true,
  dry:      false
}

exports.mode = mode

exports.config = config

exports.MiniCssExtractPlugin = MiniCssExtractPlugin

exports.miniCssExtractPlugin = new MiniCssExtractPlugin({
  filename: `${commonPath.static}/css/[name].css`,
  chunkFilename: `${commonPath.static}/css/[name].[chunkhash].css`
})

exports.copyWebpackPlugin = new CopyWebpackPlugin([{
    from: `${config.common.path.public}/*`,
    to: '[name].[ext]',
    toType: 'template',
    cache: true
  }],
  {
    ignore: [ '*.html', '*.css', '*.png', '*.jpg', '*.jpeg', '*.gif', '*.svg', '*.woff2', '*.eot', '*.ttf', '*.otf', '.DS_Store']
  }
)

exports.copyServerWebpackPlugin = new CopyWebpackPlugin([{
    from: `src/server/templates`,
    to: 'templates/[name].[ext]',
    toType: 'template',
    cache: true
  }]
)

exports.copyImagesWebpackPlugin = new CopyWebpackPlugin([{
    from: `${config.common.path.public}/images`,
    to: 'static/images',
    cache: true
  }],
  {
    ignore: [ 'pages/**/*.*', '.DS_Store' ]
  }
)

exports.copyFontsWebpackPlugin = new CopyWebpackPlugin([{
    from: `${config.common.path.public}/fonts`,
    to: 'static/fonts',
    cache: true
  }],
  {
    ignore: [ '.DS_Store' ]
  }
)

exports.htmlWebpackPlugin = new HtmlWebPackPlugin({
  title: config.dev.title,
  template: config.dev.template,
  filename: config.dev.filename,
})

exports.cleanWebPackPlugin = new CleanWebPackPlugin(commonPath.publish, cleanOptions)

exports.cleanWebPackServerPlugin = new CleanWebPackPlugin(commonPath.server, cleanOptions)

exports.uglifyJsPlugin = new UglifyJsPlugin({
  cache: true,
  parallel: true,
  sourceMap: false
})

exports.optimizeCSSAssetsPlugin = new OptimizeCSSAssetsPlugin({})

exports.manifestPlugin = new ManifestPlugin({
  fileName: 'assets.json',
  basePath: '/'
})

exports.sWPrecacheWebpackPlugin = new SWPrecacheWebpackPlugin({
    cacheId: 'app',
    dontCacheBustUrlsMatching: /\.\w{8}\./,
    filename: 'sw.js',
    minify: true,
    navigateFallback: '/',
    staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/, /\.(png|jpe?g|gif|svg|)(\?.*)?$/]
  }
)

exports.assetsPath = (_path) => {
  var assetsSubDirectory = config.build.assetsForCopyingSubDirectory
  return path.posix.join(assetsSubDirectory, _path)
}

exports.resolve = (dir) => {
  return path.join(config.dev.resolve, dir)
}
