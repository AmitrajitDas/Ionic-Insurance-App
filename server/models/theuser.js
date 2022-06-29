
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
  },
  password:{
    type: DataTypes.STRING,
    allowNull: true
  },
  isVerified:{
    type:Boolean,
    default:'false'
},
token:{
    type:String
}
},{
    timestamps: false
});


module.exports = User