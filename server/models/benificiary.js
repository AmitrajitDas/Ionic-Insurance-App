
const { Sequelize, DataTypes } = require('sequelize');
const mainDB = require('../config/mainDB');


const Benificiary = mainDB.define('Benificiary', {

    beneficiaryID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },

    userID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references:User,
    referencesKey:'userID'
  },

  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  occupation: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  benificiaryRelation: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  gender: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  fullname: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }

},{
    timestamps: true
});


module.exports = Benificiary