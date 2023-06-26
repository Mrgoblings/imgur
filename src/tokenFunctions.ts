const crypto = require('crypto');
const nodemailer = require("nodemailer");

export class Token {

  readonly transporter = nodemailer.createTransport({
    host: process.env["EMAIL_HOST"],
    port: process.env["EMAIL_PORT"],
    secure: true,
    auth: {
      user: process.env["EMAIL_FROM_USERNAME"],
      pass: process.env["EMAIL_FROM_PASSWORD"]
    }
  });


  generateSecretKey() {
    return crypto.randomBytes(32).toString('hex');
  };

  async sendMail(link=""){

    const info = await this.transporter.sendMail({
      from: '"Fred Foo 👻" <foo@example.com>', // sender address
      to: "bar@example.com, baz@example.com", // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?" + link, // plain text body
      html: "<b>Hello world?</b><br>", // html body
    });
  }

}