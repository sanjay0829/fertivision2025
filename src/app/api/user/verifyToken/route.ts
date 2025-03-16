import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  await dbConnect();
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get("token");

    if (!token) {
      return Response.json(
        {
          success: false,
          message: "Invalid token for Password reset!",
        },
        { status: 400 }
      );
    }

    const userExists = await UserModel.findOne({
      forgotPasswordToken: token,
      forgotPasswordTokenExpiry: { $gt: Date.now() },
    }).select("-password");

    if (!userExists) {
      return Response.json(
        {
          success: false,
          message: "Invalid token or token is Expired!",
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Token is valid",
        user: userExists,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { success: false, message: "Error in getting user data baesd on token" },
      { status: 500 }
    );
  }
}
