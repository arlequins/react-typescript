/**
 * Module dependencies.
 */

const NodeOAuthServer = require('oauth2-server')
const Request = require('oauth2-server').Request
const Response = require('oauth2-server').Response
const InvalidArgumentError = require('oauth2-server/lib/errors/invalid-argument-error')
const UnauthorizedRequestError = require('oauth2-server/lib/errors/unauthorized-request-error')

/**
 * Handle response.
 */

const handleResponse = (req, res, response) => {
  res.set(response.headers)
  res.status(response.status)
  res.send(response.body)
}

/**
 * Handle error.
 */

const handleError = (e, req, res, response) => {
  if (response) {
    res.set(response.headers)
  }

  res.status(e.code)
  res.send({ error: e.name, error_description: e.message })
}

/**
 * Constructor.
 */
const RestifyOAuthServer = function (options) {
  options = options || {}

  if (!options.model) {
    throw new InvalidArgumentError('Missing parameter: `model`')
  }

  this.server = new NodeOAuthServer(options)
}

/**
 * Authentication Middleware.
 *
 * Returns a middleware that will validate a token.
 *
 */

RestifyOAuthServer.prototype.authenticate = function (options) {
  const server = this.server

  return async(req, res, next) => {
    const request = new Request(req)
    const response = new Response(res)

    try {
      const token = await server.authenticate(request, response, options)
      res.oauth = { token: token }
    } catch(e) {
      return handleError(e, req, res)
    } finally {
      next
    }
  }
}

/**
 * Authorization Middleware.
 *
 * Returns a middleware that will authorize a client to request tokens.
 *
 */

RestifyOAuthServer.prototype.authorize = function (options) {
  const server = this.server

  return async(req, res, next) => {
    const request = new Request(req)
    const response = new Response(res)

    try {
      const code = await server.authorize(request, response, options)
      res.oauth = { code: code }
      return handleResponse(req, res, response)
    } catch(e) {
      return handleError(e, req, res, response)
    } finally {
      next
    }
  }
}

/**
 * Grant Middleware.
 *
 * Returns middleware that will grant tokens to valid requests.
 *
 */

RestifyOAuthServer.prototype.token = function (options) {
  const server = this.server

  return async(req, res, next) => {
    const request = new Request(req)
    const response = new Response(res)

    console.log(request.body.)
    const requestParams = request.body
    if (requestParams.grant_type.hasOwnProperty('grant_type')) {
      if (requestParams.grant_type === 'refresh_token') {

      }
    }

    try {
      const token = await server.token(request, response, options)
      res.oauth = { token: token }
      return handleResponse(req, res, response)
    } catch(e) {
      return handleError(e, req, res, response)
    } finally {
      next
    }
  }
}

/**
 * Export constructor.
 */

module.exports = RestifyOAuthServer
