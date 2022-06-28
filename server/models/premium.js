
const { Sequelize, DataTypes } = require('sequelize');
const mainDB = require('../config/mainDB');
const Policy = require('./policy');

const Premium = mainDB.define('Premium', {

    policyID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references:Policy,
        referencesKey:'policyID'
      },

    gst: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  otherTax: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  govDiscount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  companyDiscount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  toPay: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

},{
    timestamps: false
});


module.exports = Premium