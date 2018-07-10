'use strict';

module.exports = function(sequelize, DataTypes) {
  var Todo = sequelize.define('Todo',  {
    id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    task: DataTypes.STRING(32),
    status: DataTypes.STRING(32)
  }, {
    tableName: 'todo',
    timestamps: true,
    underscored: true
    }
  )

  return Todo
}
