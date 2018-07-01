const path = require('path')
const utils = require('./utils')
const config = require('./config')
const devMode = utils.devMode

module.exports = {
  entry: {
    'shim-ie9': ['./node_modules/classlist-polyfill/src/index.js', './node_modules/html5-history-api/history.js'],
    'app': path.join(__dirname, config.common.path.src, 'index.tsx')
  },
  output: {
    path: config.build.assetsJavascripts,
    filename: `${config.common.path.static}/js/[name].js`,
    publicPath: devMode ? config.dev.assetsPublicPath : config.build.assetsPublicPath
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    alias: {
      '@': utils.resolve(config.common.path.src),
      '#': utils.resolve(config.common.path.public)
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|tsx)$/,
        include: [ /src\/js/, /node_modules\/axios/ ],
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader'
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader'
      },
      {
        test: /\.ts$/,
        enforce: 'pre',
        loader: 'tslint-loader',
        options: config.options.tslintLoader
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          devMode ? 'style-loader' : utils.MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: config.options.cssLoader
          },
          {
            loader: 'postcss-loader',
            options: config.options.postCssLoader
          },
          'sass-loader'
        ]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[ext]')
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg|)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('images/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins: devMode ? [
    utils.miniCssExtractPlugin,
    utils.htmlWebpackPlugin,
    utils.copyWebpackPlugin
  ] : [
    utils.miniCssExtractPlugin,
    utils.cleanWebPackPlugin,
    utils.htmlWebpackPlugin,
    utils.copyWebpackPlugin,
    utils.offlinePlugin
  ],
  optimization: {
    minimizer: [
      utils.uglifyJsPlugin,
      utils.optimizeCSSAssetsPlugin
    ]
  },
  devtool: 'source-map',
  externals: {
    // 'jquery': '$'
    // 'react': 'React',
    // 'react-dom': 'ReactDOM'
  }
}
