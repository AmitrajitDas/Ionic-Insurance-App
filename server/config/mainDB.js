const Sequelize = require('sequelize')
const dotenv = require("dotenv")

const sequelize = new Sequelize(`${process.env.CONNECTION_URL}`, `${process.env.MainDBadmin}`, `${process.env.MainDBpass}`, { 
  host: 'localhost',
  dialect: 'mysql',
  logging:false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})

module.exports = sequelize