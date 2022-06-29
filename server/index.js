const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
const colors = require("colors")
const morgan = require("morgan")
const mainDB = require('./config/mainDB')
const bodyParser = require("body-parser")
const cookieParser = require('cookie-parser')
const session = require('express-session')
const userRouter = require('./routes/user')
const passport = require('passport')
const passport_local = require('./config/passport-local-auth')
const MongoStore = require('connect-mongo')
const passportJWT = require('./config/passport-jwt-strategy')
const mysql = require('mysql');
const { notFound, errorHandler } = require("./middlewares/errorMiddleware")
var MySQLStore = require('express-mysql-session')(session);

dotenv.config()

const app = express()

const port = process.env.PORT || 5000

app.use(cors({
  origin:'*'
}))

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"))
}

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())

app.use(session({
  name: 'InsuranceApp',
  secret: 'blahblahblah...',
  saveUninitialized:false,
  resave:false,
  cookie:{
      maxAge: (1000*60*100)
  },
  store: new MySQLStore({
    host:'localhost',
    port:3306,
    user:'root',
    password:'Harikesh3009@699',
    database:process.env.CONNECTION_URL
})
}))


//app.use(notFound)
//app.use(errorHandler)

app.use(passport.initialize())
app.use(passport.session())
app.use(passport.setAuthenticatedUser)

app.use(userRouter)



app.listen(port,()=>{
  console.log('Server is up on port '+ port)
})

mainDB.authenticate()
   .then(() => console.log('Connected to Main database :: MySQL'))
   .catch(err => console.log('Error: ' + err))
