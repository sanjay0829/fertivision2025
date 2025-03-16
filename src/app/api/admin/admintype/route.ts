import { getAdminToken } from "@/helpers/getTokenData";
import dbConnect from "@/lib/dbConnect";
import AdminModel from "@/models/admin";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  await dbConnect();
  try {
    const adminId = await getAdminToken(request);

    if (!adminId) {
      return Response.json(
        { success: false, message: "Invalid Admin Token / Token expired" },
        { status: 400 }
      );
    }

    const adminExists = await AdminModel.findById(adminId).select(
      "-login_password"
    );
    if (!adminExists) {
      return Response.json(
        { success: false, message: "Admin Details Not found" },
        { status: 400 }
      );
    }

    return Response.json(
      { success: true, message: "Admin Details found", admin: adminExists },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { success: false, message: "Unable to get usertype" },
      { status: 500 }
    );
  }
}
