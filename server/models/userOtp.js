const mongoose=require('mongoose')
const passport = require('passport')
const validator = require('validator')

const otpSchema = new mongoose.Schema({
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
    otp:{
        type:String
    },
    createdAt:{
        type:Date,
        default:Date.now,
        index:{expires:300}
    }
},{
    timestamps:true
})




const Otp = mongoose.model('Otp', otpSchema)

module.exports = Otp