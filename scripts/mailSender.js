const nodemailer = require("nodemailer");

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  service: "gmail",  
  auth: {
    user: "saqlainkoser@gmail.com",
    pass: "jkbw mbtg msnk ptlo",
  },
});

// Wrap in an async IIFE so we can use await.
const sendMailer = async (email,text,html) => {
  const info = await transporter.sendMail({
    from: '"University Assignment System" <saqlainkoser@gmail.com>',
    to: email,
    subject: "User Credentials to Login.",
    text: text, // plain‑text body
    html:html
  });

  console.log("Message sent:", info.messageId);
};

module.exports = {sendMailer}
