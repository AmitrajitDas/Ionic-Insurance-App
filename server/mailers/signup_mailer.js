const nodemailer = require('../config/nodemailer')
const sgMail = require('@sendgrid/mail')

exports.signup = (obj)/*email,token*/=>{
   console.log('Inside Signup mailer')
    const tokenVal = obj.token
    console.log('******* token value from VerifyUser_mailer',tokenVal)

    nodemailer.transporter.sendMail({
        from:'team.wetrishul@gmail.com',
        to: obj.email,
        subject:'Verify Account',
        html:'<p>Click <a href="http://localhost:5000/verify/user/'+ tokenVal + '"a>Please verify your account!!</a></p>'              
    },(err,info)=>{
        if(err){
            console.log('Error in sending Mail', err)
            return
        }
        console.log('Messge successfully delivered!', info)
        return 
    })
}


