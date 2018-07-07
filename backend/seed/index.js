'use strict';
const mongodb = require('../oauth')

const Thing = mongodb.Thing;
const OAuthAccessToken = mongodb.OAuthAccessToken
const OAuthAuthorizationCode = mongodb.OAuthAuthorizationCode
const OAuthClient = mongodb.OAuthClient
const OAuthRefreshToken = mongodb.OAuthRefreshToken
const OAuthScope = mongodb.OAuthScope
const User = mongodb.User

const utils = require('../utils')

//OAuthAccessToken.sync({force:config.seedDBForce})
//OAuthRefreshToken.sync({force:config.seedDBForce})
//OAuthAuthorizationCode.sync({force:config.seedDBForce})

const initialPassword = utils.oauthTools.saltHashPassword('admin')


const seeds = async () => {
  const isData = await User.find({username: 'setine'})
  const currnetStatus = isData.length === 0 ? true : false

  if (currnetStatus) {
    OAuthScope.find({}).remove()
    .then(function() {
      OAuthScope.create({
          scope: 'website',
          is_default: false
        },{
          scope: 'default',
          is_default: true
        })
        .then(function() {
          console.log('finished populating OAuthScope');
        });
    });
  User.find({}).remove()
    .then(function() {
      User.create({
          username: 'setine',
          password: utils.oauthTools.saltHashPassword('admin')
        })
        .then(function(user) {
          console.log('finished populating users',user);
          return OAuthClient.find({}).remove()
            .then(function() {
              OAuthClient.create({
                  client_id: utils.oauthTools.hmacEncryption(user.username),
                  client_secret: utils.oauthTools.saltHashPassword(user.password),
                  redirect_uri:'http://localhost',
                  User:user._id
                })
                .then(function(client) {
                  console.log('finished populating OAuthClient',client);
                }).catch(console.log);
            });
        });
    });
  }
}

module.exports = seeds;
