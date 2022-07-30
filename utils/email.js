const nodemailer = require("nodemailer");
const pug = require("pug");
const htmlToText = require("html-to-text");
let bid1, sender1;
module.exports = class Email {
  constructor(user, url, nego) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.from = `<${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    // if (process.env.NODE_ENV === "production") {
    //   // Sendgrid
    //   return nodemailer.createTransport({
    //     host: process.env.EMAIL_HOST,
    //     port: process.env.EMAIL_PORT,
    //     auth: {
    //       user: process.env.EMAIL_USERNAME,
    //       pass: process.env.EMAIL_PASSWORD,
    //     },
    //   });

    //   // let transport = nodemailer.createTransport({
    //   //   host: 'smtps://user%40gmail.com:pass@smtp.gmail.com',
    //   //   port: 465,
    //   //   secure: true,
    //   //   auth: {
    //   //     user: process.env.PROD_EMAIL_USERNAME,
    //   //     pass: process.env.PROD_EMAIL_PASSWORD,
    //   //   },
    //   // });
    // }
    return nodemailer.createTransport({
      service: "SendGrid",
      auth: {
        user: process.env.SENDGRID_USERNAME,
        pass: process.env.SENDGRID_PASSWORD,
      },
    });
  }

  // Send the actual email
  async send(template, subject) {
    // 1) Render HTML based on a pug template

    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });
    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html),
    };
    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions, (err, data) => {
      if (err) console.log(err);
    });
  }

  async sendWelcome() {
    await this.send("welcome", "Welcome to the E-Farm Family!");
  }
  async sendNewNego() {
    await this.send(
      "newnego",
      "New Negotiation has been Placed For Your Product"
    );
  }
  async sendOldNego(bid, sender) {
    bid1 = bid;
    sender1 = sender;
    await this.send(
      "oldnego",
      `You have a New Bid :₹${bid} from the ${sender}`
    );
  }

  async sendPasswordReset() {
    await this.send(
      "passwordReset",
      "Your password reset token (valid for only 10 minutes)"
    );
  }
};
