import * as bodyParser from 'body-parser'
import cors from 'cors'
import * as express from 'express'
import * as path from 'path'
import * as serveStatic from 'serve-static'
import { Cors as corsOptions } from './config'
import { Assets } from './helpers'
import { Handler404, Handler500 }  from './middlewares'
import { ReactSSR } from './routes'

const publicPath = path.join(__dirname, '..', '..', 'dist')
const templatesPath = path.join(__dirname, '..', '..', 'server', 'templates')
const port = 3000
const app = express()

app.set('views', templatesPath)
app.set('view engine', 'ejs')

// tslint:disable
require('./middlewares/logger').initRequestLogger(app)

// middleware
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors(corsOptions))

// service-worker
app.use('/sw.js', serveStatic(path.join(publicPath, 'sw.js')))
app.use('/manifest.json', serveStatic(path.join(publicPath, 'manifest.json')))
app.use('/favicon.ico', serveStatic(path.join(publicPath, 'favicon.ico')))

// static
app.use('/static', express.static(path.join(publicPath, 'static')))

// routes
app.use('/', ReactSSR(Assets))

// error handlers
app.use(Handler500(app.get('env')))
app.use(Handler404)

app.listen(port, (error: any) => {
  if (error) {
    /* tslint:disable */
    console.error(JSON.stringify(error, null, 2))
  } else {
    /* tslint:disable */
    console.info('==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.', port, port)
  }
})
