import { sendAccountCreationEmail } from "@/helpers/emailAccountCreation";
import generateRegistrationNumber from "@/helpers/regNoGeneration";
import dbConnect from "@/lib/dbConnect";
import Jwt from "jsonwebtoken";
import UserModel from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { email, password } = await request.json();

    const userExists = await UserModel.findOne({ email }).collation({
      locale: "en",
      strength: 2,
    });

    if (userExists) {
      return Response.json(
        { success: false, message: "User with this email id already exists." },
        { status: 403 }
      );
    }

    const reg_no = await generateRegistrationNumber();

    if (!reg_no || reg_no.length == 0) {
      return Response.json(
        { success: false, message: "Registration Number not generated" },
        { status: 400 }
      );
    }
    const result = await sendAccountCreationEmail(email, password);

    const newUser = await UserModel.create({
      email,
      password,
      // fullname,
      reg_no,
    });

    const userWithoutPassword = newUser.toObject(); // Convert Mongoose document to a plain JavaScript object
    delete (userWithoutPassword as { password?: string }).password;

    const tokenData = {
      id: userWithoutPassword._id,
    };

    const token = Jwt.sign(tokenData, process.env.JWT_SECRET_KEY!, {
      expiresIn: "1d",
    });

    const response = NextResponse.json(
      {
        success: true,
        message: "Account created successfully",
        user: userWithoutPassword,
      },
      { status: 201 }
    );
    response.cookies.set("token", token, { httpOnly: true });

    return response;
  } catch (error) {
    console.log("Error in creating Account", error);

    return Response.json(
      { success: false, message: "Error in creating Account" },
      { status: 500 }
    );
  }
}
