const mongoose=require('mongoose')
const passport = require('passport')
const dotenv = require("dotenv")
const jwt  = require('jsonwebtoken');
const validator = require('validator')
const db = require('../config/db')


dotenv.config()

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
    },
    isVerified:{
        type:Boolean,
        default:'false'
    },
    token:{
        type:String
    }
},{
    timestamps:true
})


userSchema.methods.generateJWT = ()=>{
    const token = jwt.sign({
        _id :this._id,
        email:this.email
    },process.env.jwt_secret,{expiresIn: '1d'})

    return token
}

const User = mongoose.model('User', userSchema)

module.exports = User