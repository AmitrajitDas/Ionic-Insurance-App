const { Sequelize, DataTypes } = require('sequelize');
const mainDB = require('../config/mainDB');
const Policy = require('./policy');

const UserPolicy = mainDB.define('UserPolicy', {

    policyID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references:Policy,
        referencesKey:'policyID'
      },

    policyHolder_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  buyerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },

  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  
  amount : {
    type: DataTypes.INTEGER,
    allowNull: false,
  }

},{
    timestamps: true
});


module.exports = UserPolicy