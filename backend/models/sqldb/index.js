const config = require('./../../config').db
const Sequelize = require('sequelize')
// const config = {
//   sqldb: {
//     database: process.env.SQL_DATABASE || 'oauth',
//     username: process.env.SQL_USERNAME || 'root',
//     password: process.env.SQL_PASSWORD || '',
//     options: {
//       host: process.env.SQL_HOST || 'localhost',
//       dialect: process.env.SQL_TYPE || 'mysql', // 'mysql'|'sqlite'|'postgres'|'mssql'
//       port: process.env.SQL_PORT || 3306,
//       operatorsAliases: false,
//       pool: {
//         max: process.env.SQL_POOL_MAX || 10,
//         min: process.env.SQL_POOL_MIN || 0,
//         acquire: process.env.SQL_POOL_ACQUIRE || 30000,
//         idle: process.env.SQL_POOL_IDLE || 10000
//       }
//     }
//   }
// }

var db = {
  sequelize: new Sequelize(
    config.sqldb.database,
    config.sqldb.username,
    config.sqldb.password,
    config.sqldb.options
  )
};

db.Todo = db.sequelize.import('./Todo')

module.exports = db

