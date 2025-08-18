// import nodemailer from "nodemailer";
import { createTransport } from "nodemailer";

import { apiResponse } from "@/types/apiResponse";
// import VerificationEmail from "../../emails/verificationEmail";
// const transporter = createTransport({
//   host: "sandbox.smtp.mailtrap.io",
//   port: 587,
//   secure: false, // Use `true` for port 465, `false` for all other ports
//   auth: {
//     user: process.env.MAILTRAP_USERNAME,
//     pass: process.env.MAILTRAP_PASSWORD,
//   },
// });
const user = process.env.NODEMAILER_USER;
const pass = process.env.NODEMAILER_PASS;
console.log(user, pass);
const transporter = createTransport({
  service: "gmail",
  auth: {
    user,
    pass,
  },
});

export const mailer = async (
  email: string,
  username: string,
  verifyCode: string
): Promise<apiResponse> => {
  const htmlContent = `
  <!DOCTYPE html>
  <html lang="en" dir="ltr">
    <head>
      <meta charset="UTF-8" />
      <title>Verification Code</title>
      <style>
        @font-face {
          font-family: 'Roboto';
          font-style: normal;
          font-weight: 400;
          mso-font-alt: 'Verdana';
          src: url(https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2) format('woff2');
        }
        body {
          font-family: 'Roboto', Verdana;
          margin: 0;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 10px;
        }
        h2 {
          color: #333;
        }
        p {
          font-size: 14px;
          line-height: 24px;
          margin: 16px 0;
        }
        .otp {
          font-size: 20px;
          font-weight: bold;
          margin: auto;
        }
        .link {
          color: #007bff;
          text-decoration: none;
        }
        .link:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Hello ${username},</h2>
        <p>Thank you for registering. Please use the following verification code to complete your registration:</p>
        <h1 class="otp">${verifyCode}</h1>
        <p>If you did not request this code, please ignore this email.</p>
        <p>
          Or <a href="http://localhost:3000/verify/${username}?code=${verifyCode}" class="link">click here to verify your email</a>.
        </p>
      </div>
    </body>
  </html>
`;

  try {
    const mailOptions = {
      from: user,
      to: email,
      subject: "Verification OTP",
      html: htmlContent,
    };
    const info = await transporter.sendMail(mailOptions);

    return {
      success: true,
      message: "Verification code sent to your Email",
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Unable to send Verification code: ${error.message}`,
    };
  }
};
