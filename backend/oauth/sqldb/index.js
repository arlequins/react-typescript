// const config = require('./../../config')
const Sequelize = require('sequelize');
const config = {
  sqldb: {
    database: process.env.SQL_DATABASE || 'oauth',
    username: process.env.SQL_USERNAME || 'root',
    password: process.env.SQL_PASSWORD || '',
    options: {
      host: process.env.SQL_HOST || 'localhost',
      dialect: process.env.SQL_TYPE || 'mysql', // PostgreSQL, MySQL, MariaDB, SQLite and MSSQL See more: http://docs.sequelizejs.com/en/latest/
      operatorsAliases: false,
      pool: {
        max: process.env.SQL_TYPE || 10,
        min: process.env.SQL_TYPE || 0,
        acquire: process.env.SQL_TYPE || 30000,
        idle: process.env.SQL_TYPE || 10000
      }
    }
  }
}

var db = {
  sequelize: new Sequelize(
    config.sqldb.database,
    config.sqldb.username,
    config.sqldb.password,
    config.sqldb.options
  )
};

db.OAuthAccessToken = db.sequelize.import('./OAuthAccessToken')
db.OAuthAuthorizationCode = db.sequelize.import('./OAuthAuthorizationCode')
db.OAuthClient = db.sequelize.import('./OAuthClient')
db.OAuthRefreshToken = db.sequelize.import('./OAuthRefreshToken')
db.OAuthScope = db.sequelize.import('./OAuthScope')
db.User = db.sequelize.import('./User')

Object.keys(db).forEach((modelName) => {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db)
  }
})

module.exports = db
