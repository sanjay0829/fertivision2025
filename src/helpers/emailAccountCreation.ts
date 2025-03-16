import { ApiResponse } from "@/types/ApiResponse";
import { MailService } from "@sendgrid/mail";

const sgMail = new MailService();
sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

export async function sendAccountCreationEmail(
  email: string,
  password: string
): Promise<ApiResponse> {
  try {
    const res = sgMail.send({
      from: { email: "ingo@groupthink.events", name: "FERTIVISION 2026" },
      to: email,
      subject: "Account successfully created at FERTIVISION 2026",
      html: `<div
        style='max-width:800px; width:90%; background-color: #257004; margin:10px auto; border: 1px solid #ccc; font-family:  sans-serif; font-size:1rem;padding:10px;'>
        <img src="https://fertivision2025.vercel.app/img/header.jpg" alt="" style="width: 100%;">
        <div style="background-color: #fff; border-radius: 10px; padding: 10px; margin-top: 10px;">
            <p><b>Dear Delegate,</b></p>
            <p>Your accounts for FERTIVISION 2026, New Delhi is created successfully.</p>
            <p>Login-ID : ${email}</p>
            <p>Password : ${password}</p>
            <br>
            <p>
                <b>Thanks & Regards</b><br>
                Team FERTIVISION 2026
            </p>
        </div>`,
    });
    return { success: true, message: "Account creation email sent" };
  } catch (error) {
    return { success: false, message: "Failed to send Account creation email" };
  }
}
