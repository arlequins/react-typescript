const parser = require('restify').plugins.bodyParser()
const lifetime = 60 * 60 * 60 * 60 * 60

const oauthConfig = {
  token: {
    accessTokenLifetime: lifetime,
    refreshTokenLifetime: lifetime,
    requireClientAuthentication: {
      client_credentials: false,
      authorization_code: false
    },
    allowExtendedTokenAttributes: true,
    scope: 'profile'
  },
  authorize: {
    authorizationCodeLifetime: lifetime
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

  server.get(`${apiUrl}/oauth/profile`, server.oauth.authenticate({scope:'profile'}), (req, res) => {
    console.log('###3')
    console.log(res.oauth.token.User)
    res.json({
      profile: res.oauth.token.User,
      checking: 'hello'
    })
  })
}
