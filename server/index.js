const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
const colors = require("colors")
const morgan = require("morgan")
const db = require("./config/db")
const bodyParser = require("body-parser")
const cookieParser = require('cookie-parser')
const session = require('express-session')
const userRouter = require('./routes/user')
const passport = require('passport')
const passport_local = require('./config/passport-local-auth')
const MongoStore = require('connect-mongo')
const passportJWT = require('./config/passport-jwt-strategy')
const { notFound, errorHandler } = require("./middlewares/errorMiddleware")

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
  store: MongoStore.create({
      mongoUrl: `mongodb://127.0.0.1:27017/${process.env.CONNECTION_URL}`,
      autoRemove:'disabled',
  },
  function(err)
  {
      console.log(err||'connect-mongodb setup ok')
  })
}))


// app.use(notFound)
// app.use(errorHandler)

app.use(passport.initialize())
app.use(passport.session())
app.use(passport.setAuthenticatedUser)

app.use(userRouter)



app.listen(port,()=>{
  console.log('Server is up on port '+ port)
})

