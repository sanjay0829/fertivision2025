import { getTokenData } from "@/helpers/getTokenData";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await dbConnect();
  try {
    const userId = await getTokenData(request);

    if (!userId) {
      return Response.json(
        { success: false, message: "Invalid user Token" },
        { status: 400 }
      );
    }

    const userExists = await UserModel.findById(userId).select(
      "-password -__v"
    );

    if (!userExists) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "User found",
        user: userExists,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in getting user details Token", error);

    return Response.json(
      { success: false, message: "Error in getting user details Token" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { userId } = await request.json();

    if (!userId) {
      return Response.json(
        { success: false, message: "User id is not provided" },
        { status: 400 }
      );
    }

    const userExists = await UserModel.findById(userId).select("-password");

    if (!userExists) {
      return Response.json(
        { success: false, message: "User Not Found" },
        { status: 400 }
      );
    }

    return Response.json(
      { success: true, message: "User Found", user: userExists },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in getting user details", error);

    return Response.json(
      { success: false, message: "Error in getting user details" },
      { status: 500 }
    );
  }
}
