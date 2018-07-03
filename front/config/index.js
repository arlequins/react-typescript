const path = require('path')
const devMode = process.env.NODE_ENV !== 'production'

const rootPath = {
  absolutePath: path.join(__dirname, '..'),
  relativePath: './'
}

const commonPath = {
  src: 'src',
  static: 'static',
  public: 'public',
  publish: 'dist',
  cleanUp: ['dist']
}

module.exports = {
  common: {
    path: commonPath
  },
  options: {
    tslintLoader: {
      configFile: 'tslint.json',
      tsConfigFile: 'tsconfig.json'
    },
    cssLoader: {
      modules: true,
      importLoaders: 1,
      localIdentName: !devMode ? '[hash:base64:5]' : '[local]__[hash:base64:5]',
      sourceMap: true,
      minimize: true,
      camelCase: true
    },
    postCssLoader: {
      parserpath: 'config/postcss.config.js'
    }
  },
  dev: {
    assetsPublicPath : '',
    template: path.join(rootPath.absolutePath, commonPath.src, 'assets', 'index.html'),
    filename: path.join('index.html'),
    resolve: path.join(rootPath.absolutePath, '.'),
    port: 8080
  },
  build: {
    assetsCleanUpPath: `${rootPath.absolutePath}`,
    assetsPublicPath: `${rootPath.relativePath}`,
    assetsJavascripts: path.join(rootPath.absolutePath, commonPath.publish),
    assetsForCopyingSubDirectory: path.join(rootPath.relativePath, commonPath.static),
    miniCssExtractPlugin: {
      filename: `${commonPath.static}/css/[name].css`,
      chunkFilename: `${commonPath.static}/css/[id].css`
    }
  }
}
