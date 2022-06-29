
const { Sequelize, DataTypes } = require('sequelize');
const mainDB = require('../config/mainDB');


const Otp = mainDB.define('Otp', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  otp: {
    type: DataTypes.STRING,
    allowNull: false
  }
},{
    timestamps: true
});


module.exports = Otp