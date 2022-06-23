const mongoose=require('mongoose')
const validator = require('validator')
const db = require('../config/db')

const userSchema = new mongoose.Schema({

    firstName:{
        type:String,
        required:true
    },
    middleName:{
        type:String,
    },
    lastName:{
        type:String,
        required:true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    age:{
        type:Number,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    occupation:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
},{
    timestamps:true
})


const User = mongoose.model('User', userSchema)

module.exports = User