const webpack = require('webpack')
const path = require('path')
const utils = require('./utils')
const nodeExternals = require('webpack-node-externals')
const config = utils.config
const mode = utils.mode
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const USER_NODE_ENV = {
  TOKEN_LS: process.env.TOKEN_LS !== undefined ? process.env.TOKEN_LS : 'setine/app',
  BASE_URL: process.env.BASE_URL !== undefined ? process.env.BASE_URL : 'http://localhost:3100',
  OUTER_API_URL: process.env.OUTER_API_URL !== undefined ? process.env.OUTER_API_URL : 'http://localhost:3100',
  INNER_API_URL: process.env.INNER_API_URL !== undefined ? process.env.INNER_API_URL : 'http://localhost:3100',
}

const webpackConfig = (webpack, path, utils, config, mode) => {
  let devMode = {
    devtool: 'source-map',
  }
  
  const COMMON_PLUGINS = [
    utils.copyWebpackPlugin,
    utils.copyImagesWebpackPlugin,
    utils.copyFontsWebpackPlugin,
    utils.manifestPlugin,
    // new BundleAnalyzerPlugin(),
  ]

  const indexFile = mode.dev ? 'development' : mode.build ? 'production' : 'universal'

  let initial = {
    entry: {
      'polyfill': [
        'babel-polyfill',
        'set-prototype-of',
        'raf-polyfill',
        './node_modules/classlist-polyfill/src/index.js',
        './node_modules/html5-history-api/history.js'
      ],
      'app': path.join(__dirname, config.common.path.src, 'client', `index.${indexFile}`),
    },
    output: {
      path: config.build.assetsJavascripts,
      filename: `${config.common.path.static}/js/[name].js`,
      chunkFilename: `${config.common.path.static}/js/[name].[chunkhash].js`,
      publicPath: mode.dev ? config.dev.webPackDevServer : config.build.assetsPublicPath,
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.json'],
      mainFields: ['module', 'browser', 'main'],
      alias: {
        '@': utils.resolve(config.common.path.src),
        public: utils.resolve(config.common.path.public),
        client: path.resolve(__dirname, 'src/client/'),
        server: path.resolve(__dirname, 'src/server/'),
        assets: path.resolve(__dirname, 'src/assets/'),
        types: path.resolve(__dirname, 'types/')
      }
    },
    module: {
      rules: [
        // .ts, .tsx
        {
          test: /\.(js|jsx|tsx)$/,
          include: [ /src\/js/, /node_modules\/axios/ ],
          exclude: /node_modules/,
          use: [
            !devMode && {
              loader: 'babel-loader',
              options: {
                plugins: ['react-hot-loader/babel']
              }
            },
            'ts-loader'
          ].filter(Boolean)
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
            mode.dev ? 'style-loader' : utils.MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: config.options.cssLoader
            },
            {
              loader: 'postcss-loader',
              options: {
                parser: 'sugarss',
                exec: true,
              }
            },
            'sass-loader'
          ]
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          loader: 'file-loader',
          options: {
            limit: 10000,
            name: utils.assetsPath('fonts/[name].[chunkhash].[ext]')
          }
        },
        {
          test: /\.(png|jpe?g|gif|svg|)(\?.*)?$/,
          loader: 'file-loader',
          options: {
            limit: 10000,
            name: utils.assetsPath('images/pages/[name].[chunkhash].[ext]')
          }
        }
      ]
    },
    plugins: mode.dev ? [
      new webpack.EnvironmentPlugin({
        NODE_ENV: 'development',
        DEBUG: true,
        ...USER_NODE_ENV,
      }),
      utils.miniCssExtractPlugin,
      ...COMMON_PLUGINS,
    ] : [
      new webpack.EnvironmentPlugin({
        NODE_ENV: 'production',
        DEBUG: false,
        ...USER_NODE_ENV,
      }),
      utils.miniCssExtractPlugin,
      utils.cleanWebPackPlugin,
      ...COMMON_PLUGINS,
    ],
    optimization: {
      minimizer: [
        utils.uglifyJsPlugin,
        utils.optimizeCSSAssetsPlugin
      ],
      splitChunks: {
        chunks: 'async',
        minSize: 30000,
        maxSize: 0,
        minChunks: 1,
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
        automaticNameDelimiter: '~',
        name: true,
        cacheGroups: {
          vendor: {
            chunks: "initial",
            test: path.resolve(process.cwd(), "node_modules"),
            name: "vendor",
            priority: -10,
            enforce: true
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'async',
            priority: 10,
            reuseExistingChunk: true,
            enforce: true
          },
          default: {
            minChunks: 5,
            priority: -20,
            reuseExistingChunk: true
          }
        }
      },
      runtimeChunk: true
    },
    devServer: {
      contentBase: [
        path.join(__dirname, 'src', 'assets'),
        path.join(__dirname, 'src', 'assets', 'pages'),
        path.join(__dirname, 'src', 'assets', 'pages', 'error' )
      ],
      watchContentBase: true,
      hot: true,
      inline: true,
      historyApiFallback: {
        index: '/'
      },
      stats: 'minimal',
      openPage: '',
      publicPath: '/'
    },
    node: {
      fs: 'empty',
      net: 'empty'
    },
    performance: {
      maxEntrypointSize: 256000,
      maxAssetSize: 256000,
      hints: false
    }
  }

  if (mode.dev || mode.build) {
    initial.plugins.push(utils.htmlWebpackPlugin)
  }

  if (mode.ssr) {
    initial.plugins.push(new webpack.DefinePlugin({
      'process.env.BROWSER': JSON.stringify(true),
      __isBrowser__: 'true'
    }))
  }

  if (mode.build || mode.ssr) {
    initial.plugins.push(utils.sWPrecacheWebpackPlugin)
  }

  return initial
}

const clientConfig = webpackConfig(webpack, path, utils, config, mode)

const serverConfig = {
  entry: "./src/server/index",
  target: "node",
  externals: [nodeExternals()],
  output: {
    path: path.join(__dirname, '..', 'express', 'server'),
    filename: "index.js",
    libraryTarget: "commonjs2",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    alias: {
      '@': utils.resolve(config.common.path.src),
      public: utils.resolve(config.common.path.public),
      client: path.resolve(__dirname, 'src/client/'),
      assets: path.resolve(__dirname, 'src/assets/'),
      dist: path.resolve(__dirname, 'dist')
    }
  },
  node: {
    __filename: false,
    __dirname: true
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: "css-loader/locals",
          },
          'sass-loader'
        ],
      },
      {
        test: /\.tsx?$/,
        exclude: /(node_modules)/,
        loader: "awesome-typescript-loader",
      },
      {
        test: /\.ts$/,
        enforce: 'pre',
        loader: 'tslint-loader',
        options: config.options.tslintLoader
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
          name: utils.assetsPath('images/pages/[name].[hash:7].[ext]')
        }
      }
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
      DEBUG: false,
      ...USER_NODE_ENV,
    }),
    new webpack.DefinePlugin({
      'process.env.BROWSER': JSON.stringify(false),
      __isBrowser__: 'false'
    }),
    utils.copyServerWebpackPlugin,
    utils.cleanWebPackServerPlugin
  ]
};

if (mode.dev) {
  module.exports = clientConfig
} else if (mode.build) {
  module.exports = clientConfig
} else if (mode.ssr) {
  module.exports = [ clientConfig, serverConfig ]
}
