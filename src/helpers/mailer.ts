import nodemailer from "nodemailer";
import { apiResponse } from "@/types/apiResponse";
import VerificationEmail from "../../emails/verificationEmail";
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "ad5dbcda4605fc",
    pass: "9e2908f91f1a28",
    //TODO add this details to .ev file
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
          margin:auto;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Hello ${username},</h2>
        <p>Thank you for registering. Please use the following verification code to complete your registration:</p>
        <h1 class="otp">  ${verifyCode}</h1>
        <p>If you did not request this code, please ignore this email.</p>
      </div>
    </body>
  </html>
  `;
  try {
    const mailOptions = {
      from: "niroshshetty@gmail.com",
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
      success: true,
      message: `Unable to send Verification code: ${error.message}`,
    };
  }
};
