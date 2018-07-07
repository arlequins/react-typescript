const parser = require('restify').plugins.bodyParser()
const oauthWork = require('../models')
const oauthConfig = {
  token: {
    accessTokenLifetime: 60 * 60 * 60 * 60 * 60,
    refreshTokenLifetime: 60 * 60 * 60 * 60 * 60,
    requireClientAuthentication: {
      client_credentials: false
    },
    allowExtendedTokenAttributes: true,
    scope: 'profile'
  },
  authorize: {

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

  server.get(`${apiUrl}/oauth/profile`, server.oauth.authenticate({scope:'profile'}), function(req,res){
    res.json({
      profile: req.user
    })
  })
}
