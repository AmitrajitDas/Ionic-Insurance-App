const User = require('../models/user')
const Otp = require('../models/userOtp')
const dotenv = require("dotenv")
const jwt  = require('jsonwebtoken');
const signUpMailer = require('../mailers/signup_mailer')
const bcrypt = require('bcrypt')
const otpGen = require('otp-generator')

dotenv.config()

module.exports.login = (req,res)=>{
    res.send('login Page')
}

module.exports.postlogin = async(req,res)=>{
    const user = await User.findOne({
        email:req.user.email
    })
    try {
        return res.status(200).json({
            data: {
                done:"yes",
                user 
            },
            message: "logged in Successfully!"
        });

        
    } catch (error) {
        
        console.log(error.message);

        return res.status(500).json({
            message: "server error!"
        });
    }
}

module.exports.postSignup = async (req,res)=>{

    const user = await User.findOne({
        email:req.body.email
    })

    console.log(req.body)
        try {

            if(user)
            {
                return res.send('user already exists!')
            }

            const otp = otpGen.generate(4,{
                digits:true,
                alphabets:false,
                upperCase:false,
                specialChars:false
            })

                console.log(otp)
    
    
                const obj = {
                    otp:otp,
                    email:req.body.email
                }

                const newOtp = new Otp({
                    email:obj.email,
                    otp:obj.otp
                })
                
                const salt = await bcrypt.genSalt(10)
                newOtp.otp = await bcrypt.hash(newOtp.otp,salt)

                await newOtp.save();


                signUpMailer.signup(obj)

                return res.status(200).json({
                    data: {
                        done:"yes" 
                    },
                    message: "Go verify Your Email Dude!"
                });
           
        } catch (error) {
            console.log(error.message)

            return res.status(500).json({
                message: "Server error!"
            });
        }
    }

    module.exports.verifySignup= async (req,res)=>{
        
        try {
            const otp = req.body.otp
            const email=req.body.email
            const otpHolder = await Otp.find({email})

            if(otpHolder.length===0) return res.send('Expired Otp')

            const latestOtp = otpHolder[otpHolder.length-1]

            const validUser = await bcrypt.compare(otp,latestOtp.otp)

            console.log(validUser)

            if(latestOtp.email===req.body.email && validUser){
                const user = new User(req.body);
                const token = user.generateJWT()
                const salt = await bcrypt.genSalt(10)
                user.password = await bcrypt.hash(user.password,salt)
                user.isVerified = true
                user.token=token

                
                await user.save()

                console.log(token)

                const otpDelete = await Otp.deleteMany({
                    email:latestOtp.email
                })

                return res.status(200).json({
                    data: {
                        token:token 
                    },
                    msg:"User verification successful!"
                })
            }
        } catch (error) {

            console.log(error.message)
            return res.status(500).json({
                msg:"User verification unsuccessful!"
            })  
        }
    }

    module.exports.logout = function (req,res){
        req.session.destroy((err) => {
            if (err) {
              return console.log(err);
            }})
            res.send("logged out");
    }

    module.exports.hii  = (req,res)=>{
        console.log('hii')
    }