const nodemailer = require('../config/nodemailer')
const sgMail = require('@sendgrid/mail')

exports.signup = (obj)/*email,token*/=>{
   console.log('Inside Signup mailer')
    const otpVal = obj.otp
    console.log('******* token value from VerifyUser_mailer',otpVal)

    nodemailer.transporter.sendMail({
        from:'team.wetrishul@gmail.com',
        to: obj.email,
        subject:'Verify Account',
        html:'<p>'+otpVal+'</p>'              
    },(err,info)=>{
        if(err){
            console.log('Error in sending Mail', err)
            return
        }
        console.log('Messge successfully delivered!', info)
        return 
    })
}


