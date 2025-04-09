const nodemailer = require("nodemailer");
require("dotenv").config(); // If you’re using a .env file

const transporter = nodemailer.createTransport({
  host: "mail.psitechconsultancy.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || "connect@psitechconsultancy.com",
    pass: process.env.EMAIL_PASS || "Connect@2024",
  },
  tls: {
    rejectUnauthorized: false,
  },
  logger: true,
  debug: true,
});

const mailOptions = {
  from: '"FMS Test" <connect@psitechconsultancy.com>',
  to: "uditkoli2002@gmail.com", // <-- CHANGE this to your email to test delivery
  subject: "Test Mail from Psitech SMTP",
  text: "This is a plain text test email from Psitech SMTP server.",
  html: "<p>This is a <strong>test email</strong> from <em>mail.psitechconsultancy.com</em></p>",
};

transporter.sendMail(mailOptions, (err, info) => {
  if (err) {
    console.error("❌ Error sending email:", err);
  } else {
    console.log("✅ Email sent successfully!");
    console.log("📬 Info:", info);
  }
});
