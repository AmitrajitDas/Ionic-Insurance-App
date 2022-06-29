const Otp = require('../models/otp')
const dotenv = require("dotenv")
const jwt  = require('jsonwebtoken');
const signUpMailer = require('../mailers/signup_mailer')
const bcrypt = require('bcrypt')
const otpGen = require('otp-generator')
const {sequelize,Op} = require('sequelize')
const User = require('../models/theuser');

dotenv.config()

module.exports.login = (req,res)=>{
    res.send('login Page')
}

module.exports.postlogin = async(req,res)=>{
   
    try {

        console.log(req.body)

        const user = await User.findOne({
            where: {
              email: req.body.email
            }
          });

          console.log(req.session)

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
    console.log(req.body)
        try {

            const user = await User.findOne({
                where: {
                  email: req.body.email
                }
              });


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


                const newOtp = await Otp.create({
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
        
            const otpHolder = await Otp.findOne({
                where: {
                  email: email
                }
              });
            console.log(otpHolder.email)

            const validUser = await bcrypt.compare(otp,otpHolder.otp)

            console.log(validUser)

            if(otpHolder.email===req.body.email && validUser){
                const user = await User.create(req.body);
                const token = jwt.sign({
                    _id :this._id,
                    email:this.email
                },process.env.jwt_secret,{expiresIn: '1d'})

                const salt = await bcrypt.genSalt(10)
                user.password = await bcrypt.hash(user.password,salt)
                user.isVerified = true
                user.token=token

                await user.save()

                console.log(token)

                const otpDelete = await Otp.destroy({
                    where: {
                        email: otpHolder.email
                      }
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

    module.exports.logout = async function (req,res){

        try {
           console.log(req.session)
         await req.session.destroy((err) => {
            if (err) {
              return console.log(err);
            }})
            res.send("logged out");
        } catch (error) {
            console.log(error.msg)
        }
    }

    module.exports.hii  = (req,res)=>{
            console.log('hii')
    }