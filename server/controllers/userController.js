const User = require('../models/user')
const dotenv = require("dotenv")
const jwt  = require('jsonwebtoken');
const signUpMailer = require('../mailers/signup_mailer')

dotenv.config()

module.exports.login = (req,res)=>{
    res.send('login Page')
}

module.exports.postlogin = async(req,res)=>{
    const user = await User.findOne({
        email:req.user.email
    })
    console.log("Main yahan hoon bhai" + user.username);
    try {
        return res.status(200).json({
            data: {
                done:"yes",
                user 
            },
            message: "logged in Successfully!"
        });

        
    } catch (error) {
        
        console.log("post login ka naya natak wala error");
    }
}

module.exports.postSignup = async (req,res)=>{

    console.log(req.body)
    
        const newObjUser = req.body

        try {
                const token =  jwt.sign(newObjUser,process.env.jwt_secret,{expiresIn:60*60*24})
                console.log(token)
    
    
                const obj = {
                    token:token,
                    email:req.body.email
                }
                signUpMailer.signup(obj)
    
                res.send({
                    title:'signup',
                    msg:'Go verify Your Email Dude!'
                })
           
        } catch (error) {
            console.log(error)
            res.redirect('back')
        }
    }


    module.exports.verifySignup= async (req,res)=>{
        const token = req.params.token
        try {

            jwt.verify(token,process.env.jwt_secret, async (error,decodedData)=>{
                if(error)
                {
                    console.log('Incorrect token or it is expired')
                    return
                }
                const email = decodedData.email

                const user =await User.findOne({email})

                if(user)
                {  
                   return res.send('user already exist')
                }
                else
                {
                    const Newuser = await new User(decodedData)
                    await Newuser.save()


                    const nayaNatak = await User.findOne({email:decodedData.email})
                    nayaNatak.token = token
                    await nayaNatak.save()
                }
                console.log(decodedData)
                res.send({
                    msg:'Verified successfully !!',
                    flag:'success'
                })
            })
            
        } catch (error) {  
            res.redirect('/login') 
        }
    }