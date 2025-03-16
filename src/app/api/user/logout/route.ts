import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const response = NextResponse.json({
      success: true,
      message: "Logged Out Successfully!",
    });
    response.cookies.set("token", "", { httpOnly: true, expires: new Date(0) });

    return response;
  } catch (error) {
    console.log("Error in logout user", error);

    return Response.json(
      { success: false, message: "Error in user logout" },
      { status: 500 }
    );
  }
}
