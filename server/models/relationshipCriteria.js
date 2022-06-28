
const { Sequelize, DataTypes } = require('sequelize');
const mainDB = require('../config/mainDB');
const Policy = require('./policy');

const Relationship = mainDB.define('Relationship', {

    policyID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references:Policy,
        referencesKey:'policyID'
      },

    brother: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },

  sister: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
 
  father: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },

  mother: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },

  son: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },

  daughter: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },

  other: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  }

},{
    timestamps: false
});


module.exports = Relationship