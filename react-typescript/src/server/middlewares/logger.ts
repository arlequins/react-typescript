// tslint:disable
const morgan = require('morgan')
const path = require('path')
const stackTrace = require('stack-trace')
const moment = require('moment-timezone')
const {
  createLogger,
  format,
  transports
} = require('winston')
require('winston-daily-rotate-file')

const target = 'app'
const prefix = `setine-${target}`
const LOGS_DIR = process.env.LOG_LEVEL !== 'nodemon' ? `/var/log/${target}` : path.join(__dirname, '..', '..', '..', 'log')

const myFormat = format.printf((info: any) => {
  return info.message.replace('\n', '')
})

const WINSTON_LOGGER_CONFIG = {
  format: format.combine(
    myFormat
  ),
  exitOnError: false,
}

const LOGGER_COMMON_CONFIG = {
  colorize: false,
  prepend: true,
  datePattern: 'YYYY_MM_DD',
  handleExceptions: true,
  maxsize: 1024 * 1024 * 10,
  maxFiles: '14d',
}

morgan.token('date', () => {
  return moment().tz('Asia/Tokyo').format()
})

morgan.format('myformat', ':remote-addr - :remote-user [:date[Asia/Tokyo]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"')

const logger = createLogger({
  transports: [
    new transports.DailyRotateFile({
      name: 'error',
      level: 'error',
      filename: `${LOGS_DIR}/${prefix}-error.log`,
      ...LOGGER_COMMON_CONFIG,
    }),
    new transports.DailyRotateFile({
      name: 'warn',
      level: 'warn',
      filename: `${LOGS_DIR}/${prefix}-warn.log`,
      ...LOGGER_COMMON_CONFIG,
    }),
    new transports.DailyRotateFile({
      name: 'normal',
      level: 'info',
      filename: `${LOGS_DIR}/${prefix}-normal.log`,
      ...LOGGER_COMMON_CONFIG,
    }),
  ],
  ...WINSTON_LOGGER_CONFIG,
})

const accessLogger = createLogger({
  transports: [
    new transports.DailyRotateFile({
      name: 'access',
      level: 'info',
      filename: `${LOGS_DIR}/${prefix}-access.log`,
      ...LOGGER_COMMON_CONFIG,
    }),
  ],
  ...WINSTON_LOGGER_CONFIG,
})

logger.stream = {
  write: function (data: any) {
    accessLogger.info(data)
  }
}

const Logger = {
  initRequestLogger: function (app: any) {
    app.use(
      morgan('myformat', {
        stream: logger.stream,
        skip: function (req: any) {
          if (req.url == '/healthcheck' || req.url == '/healthcheck/'
          || req.url == '/service-worker.js'
          || req.originalUrl.startsWith('/assets.json?')
          || req.originalUrl.startsWith('/static/')) {
            return true
          } else {
            return false
          }
        },
      })
    )
  },

  debug: function () {
    if (process.env['NODE_ENV'] === 'development') {
      let cellSite = stackTrace.get()[1];
      logger.debug.apply(
        logger, [
          ...arguments,
          {
            FilePath: cellSite.getFileName(),
            LineNumber: cellSite.getLineNumber(),
          }
        ]
      );
    }
  },

  info: function () {
    let cellSite = stackTrace.get()[1];
    logger.info.apply(
      logger, [
        ...arguments,
        {
          FilePath: cellSite.getFileName(),
          LineNumber: cellSite.getLineNumber(),
        }
      ]
    )
  },

  warn: function () {
    let cellSite = stackTrace.get()[1];
    logger.warn.apply(
      logger, [
        ...arguments,
        {
          FilePath: cellSite.getFileName(),
          LineNumber: cellSite.getLineNumber(),
        }
      ]
    )
  },

  error: function () {
    let cellSite = stackTrace.get()[1]
    logger.error.apply(
      logger, [
        ...arguments,
        {
          filePath: cellSite.getFileName(),
          lineNumber: cellSite.getLineNumber(),
        },
      ]
    )
  },
}

module.exports = Logger
