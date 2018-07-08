const oauthWork = require('../config').model

/** Control Private through OAuth **/
module.exports = function(server, apiUrl) {
  server.post('/getUser', (req, res, next) => {
    let data = req.body
    oauthWork.getUser(data.id, data.pwd).then(function (user) {
      console.log("hello", user)
      res.json(user)
    })
  })

  server.post('/userInfo', (req, res, next) => {
    let data = req.body
    let response = oauthWork.getClient(data.id, data.pwd);
    res.send('hello?')
  })
  server.post('/generate', (req, res, next) => {
    let data = req.body
    let response = oauthWork.getClient(data.id, data.pwd);
    res.send('hello?')
  })
}
