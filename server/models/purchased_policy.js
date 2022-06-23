const mongoose=require('mongoose')
const db = require('../config/db')

const purchasedPolicySchema = new mongoose.Schema({

    policy_id:{
        type:mongoose.Schema.Types.ObjectId ,
        ref:'Policy',
        required:true
    },
    user_id:{
        type:mongoose.Schema.Types.ObjectId ,
        ref:'User',
        required:true
    },
    startDate:{
        type:Date,
        required:true
    },
    endDate:{
        type:Date,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    premium:{
        type:Number,
        required:true
    }
    
},{
    timestamps:true
})


const purchasedPolicy = mongoose.model('purchasedPolicy', purchasedPolicySchema)

module.exports = purchasedPolicy