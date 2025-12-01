const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587, // Puerto para TLS
  secure: false, // true para 465 (SSL), false para otros puertos
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});


const sendEmail = async (to, subject, html) => {
  try {
    console.log(`Intentando enviar correo a ${to}...`);
    const info = await transporter.sendMail({
      from: `"Buggle" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`Correo enviado a ${to}. Message ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`Error al enviar correo a ${to}:`, {
      message: error.message,
      code: error.code,
      response: error.response,
    });
    return false;
  }
};


module.exports = { sendEmail };
