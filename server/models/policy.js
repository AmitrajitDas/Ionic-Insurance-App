const mongoose=require('mongoose')
const db = require('../config/db')

const PolicySchema = new mongoose.Schema({

    policyName:{
        type:String ,
        required:true
    },
    location:{
        type: String,
      
        required:true
    },
    occupation:{
        type: String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    gender:{
        type:String,
        required:true
    }
},{
    timestamps:true
})


const Policy = mongoose.model('Policy', PolicySchema)

module.exports = Policy