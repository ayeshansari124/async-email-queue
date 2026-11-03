import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail({ email, subject, message }) {
  const result = await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject,
    text: message,
  });

  console.log("Email accepted by SMTP:", result.messageId);

  return result;
}
