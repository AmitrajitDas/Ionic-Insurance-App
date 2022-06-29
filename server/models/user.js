const mongoose=require('mongoose')
const passport = require('passport')
const dotenv = require("dotenv")
const jwt  = require('jsonwebtoken');
const validator = require('validator')
const db = require('../config/db')


dotenv.config()

const authSchema = new mongoose.Schema({
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
    timestamps:false
})


authSchema.methods.generateJWT = ()=>{
    const token = jwt.sign({
        _id :this._id,
        email:this.email
    },process.env.jwt_secret,{expiresIn: '1d'})

    return token
}

const Auth = mongoose.model('Auth', authSchema)

module.exports = Auth