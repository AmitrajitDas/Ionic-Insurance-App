
const { Sequelize, DataTypes } = require('sequelize');
const mainDB = require('../config/mainDB');


const User = mainDB.define('User', {

    userID: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

    fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  }
},{
    timestamps: false
});


module.exports = User