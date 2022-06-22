const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
const colors = require("colors")
const morgan = require("morgan")
const connectDB = require("./config/db")
const { notFound, errorHandler } = require("./middlewares/errorMiddleware")

dotenv.config()

connectDB()

const app = express()
app.use(cors())

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"))
}

app.use(express.json())

app.get("/", (req, res) => {
  res.send("API is running....")
})

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
)
