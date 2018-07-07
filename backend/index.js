const config = require('./config')
const restify = require('restify')
const mongoose = require('mongoose')
const restifyPlugins = require('restify').plugins
const OAuthServer = require('restify-oauth-server')
// const seeds = require('./seed')

/**
  * Initialize Server
  */
const server = restify.createServer({
	name: config.name,
	version: config.version,
})

/**
  * Middleware
  */
server.oauth = new OAuthServer({
	model: require('./models'),
  accessTokenLifetime: 5 * 60 * 60
})

server.pre(function(req, res, next) {
  if(req.headers['content-type'] === 'application/x-www-url-formencoded') req.body = req.params;
  return next();
})

server.use(restifyPlugins.jsonBodyParser({ mapParams: true }))
server.use(restifyPlugins.acceptParser(server.acceptable))
server.use(restifyPlugins.queryParser({ mapParams: true }))
server.use(restifyPlugins.authorizationParser())
server.use(restifyPlugins.fullResponse())

/**
  * Start Server, Connect to DB & Require Routes
  */
server.listen(config.port, () => {
	// establish connection to mongodb
	mongoose.Promise = global.Promise
	mongoose.connect(config.db.uri, { useNewUrlParser: true })
	const db = mongoose.connection
	db.on('error', (err) => {
		console.error(err)
		process.exit(1)
	})
	db.once('open', () => {
		// seeds()
		require('./routes')(server, config.apiUrl)
		console.log(`Server is listening on port ${config.port}`)
	})
})
