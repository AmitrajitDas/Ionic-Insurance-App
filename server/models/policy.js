
const { Sequelize, DataTypes } = require('sequelize');
const mainDB = require('../config/mainDB');


const Policy = mainDB.define('Policy', {

    policyID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },

    policyName: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  occupation: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  minAge: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  maxAge: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false,
  }
 

},{
    timestamps: true
});


module.exports = Policy