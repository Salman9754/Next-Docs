import Mailjet from "node-mailjet";
import { MJ_SECRET_KEY, MJ_API_KEY } from "../config/env";

if (!MJ_API_KEY || !MJ_SECRET_KEY) {
  throw new Error("Define the Mailjet api keys in the env file");
}

const mailjet = Mailjet.apiConnect(
  MJ_API_KEY ?? "", MJ_SECRET_KEY ?? ""
);

const sendEmail = async (name: string, email: string, otp: number) => {
  try {
    const request = mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: "salmanansarw2@gmail.com",
            Name: "Next Docs"
          },
          To: [
            {
              Email: email,
              Name: name
            }
          ],
          Subject: "Verify your email address",
          TextPart: "Use the code below to complete your sign-up",
          HTMLPart: `
  <div style="font-family: Arial, Helvetica, sans-serif; background-color: #f4f6f8; padding: 20px;">
    <div style="max-width: 500px; margin: auto; background-color: #ffffff; padding: 24px; border-radius: 8px;">
      
      <h2 style="color: #333; margin-bottom: 12px;">Verify Your Email</h2>
      
      <p style="color: #555; font-size: 14px;">
       HI ${name}! Thanks for signing up! Please use the OTP below to verify your account.
      </p>

      <div style="margin: 20px 0; text-align: center;">
        <span style="
          display: inline-block;
          font-size: 24px;
          letter-spacing: 4px;
          font-weight: bold;
          color: #0d6efd;
          background-color: #eef3ff;
          padding: 12px 20px;
          border-radius: 6px;
        ">
          ${otp}
        </span>
      </div>

      <p style="color: #777; font-size: 12px;">
        This OTP will expire in 5 minutes. Do not share it with anyone.
      </p>

      <p style="color: #999; font-size: 12px; margin-top: 20px;">
        If you didn’t request this, you can safely ignore this email.
      </p>

    </div>
  </div>
`

        }
      ]
    })
    await request;
    console.log("Email sent successfully");
    return true;

  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

export default sendEmail