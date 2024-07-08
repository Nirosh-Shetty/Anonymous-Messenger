import VerificationEmail from "../../emails/verificationEmail";
import { Resend } from "resend";
import { apiResponse } from "../types/apiResponse";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (
  email: string,
  username: string,
  verifyCode: string
): Promise<apiResponse> => {
  try {
    // const { data, error }
    await resend.emails.send({
      from: "niroshshetty@gmail.com",
      to: email,
      subject: "Mystery Message Verification Cod",
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    return {
      success: true,
      message: "verfiaction message sent",
    };
  } catch (error: any) {
    console.log("error is sending message", error.message);
    return {
      success: false,
      message: "failed to send the message",
    };
  }
};

//TODO: check above if any error
