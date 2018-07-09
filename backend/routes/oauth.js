const parser = require('restify').plugins.bodyParser()
const Request = require('oauth2-server').Request
const models = require('../config').model

const lifetime = {
  authorizeToken: 5 * 60,
  accessToken: 60 * 60,
  refreshToken: 660 * 60 * 24 * 14
}

const authenticateHandler = {
  handle: async function (req, res) {
    var request = new Request(req);

    const queries = request.body

    const clientId = queries.client_id
    const clientSecret = queries.client_secret
    const redirectUri = queries.redirect_uri
    const accessToken = queries.access_token
    const scope = queries.scope

    // get clientId
    const clientInfo = await models.getClient(clientId, clientSecret)

    // checking redirectUrl
    let count = 0
    for (const v of clientInfo.redirectUris) {
      if (v === redirectUri) {
        count ++
      }
    }

    if (count === 0) {
      return false
    }

    if (scope !== clientInfo.scope) {
      return false
    }

    // get accessToken
    const accessTokenInfo = await models.getAccessToken(accessToken)

    if (scope !== accessTokenInfo.scope) {
      return false
    }

    // get userInfo
    const userInfo = await models.getUserFromClient(clientInfo)

    if (scope !== userInfo.scope) {
      return false
    }
    return userInfo
  }
}

const oauthConfig = {
  token: {
    accessTokenLifetime: lifetime.accessToken,
    refreshTokenLifetime: lifetime.refreshToken,
    requireClientAuthentication: {
      client_credentials: false,
      authorization_code: true,
      password: false
    },
    allowExtendedTokenAttributes: true,
    extendedGrantTypes: {
      'jwt': require('../oauth/jwt')
    },
    alwaysIssueNewRefreshToken: false
  },
  authorize: {
    authorizationCodeLifetime: lifetime.authorizeToken,
    // scope: 'admin',
    // addAcceptedScopesHeader: true,
    // addAuthorizedScopesHeader: true
    authenticateHandler: authenticateHandler
  }
}

/** Make through OAuth **/
module.exports = (server, apiUrl) => {
  server.post(`${apiUrl}/oauth/token`, parser, server.oauth.token(oauthConfig.token))

  server.post(`${apiUrl}/oauth/authorize`, parser, server.oauth.authorize(oauthConfig.authorize))

  server.get(`${apiUrl}/oauth/authenticate`, server.oauth.authenticate(), function(req,res){
    if (res.statusCode !== 401)  {
      res.json({
        me: req.user,
        messsage: 'Authorization success, Without Scopes, Try accessing /profile with `profile` scope',
        description: 'Try postman https://www.getpostman.com/collections/37afd82600127fbeef28',
        more: 'pass `profile` scope while Authorize'
      })
    }
  })

  server.get(`${apiUrl}/oauth/profile`, server.oauth.authenticate({scope:'admin'}), (req, res) => {
    res.json({
      profile: res.oauth.token.User,
      checking: 'hello'
    })
  })
}
