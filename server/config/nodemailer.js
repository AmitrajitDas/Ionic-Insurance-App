const nodemailer = require('nodemailer')
const dotenv = require("dotenv")
const path = require('path');
const { realpath } = require('fs');

dotenv.config()

let transporter = nodemailer.createTransport({
    service:"sendGrid",
    host: "smtp.sendgrid.net",//smtp.gmail.com
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'apikey', 
      pass: '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',//tszxvuqtfjzitgdc
    }
  });

  let renderTemlate = (data,relativepath)=>{
      let mailHTML
      ejs.renderFile(
          path.join(__dirname,'../mailers',relativepath),
          data,
          function(err,template){
              if(err)
              {
                  console.log('error in rendering template'+err)
                  return;
              }
              mailHTML = template
          }
      )

      return mailHTML
  }

  module.exports = {
      transporter : transporter,
      renderTemlate : renderTemlate
  }