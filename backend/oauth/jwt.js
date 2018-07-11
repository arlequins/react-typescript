const createJwt = require('jsonwebtoken')
const setjwtInfo = require('../config').setjwtInfo
const lifetime = {
  accessToken: 30 * 60 * 60
}

/**
 * Generate access token.
 */

const generateAccessTokenBasedJWT = (client, user, scope, accessTokenExpiresAt) => {
  const today = Date.now()
  const expiredDate = Date.parse(accessTokenExpiresAt)
  const expired = Math.floor((expiredDate - today) / 1000)
  const jwtInfo = setjwtInfo(client, user, scope, expired)
  return createJwt.sign(jwtInfo)
}

/**
 * Module dependencies.
 */

const AbstractGrantType = require('oauth2-server/lib/grant-types/abstract-grant-type')
const InvalidArgumentError = require('oauth2-server/lib/errors/invalid-argument-error')
const InvalidGrantError = require('oauth2-server/lib/errors/invalid-grant-error')
const InvalidRequestError = require('oauth2-server/lib/errors/invalid-request-error')
const Promise = require('bluebird')
const promisify = require('promisify-any').use(Promise)
const is = require('oauth2-server/lib/validator/is')
const util = require('util')

/**
 * Constructor.
 */

function PasswordGrantType(options) {
  options.accessTokenLifetime = lifetime.accessToken
  options = options || {};

  if (!options.model) {
    throw new InvalidArgumentError('Missing parameter: `model`');
  }

  if (!options.model.getUser) {
    throw new InvalidArgumentError('Invalid argument: model does not implement `getUser()`');
  }

  if (!options.model.saveToken) {
    throw new InvalidArgumentError('Invalid argument: model does not implement `saveToken()`');
  }

  AbstractGrantType.call(this, options);
}

/**
 * Inherit prototype.
 */

util.inherits(PasswordGrantType, AbstractGrantType);

/**
 * Retrieve the user from the model using a username/password combination.
 *
 * @see https://tools.ietf.org/html/rfc6749#section-4.3.2
 */

PasswordGrantType.prototype.handle = function(request, client) {
  if (!request) {
    throw new InvalidArgumentError('Missing parameter: `request`');
  }

  if (!client) {
    throw new InvalidArgumentError('Missing parameter: `client`');
  }

  var scope = this.getScope(request);

  return Promise.bind(this)
    .then(function() {
      return this.getUser(request);
    })
    .then(function(user) {
      return this.saveToken(user, client, scope);
    });
};

/**
 * Get user using a username/password combination.
 */

PasswordGrantType.prototype.getUser = function(request) {
  if (!request.body.username) {
    throw new InvalidRequestError('Missing parameter: `username`');
  }

  if (!request.body.password) {
    throw new InvalidRequestError('Missing parameter: `password`');
  }

  if (!is.uchar(request.body.username)) {
    throw new InvalidRequestError('Invalid parameter: `username`');
  }

  if (!is.uchar(request.body.password)) {
    throw new InvalidRequestError('Invalid parameter: `password`');
  }

  return promisify(this.model.getUser, 2)(request.body.username, request.body.password)
    .then(function(user) {
      if (!user) {
        throw new InvalidGrantError('Invalid grant: user credentials are invalid');
      }

      return user;
    });
};

/**
 * Save token.
 */

PasswordGrantType.prototype.saveToken = function(user, client, scope) {
  const accessTokenExpiresAt = this.getAccessTokenExpiresAt()
  var fns = [
    this.validateScope(user, client, scope),
    generateAccessTokenBasedJWT(client, user, scope, accessTokenExpiresAt),
    accessTokenExpiresAt
  ];

  return Promise.all(fns)
    .bind(this)
    .spread(function(scope, accessToken, accessTokenExpiresAt) {
      var token = {
        accessToken: accessToken,
        accessTokenExpiresAt: accessTokenExpiresAt,
        scope: scope
      };

      return promisify(this.model.saveToken, 3)(token, client, user);
    });
};

/**
 * Export constructor.
 */

module.exports = PasswordGrantType;
