import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { email, password } = await request.json();

    const userExists = await UserModel.findOne({ email, password }).collation({
      locale: "en",
      strength: 2,
    });

    if (!userExists) {
      return Response.json(
        {
          success: false,
          message: "Invalid login credential. Please check and try again",
        },
        {
          status: 400,
        }
      );
    }

    const tokenData = {
      id: userExists._id,
    };

    const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY!, {
      expiresIn: "1d",
    });

    const response = NextResponse.json(
      {
        success: true,
        message: "Login successfull!",
        user: userExists,
      },
      { status: 200 }
    );

    response.cookies.set("token", token, { httpOnly: true });

    return response;
  } catch (error) {
    console.log("Error in Login Account", error);

    return Response.json(
      { success: false, message: "Error in Login account" },
      { status: 500 }
    );
  }
}
