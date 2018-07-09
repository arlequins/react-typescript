var _ = require('lodash')
var sqldb = require('./sqldb')
var User = sqldb.User
var OAuthClient = sqldb.OAuthClient
var OAuthAccessToken = sqldb.OAuthAccessToken
var OAuthAuthorizationCode = sqldb.OAuthAuthorizationCode
var OAuthRefreshToken = sqldb.OAuthRefreshToken
const tokenUtil = require('oauth2-server/lib/utils/token-util')

const isExpiredDate = (token) => {
  const today = Date.now()
  const expiredDate = Date.parse(token.expires)
  if (today >= expiredDate) {
    return true
  } else {
    return false
  }
}

const getAccessToken = (bearerToken) => {
  return OAuthAccessToken
    .findOne({
      where: {access_token: bearerToken},
      attributes: [['access_token', 'accessToken'], ['expires', 'accessTokenExpiresAt'],'scope'],
      include: [
        {
          model: User,
          attributes: ['id', 'username'],
        }, OAuthClient
      ],
    })
    .then(function (accessToken) {
      if (!accessToken) return false;
      var token = accessToken.toJSON()

      if (isExpiredDate(token)) {
        return false
      }

      token.user = token.User
      token.client = token.OAuthClient
      token.scope = token.scope
      return token
    })
    .catch(function (err) {
      console.log(err)
      console.log("getAccessToken - Err: ")
    });
}

const getClient = (clientId, clientSecret) => {
  const options = {
    where: {client_id: clientId},
    attributes: ['id', 'client_id', 'redirect_uri', 'scope'],
  };
  if (clientSecret) options.where.client_secret = clientSecret;

  return sqldb.OAuthClient
    .findOne(options)
    .then(function (client) {
      if (!client) return new Error("client not found")
      var clientWithGrants = client.toJSON()
      clientWithGrants.grants = ['authorization_code', 'password', 'refresh_token', 'client_credentials', 'jwt']
      // Todo: need to create another table for redirect URIs
      clientWithGrants.redirectUris = [clientWithGrants.redirect_uri]
      delete clientWithGrants.redirect_uri
      //clientWithGrants.refreshTokenLifetime = integer optional
      //clientWithGrants.accessTokenLifetime  = integer optional
      return clientWithGrants
    }).catch(function (err) {
      console.log("getClient - Err: ", err)
    })
}


const getUser = (username, password) => {
  return User
    .findOne({
      where: {username: username},
      attributes: ['id', 'username', 'password', 'scope']
    })
    .then(function (user) {
      return user.password == password ? user.toJSON() : false
    })
    .catch(function (err) {
      console.log("getUser - Err: ", err)
    });
}

const revokeAuthorizationCode = async (code) => {
  const expiredCode = await OAuthAuthorizationCode.findOne({
    where: {
      authorization_code: code.code
    }
  })

  await expiredCode.updateAttributes({
    expires: new Date('2015-05-28T06:59:53.000Z')
  })
  return expiredCode
}

const revokeToken = async (token) =>  {
  const expiredToken = await OAuthRefreshToken.findOne({
    where: {
      refresh_token: token.refreshToken
    }
  })

  await expiredToken.updateAttributes({
    expires: new Date('2015-05-28T06:59:53.000Z')
  })
  return expiredCode
}


const saveToken = (token, client, user) => {
  return Promise.all([
      OAuthAccessToken.create({
        access_token: token.accessToken,
        expires: token.accessTokenExpiresAt,
        client_id: client.id,
        user_id: user.id,
        scope: token.scope
      }),
      token.refreshToken ? OAuthRefreshToken.create({ // no refresh token for client_credentials
        refresh_token: token.refreshToken,
        expires: token.refreshTokenExpiresAt,
        client_id: client.id,
        user_id: user.id,
        scope: token.scope
      }) : [],

    ])
    .then(function () {
      return _.assign(  // expected to return client and user, but not returning
        {
          client: client,
          user: user,
          access_token: token.accessToken, // proxy
          refresh_token: token.refreshToken, // proxy
        },
        token
      )
    })
    .catch(function (err) {
      console.log("saveToken - Err: ", err)
    });
}

