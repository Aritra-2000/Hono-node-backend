import env from "@/env.js";
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", 
  port: 465,
  secure: true,
  auth: {
    user: env.EMAIL_USER, 
    pass: env.EMAIL_PASS, 
  },
});


export async function sendEmail(to: string, subject: string, text: string) {
  const info = await transporter.sendMail({
    from: `"My App" <${env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });

  console.log("Email sent:", info.messageId);
}
