require('dotenv').config({ path: '../.env' });

const nodeMailer = require("nodemailer");
const crypto = require('crypto');

class Mail {  
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


    async sendConfirmationMail(destination="", link="") {
        if(!destination || !link) return false;

        try {
            const info = await this.transporter.sendMail({
                from: `no-reply@imgur.coderr.tech`, 
                to: destination, 
                subject: "Confirm mail for fake imgur here!", 
                html: `<b>Confirmation link : </b> <a href=${link}>Confirm mail!</a><br>`, 
            });
            return true;
        } catch {
            return false;
        }
    }
}

module.exports = Mail;
