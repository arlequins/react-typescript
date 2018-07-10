const parser = require('restify').plugins.bodyParser()
const oauthConfig = require('../oauth/settings')

/** Make through OAuth **/
module.exports = (server, apiUrl) => {
  server.post(`${apiUrl}/oauth/token`, parser, server.oauth.token(oauthConfig.token))

  server.post(`${apiUrl}/oauth/authorize`, parser, server.oauth.authorize(oauthConfig.authorize))

  server.get(`${apiUrl}/oauth/authenticate`, server.oauth.authenticate(), (req,res) => {
    if (res.statusCode !== 401)  {
      res.json({
        me: req.user,
        messsageForAdmin: `Authorization success, Without Scopes, Try accessing ${apiUrl}/oauth/admin with 'admin' scope`,
        messsageForUser: `Authorization success, Without Scopes, Try accessing ${apiUrl}/oauth/user with 'user' scope`,
        more: `pass '${res.oauth.token.scope}' scope while Authorize`
      })
    }
  })

  server.get(`${apiUrl}/oauth/admin`, server.oauth.authenticate({scope:'admin'}), (req, res) => {
    if (res.statusCode !== 401)  {
      res.json({
        name: res.oauth.token.User.username,
        scope: res.oauth.token.User.scope
      })
    }
  })

  server.get(`${apiUrl}/oauth/user`, server.oauth.authenticate({scope:'user'}), (req, res) => {
    if (res.statusCode !== 401)  {
      res.json({
        name: res.oauth.token.User.username,
        scope: res.oauth.token.User.scope
      })
    }
  })
}
