"use server";
import { MailService } from "@sendgrid/mail";

import { ApiResponse } from "@/types/ApiResponse";
import UserModel from "@/models/user";

const sgMail = new MailService();
sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

export async function SendConfiramtionEmail(id: string): Promise<ApiResponse> {
  try {
    const userData = await UserModel.findById(id);

    if (!userData) {
      return { success: false, message: "User Data not found" };
    }
    if (userData.payment_status == "Pending") {
      return { success: false, message: "User Payment pending" };
    }

    const response = sgMail.send({
      from: { email: "info@groupthink.events", name: "FERTIVISION 2026" },
      bcc: { email: "sanjaymarki@gmail.com" },
      to: userData.email,
      subject: "Registration Confirmation - FERTIVISION 2026",
      html: `<div
        style='max-width:800px; width:90%; background-color: #620556; margin:10px auto; border: 1px solid #ccc; font-family:  "Lucida sans",  sans-serif; font-size:1rem;padding:10px;'>
        <img src="https://fertivision2025.vercel.app/img/header.jpg" alt="" style="width: 100%;">
        <div style="background-color: #fff; border-radius: 10px; padding: 10px; margin-top: 10px;">
         <p><b>Dear ${userData.fullname}</b></p>
         <p>Thank you for registering at <b>FERTIVISION 2026, New Delhi, 68th All India Congress of Obstetrics &
                    Gynaecology</b><b> to be held from 14th Jan to 18th Jan 2026.</b> Please find below your
                registration details.</p>
            <p>You are requested to kindly use the same for any future correspondence. Also, please keep a track of
                emails from this mail ID.</p>

            <h3 style="padding: 5px 7px; background-color: #620556; color: #fff;">REGISTRATION DETAILS</h3>
             <table border="1" cellspacing="0" cellpadding="5">
                <tr>
                    <td><b>Registration Type</b></td>
                    <td>:</td>
                    <td>${userData.reg_category}</td>
                </tr>
                <tr>
                    <td><b>Registration No.</b></td>
                    <td>:</td>
                    <td>${userData.reg_no}</td>
                </tr>
                <tr>
                    <td><b>Pre Lunch Workshop </b></td>
                    <td>:</td>
                    <td>${userData.pre_workshop}</td>
                </tr>
                <tr>
                    <td><b>Post Lunct Workshop</td>
                    <td>:</td>
                    <td>${userData.post_workshop}</td>
                </tr>
               
                <tr>
                    <td><b>No. of Accompaying Per.</b></td>
                    <td>:</td>
                    <td>${userData.no_of_accompany}</td>
                </tr>
            </table>
             <div>
                <h4 style='padding: 5px 7px; background-color: #620556; color: #fff;'>ACCOMPAYING PERSON DETAILS</h4>
                  ${
                    userData.no_of_accompany != 0
                      ? `<table border="1" cellspacing="0" cellpadding="5" style="width:100%">
                    <tr>
                        <td>S.no</td>
                        <td>Name</td>
                        <td>Age</td>
                       <td>Gender</td>
                    <tr>
                    ${userData.accompany_persons
                      .map(
                        (item, index) =>
                          `<tr>
                      <td>${index + 1}</td> 
                      <td>${item.accompany_name}</td>   
                      <td>${item.accompany_age}</td>   
                     <td>${item.accompany_gender}</td>   
                      </tr>`
                      )
                      .join("")}
                    </table>`
                      : `<p>None</p>`
                  }
                    
            </div>
            <div>
                <h4 style="padding: 5px 7px; background-color: #620556; color: #fff;">PAYMENT DETAILS</h4>
                    <table border="1" cellspacing="0" cellpadding="5">
                        <tr>
                            <td><b>Total Amount</b></td>
                            <td>:</td>
                            <td>${userData.currency} ${
        userData.total_amount
      }</td>
                        </tr>
                        <tr>
                            <td><b>Payment Status</b></td>
                            <td>:</td>
                            <td>${userData.payment_status}</td>
                        </tr>
                    </table>
            </div>  
            <p>Should you require any further clarification, please write to us at registration@aicogmumbai2026.com</p>
            <p>Looking forward to welcoming you at <b>FERTIVISION 2026, New Delhi</b></p>
            <br>
            <p>
                <b>Thanks & Regards</b><br>
                Conference Secretariat <br>
                FERTIVISION 2026
            </p>
        </div>
    </div>       

        `,
    });

    return { success: true, message: "Confirmation email sent" };
  } catch (error) {
    console.error("Error sending confirmation email", error);
    return { success: false, message: "Failed to send confirmation email" };
  }
}
