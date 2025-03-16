import { ApiResponse } from "@/types/ApiResponse";
import axios from "axios";

export async function updatePaymentDetails(
  userId: string,
  payment_status: string,
  receipt_no?: string
): Promise<ApiResponse> {
  try {
    console.log(userId, payment_status, receipt_no);
    const response = await axios.post<ApiResponse>("/api/user/updatepayment", {
      userId,
      payment_status,
      receipt_no,
    });
    console.log(response);
    if (response.data.success) {
      return { success: true, message: response.data.message };
    } else {
      return { success: false, message: "Payment Status not updated" };
    }
  } catch (error) {
    console.log("error : payment details not updated", error);
    return { success: false, message: "payment details not updated" };
  }
}
