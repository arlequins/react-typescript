'use strict'
const mongodb = require('../oauth/mongodb')
var sqldb = require('../oauth/sqldb');
var config = require('../config')
const utils = require('../utils')

const OAuthAccessToken = config.database === 'mongodb' ? mongodb.OAuthAccessToken : sqldb.OAuthAccessToken
const OAuthAuthorizationCode = config.database === 'mongodb' ? mongodb.OAuthAuthorizationCode : sqldb.OAuthAuthorizationCode
const OAuthClient = config.database === 'mongodb' ? mongodb.OAuthClient : sqldb.OAuthClient
const OAuthRefreshToken = config.database === 'mongodb' ? mongodb.OAuthRefreshToken : sqldb.OAuthRefreshToken
const OAuthScope = config.database === 'mongodb' ? mongodb.OAuthScope : sqldb.OAuthScope
const User = config.database === 'mongodb' ? mongodb.User : sqldb.User

const defaultInfo = {
  user: {
    username: config.seedInfo.user.username,
    password: [utils.oauthTools.saltHashPassword(config.seedInfo.user.username[0]), utils.oauthTools.saltHashPassword(config.seedInfo.user.username[1])],
    scope: config.seedInfo.user.scope
  },
  setClient: (user) => {
    return {
      username: utils.oauthTools.hmacEncryption(user.username),
      password: utils.oauthTools.saltHashPassword(user.password)
    }
  },
  redirect_uri: config.seedInfo.redirectUri,
  scope: config.seedInfo.scope
}

const seeds = {
  mongodb: async () => {
    const isData = await User.find({
      username: defaultInfo.user.username
    })
    const currnetStatus = isData.length === 0 ? true : false

    if (currnetStatus) {
      OAuthAccessToken.find({}).remove()
      OAuthAuthorizationCode.find({}).remove()
      OAuthRefreshToken.find({}).remove()

      await OAuthScope.find({}).remove()
      await OAuthScope.create({
        scope: defaultInfo.scope[0],
        is_default: false
      }, {
        scope: defaultInfo.scope[1],
        is_default: true
      })

      console.log('finished populating OAuthScope')

      await User.find({}).remove()

      const admin = await User.create({
        username: defaultInfo.user.username[0],
        password: defaultInfo.user.password[0],
        scope: defaultInfo.user.scope[0]
      })

      const user = await User.create({
        username: defaultInfo.user.username[1],
        password: defaultInfo.user.password[1],
        scope: defaultInfo.user.scope[1]
      })

      console.log('finished populating admin', admin)
      console.log('finished populating user', user)

      try {
        await OAuthClient.find({}).remove()

        const adminClient = await OAuthClient.create({
          client_id: defaultInfo.setClient(admin).username,
          client_secret: defaultInfo.setClient(admin).password,
          scope: defaultInfo.scope[0],
          redirect_uri: defaultInfo.redirect_uri[0],
          User: admin._id
        })

        const userClient = await OAuthClient.create({
          client_id: defaultInfo.setClient(user).username,
          client_secret: defaultInfo.setClient(user).password,
          grant_types: 'jwt',
          scope: defaultInfo.scope[1],
          redirect_uri: defaultInfo.redirect_uri[1],
          User: user._id
        })

        console.log('finished populating OAuthClient', adminClient)
        console.log('finished populating OAuthClient', userClient)
      } catch (err) {
        console.log(err)
      }
    }
  },
  sqldb: async () => {
    let isData = []
    try {
      isData = await User.findAll({
        where: {
          username: defaultInfo.user.username[0]
        },
        attributes: ['id', 'username', 'password', 'scope']
      })
    } catch (e) {
      console.log('there is no database')
    }

    const currnetStatus = isData.length === 0 ? true : false

    if (currnetStatus) {
      await OAuthScope.sync({
        force: config.seedDBForce
      })
      await OAuthScope.destroy({
        where: {}
      })
      await OAuthScope.bulkCreate([{
        scope: defaultInfo.scope[0],
        is_default: false
      }, {
        scope: defaultInfo.scope[1],
        is_default: true
      }])
      console.log('finished populating scope')

      await User.sync({
        force: config.seedDBForce
      })
      await User.destroy({
        where: {}
      });

      const user = [{
        username: defaultInfo.user.username[0],
        password: defaultInfo.user.password[0],
        scope: defaultInfo.user.scope[0]
      },
      {
        username: defaultInfo.user.username[1],
        password: defaultInfo.user.password[1],
        scope: defaultInfo.user.scope[1]
      }]
      await User.bulkCreate(user)

      console.log('finished populating users', user)

      await OAuthClient.sync({
        force: config.seedDBForce
      })
      await OAuthClient.destroy({
        where: {}
      })

      const client = [{
          client_id: defaultInfo.setClient(user[0]).username,
          client_secret: defaultInfo.setClient(user[0]).password,
          scope: defaultInfo.scope[0],
          redirect_uri: defaultInfo.redirect_uri[0],
          user_id: 1
        },
        {
          client_id: defaultInfo.setClient(user[1]).username,
          client_secret: defaultInfo.setClient(user[1]).password,
          grant_types: 'jwt',
          scope: defaultInfo.scope[1],
          redirect_uri: defaultInfo.redirect_uri[1],
          user_id: 2
        }
      ]

      await OAuthClient.bulkCreate(client)

      console.log('finished populating OAuthClient')

      await OAuthAccessToken.sync({
        force: config.seedDBForce
      })
      await OAuthRefreshToken.sync({
        force: config.seedDBForce
      })
      await OAuthAuthorizationCode.sync({
        force: config.seedDBForce
      })
    }
  }
}

module.exports = seeds