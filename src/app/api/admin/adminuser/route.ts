import dbConnect from "@/lib/dbConnect";
import AdminModel from "@/models/admin";

import { NextRequest } from "next/server";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { name, login_id, login_password, user_type } = await request.json();

    const loginExists = await AdminModel.findOne({ login_id });

    if (loginExists) {
      return Response.json(
        { success: false, message: "Admin with login id already exists" },
        { status: 400 }
      );
    }

    const adminCreated = await AdminModel.create({
      name,
      login_id,
      login_password,
      user_type,
    });

    // Convert Mongoose document to a plain object
    const adminData = adminCreated.toObject() as Record<string, any>;

    // Ensure login_password exists before deleting
    if ("login_password" in adminData) {
      delete adminData.login_password;
    }

    return Response.json(
      {
        success: true,
        message: "Admin Created successfully",
        adminuser: adminData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in creating Admin", error);

    return Response.json(
      { success: false, message: "Error in creating Admin" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  await dbConnect();
  try {
    const url = new URL(request.url);
    const adminId = url.searchParams.get("id");

    if (!adminId) {
      return Response.json(
        { success: false, message: "Admin Id is not provided" },
        { status: 400 }
      );
    }

    const adminUser = await AdminModel.findById(adminId);

    if (!adminUser) {
      return Response.json(
        { success: false, message: "Admin User Not Found" },
        { status: 400 }
      );
    }

    adminUser.deleteOne();

    return Response.json({
      success: true,
      message: "Admin user deleted successfully",
    });
  } catch (error) {
    console.log("Error in Deleting Admin", error);

    return Response.json(
      { success: false, message: "Error in Deleting Admin" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  await dbConnect();
  try {
    const url = new URL(request.url);

    const adminId = url.searchParams.get("adminId");

    if (adminId) {
      const adminuser = await AdminModel.findById(adminId);
      if (!adminuser) {
        return Response.json(
          {
            success: false,
            message: "Admin User not found",
          },
          { status: 400 }
        );
      }
      return Response.json(
        {
          success: true,
          message: "Admin user found",
          admin: adminuser,
        },
        { status: 200 }
      );
    }

    const adminUsers = await AdminModel.find();

    if (!adminUsers) {
      return Response.json(
        {
          success: false,
          message: "No Admin users to display",
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Admin user found",
        adminusers: adminUsers,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in getting Admin Users", error);

    return Response.json(
      { success: false, message: "Error in getting Admin Users" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  await dbConnect();
  try {
    const url = new URL(request.url);

    const adminId = url.searchParams.get("adminId");

    if (!adminId) {
      return Response.json(
        { success: false, message: "Please provide admin id to update" },
        { status: 400 }
      );
    }

    const adminExists = await AdminModel.findById(adminId);

    if (!adminExists) {
      return Response.json(
        { success: false, message: "Admin not found for updation" },
        { status: 400 }
      );
    }

    const { name, login_id, login_password, user_type } = await request.json();

    const loginExists = await AdminModel.findOne({
      $and: [
        {
          login_id: {
            $regex: new RegExp(`^${login_id}$`, "i"),
          },
        },
        { _id: { $ne: adminId } },
      ],
    });

    if (loginExists) {
      return Response.json(
        { success: false, message: "Admin with login id already exists" },
        { status: 400 }
      );
    }

    const adminUpdated = await AdminModel.findByIdAndUpdate(
      adminId,
      {
        name,
        login_id,
        login_password,
        user_type,
      },
      { new: true }
    ).select("-login_password");

    // Convert Mongoose document to a plain object

    return Response.json(
      {
        success: true,
        message: "Admin updated successfully",
        adminuser: adminUpdated,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in Updating Admin", error);

    return Response.json(
      { success: false, message: "Error in Updating Admin" },
      { status: 500 }
    );
  }
}
