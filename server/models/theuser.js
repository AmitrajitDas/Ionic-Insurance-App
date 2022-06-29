
const { Sequelize, DataTypes } = require('sequelize');
const mainDB = require('../config/mainDB');


const User = mainDB.define('User', {

    userID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },

    fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
  }
 

},{
    timestamps: true
});


module.exports = User