const getAuthorizationCode = (code) => {
  return OAuthAuthorizationCode
    .findOne({
      attributes: ['client_id', 'expires', 'user_id', 'scope'],
      where: {authorization_code: code},
      include: [User, OAuthClient]
    })
    .then(function (authCodeModel) {
      if (!authCodeModel) return false;
      var client = authCodeModel.OAuthClient.toJSON()
      var user = authCodeModel.User.toJSON()
      return reCode = {
        code: code,
        client: client,
        expiresAt: authCodeModel.expires,
        redirectUri: client.redirect_uri,
        user: user,
        scope: authCodeModel.scope,
      };
    }).catch(function (err) {
      console.log("getAuthorizationCode - Err: ", err)
    });
}

const saveAuthorizationCode = (code, client, user) => {
  return OAuthAuthorizationCode
    .create({
      expires: code.expiresAt,
      client_id: client.id,
      authorization_code: code.authorizationCode,
      redirect_uri: code.redirectUri,
      user_id: user.id,
      scope: code.scope
    })
    .then(function () {
      code.code = code.authorizationCode
      return code
    }).catch(function (err) {
      console.log("saveAuthorizationCode - Err: ", err)
    });
}

const getUserFromClient = (client) => {
  var options = {
    where: {client_id: client.client_id},
    include: [User],
    attributes: ['id', 'client_id', 'redirect_uri'],
  };
  if (client.client_secret) options.where.client_secret = client.client_secret;

  return OAuthClient
    .findOne(options)
    .then(function (client) {
      if (!client) return false;
      if (!client.User) return false;
      return client.User.toJSON();
    }).catch(function (err) {
      console.log("getUserFromClient - Err: ", err)
    });
}

const getRefreshToken = (refreshToken) => {
  if (!refreshToken || refreshToken === 'undefined') return false

  return OAuthRefreshToken
    .findOne({
      attributes: ['client_id', 'user_id', 'expires'],
      where: {refresh_token: refreshToken},
      include: [OAuthClient, User]

    })
    .then(function (savedRT) {
      var tokenTemp = {
        user: savedRT ? savedRT.User.toJSON() : {},
        client: savedRT ? savedRT.OAuthClient.toJSON() : {},
        refreshTokenExpiresAt: savedRT ? new Date(savedRT.expires) : null,
        refreshToken: refreshToken,
        refresh_token: refreshToken,
        scope: savedRT.scope
      };
      return tokenTemp;

    }).catch(function (err) {
      console.log("getRefreshToken - Err: ", err)
    });
}

const validateScope = (user, client, scope) => {
  console.log("validateScope", user, client, scope)
  return (user.scope === client.scope) ? scope : false
}

const verifyScope = (token, scope) => {
  return token.scope === scope
}

module.exports = {
  //generateOAuthAccessToken, optional - used for jwt
  //generateAuthorizationCode, optional
  //generateOAuthRefreshToken, - optional
  getAccessToken: getAccessToken,
  getAuthorizationCode: getAuthorizationCode, //getOAuthAuthorizationCode renamed to,
  getClient: getClient,
  getRefreshToken: getRefreshToken,
  getUser: getUser,
  getUserFromClient: getUserFromClient,
  //grantTypeAllowed, Removed in oauth2-server 3.0
  revokeAuthorizationCode: revokeAuthorizationCode,
  revokeToken: revokeToken,
  saveToken: saveToken,//saveOAuthAccessToken, renamed to
  saveAuthorizationCode: saveAuthorizationCode, //renamed saveOAuthAuthorizationCode,
  validateScope: validateScope,
  verifyScope: verifyScope,
}
