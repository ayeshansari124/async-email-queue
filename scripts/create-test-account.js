import nodemailer from "nodemailer";

const account = await nodemailer.createTestAccount();

console.log("SMTP HOST:", account.smtp.host);
console.log("SMTP PORT:", account.smtp.port);
console.log("SMTP USER:", account.user);
console.log("SMTP PASS:", account.pass);
