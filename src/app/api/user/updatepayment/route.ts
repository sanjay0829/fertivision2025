import { getTokenData } from "@/helpers/getTokenData";
import { SendConfiramtionEmail } from "@/helpers/sendConfirmationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const { userId, payment_status, receipt_no } = await request.json();

    const userIdToken: string = await getTokenData(request);

    if (userId != userIdToken) {
      return Response.json(
        {
          success: false,
          message: "Invalid Token details. Or Token not present",
        },
        { status: 400 }
      );
    }

    const userExists = await UserModel.findById(userId);

    if (!userExists) {
      return Response.json(
        { success: false, message: "User Not found! " },
        { status: 400 }
      );
    }

    const savedUSer = await UserModel.findByIdAndUpdate(
      userId,
      {
        payment_status: payment_status,
        receipt_no: receipt_no,
        payment_date: new Date(),
      },
      { new: true }
    );

    if (savedUSer?.payment_status != "Pending") {
      const result = await SendConfiramtionEmail(userId);
    }

    return Response.json(
      {
        success: true,
        message: "Payment Status updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in updating payment status", error);

    return Response.json(
      { success: false, message: "Error in updating payment status" },
      { status: 500 }
    );
  }
}
