import { getTokenData } from "@/helpers/getTokenData";
import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import UserModel from "@/models/user";

const uploadDirPG = path.join(process.cwd(), "public", "uploads/pg");
if (!fs.existsSync(uploadDirPG)) {
  fs.mkdirSync(uploadDirPG, { recursive: true }); // Create directory if it doesn't exist
}

const uploadDirSenior = path.join(process.cwd(), "public", "uploads/senior");
if (!fs.existsSync(uploadDirSenior)) {
  fs.mkdirSync(uploadDirSenior, { recursive: true }); // Create directory if it doesn't exist
}

//Register User /Update user details
export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const userIdToken = await getTokenData(request);
    const url = new URL(request.url);
    const userId = url.searchParams.get("id");
    const fileData = await request.formData();

    if (userId != userIdToken) {
      return Response.json(
        {
          success: false,
          message: "Invalid User for updation",
        },
        { status: 400 }
      );
    }

    const userExists = await UserModel.findById(userId);

    if (!userExists) {
      return Response.json(
        { success: false, message: "No user found to update" },
        { status: 400 }
      );
    }

    const accompanyPersonsData = fileData.get("accompany_persons") as string;

    let parsedAccompanyPersons = [];
    try {
      parsedAccompanyPersons = accompanyPersonsData
        ? JSON.parse(accompanyPersonsData)
        : [];
    } catch (error) {
      console.error("Invalid JSON for accompany_persons:", error);
      return NextResponse.json(
        { error: "Invalid JSON format for accompany_persons" },
        { status: 400 }
      );
    }

    const file = fileData.get("pg_file") as File;

    if (file) {
      console.log(file.name);
      //const fileExt = file.name.split(".").pop();
      const fileExt = path.extname(file.name);
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = userExists.reg_no + fileExt;
      const filepath = path.join(uploadDirPG, filename);
      fs.writeFileSync(filepath, buffer);

      await UserModel.findByIdAndUpdate(userId, { pg_certificate: filename });
    }

    const file2 = fileData.get("senior_file") as File;
    if (file2) {
      const fileExt = path.extname(file2.name);
      const bytes = await file2.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = userExists.reg_no + fileExt;
      const filepath = path.join(uploadDirSenior, filename);
      fs.writeFileSync(filepath, buffer);

      await UserModel.findByIdAndUpdate(userId, {
        senior_citizen_certificate: filename,
      });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        title: fileData.get("title"),
        fullname: fileData.get("fname") + " " + fileData.get("lname"),
        fname: fileData.get("fname"),
        lname: fileData.get("lname"),
        reg_category: fileData.get("reg_category"),
        email: fileData.get("email"),
        mobile: fileData.get("mobile"),
        mci_no: fileData.get("mci_no"),
        dob: fileData.get("dob"),
        age: fileData.get("age"),
        gender: fileData.get("gender"),
        designation: fileData.get("designation"),
        company: fileData.get("company"),
        city: fileData.get("city"),
        state: fileData.get("state"),
        country: fileData.get("country"),
        member_no: fileData.get("member_no"),
        pin: fileData.get("pin"),
        address: fileData.get("address"),
        cme: fileData.get("cme"),
        no_of_accompany: fileData.get("no_of_accompany"),
        pre_workshop: fileData.get("pre_workshop"),
        post_workshop: fileData.get("post_workshop"),

        conf_amount: fileData.get("conf_amount"),
        cme_amount: fileData.get("cme_amount"),
        accompany_amount: fileData.get("accompany_amount"),
        workshop_amount: fileData.get("workshop_amount"),
        banquet_amount: fileData.get("banquet_amount"),
        total_amount: fileData.get("total_amount"),
        accompany_persons: parsedAccompanyPersons,
        payment_status: fileData.get("payment_status") || "Pending",
        receipt_no: fileData.get("receipt_no") || "",
        currency: fileData.get("currency"),
      },
      { new: true }
    );
    console.log("acc Amount", fileData.get("accompany_amount"));
    console.log(updatedUser?.accompany_amount);

    return Response.json(
      {
        success: true,
        message: "Registration data saved Successfully",
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in registering User", error);

    return Response.json(
      { success: false, message: "Error in registering User" },
      { status: 500 }
    );
  }
}
