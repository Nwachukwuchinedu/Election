const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const sendCredentialsEmail = async (email, firstName, lastName, password) => {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Election System - Your Login Credentials',
      html: `
        <h2>Election System Login Credentials</h2>
        <p>Hello ${firstName} ${lastName},</p>
        <p>Your login credentials for the Election System are:</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Password:</strong> ${password}</p>
        <p>Please keep this information secure and do not share it with others.</p>
        <p>Best regards,<br>Election System Team</p>
      `
    });
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = { sendCredentialsEmail };