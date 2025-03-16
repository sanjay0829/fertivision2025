import { ApiResponse } from "@/types/ApiResponse";
import { MailService } from "@sendgrid/mail";

const sgMail = new MailService();
sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

export async function sendPasswordResetLink(
  email: string,
  name: string,
  token: string
): Promise<ApiResponse> {
  try {
    const res = await sgMail.send({
      from: { email: "info@groupthink.events", name: "FERTIVISION 2026" },
      to: email,
      subject: "FERTIVISION 2026. Password reset link",
      html: `<div
        style='max-width:800px; width:90%; background-color: #257004; margin:10px auto; border: 1px solid #ccc; font-family:  "Lucida sans",  sans-serif; font-size:1rem;padding:10px;'>
        <img src="https://dummy.groupthink.events/img/header.jpg" alt="" style="width: 100%;">
        <div style="background-color: #fff; border-radius: 10px; padding: 10px; margin-top: 10px;">
                <p><b>Dear ${name}</b></p>
                
                <p>Please click the link below to reset your password</p>
                <p><a href="${process.env.DOMAIN}/resetpassword?token=${token}">Click here to reset password</a></p>
                <p></p>
                 <p>
                    <b>Thanks & Regards</b><br>
                    Team FERTIVISION 2026
                </p>
        </div>
        </div>`,
    });

    return { success: true, message: "Password reset email sent" };
  } catch (error) {
    console.error("Error sending password reset email", error);
    return { success: false, message: "Failed to send password reset email" };
  }
}
