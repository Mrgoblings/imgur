require('dotenv').config({ path: '../.env' });

const nodeMailer = require("nodemailer");
const crypto = require('crypto');

class Token {  
  constructor() {
    this.transporter = nodeMailer.createTransport({
      host: process.env.EMAIL_SMTP,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_FROM_USERNAME,
        pass: process.env.EMAIL_FROM_PASSWORD
      }
    });
  }

  generateSecretKey() {
    return crypto.randomBytes(32).toString('hex');
  }

  async sendConfirmationMail(subject="", link="") {

    const info = await this.transporter.sendMail({
      from: `no-reply@imgur.coderr.tech`, 
      to: "mrgoblings@gmail.com", 
      subject: subject, 
      html: `<b>Confirmation link : </b> <a href = ${link}>Confirm mail!</a><br>`, 
    });
    console.log(info.messageId);
  }
}

module.exports = Token;
