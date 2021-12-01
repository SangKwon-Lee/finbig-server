const nodemailer = require("nodemailer");
const userEmail = process.env.NODEMAILER_USER;
const userPass = process.env.NODEMAILER_PASSWD;
// Create reusable transporter object using SMTP transport.
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    type: "OAuth2",
    user: userEmail,
    pass: userPass,
    clientId: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
  },
  host: "smtp.gamil.com",
  port: 587,
  secure: true,
});
module.exports = {
  send: (from, to, subject, text) => {
    // Setup e-mail data.
    const options = {
      from,
      to,
      subject,
      text,
    };
    // Return a promise of the function that sends the email.
    return transporter.sendMail(options);
  },
};
