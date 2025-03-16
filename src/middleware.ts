import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isPublicPath =
    path === "/login" ||
    path === "/" ||
    path === "/forgotpassword" ||
    path === "/resetpassword";

  const token = request.cookies.get("token")?.value || "";

  if (token) {
    try {
      // Create a secret key from the environment variable
      const secretKey = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

      // Verify the token
      const { payload } = await jwtVerify(token, secretKey);
      //console.log("Decoded Token:", payload);

      const userId = payload.id;
    } catch (error) {
      // Token is invalid, clear the cookie and redirect to login
      console.error("Token verification failed:", error);
      const response = NextResponse.redirect(
        new URL("/login", request.nextUrl)
      );
      response.cookies.delete("token");
      return response;
    }
  }

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/profile", request.nextUrl));
  }

  if (!isPublicPath && !token && !path.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  const admintoken = request.cookies.get("admintoken")?.value || "";

  if (admintoken) {
    try {
      // Create a secret key from the environment variable
      const secretKey = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

      // Verify the token
      const { payload } = await jwtVerify(admintoken, secretKey);
      //console.log("Decoded Token:", payload);

      const userId = payload.id;
    } catch (error) {
      // Token is invalid, clear the cookie and redirect to login
      console.error("Token verification failed:", error);
      const response = NextResponse.redirect(
        new URL("/admin", request.nextUrl)
      );
      response.cookies.delete("admintoken");
      return response;
    }
  }

  if (path.startsWith("/admin/") && !admintoken) {
    return NextResponse.redirect(new URL("/admin", request.nextUrl));
  }
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/profile",
    "/forgotpassword",
    "/resetpassword",
    "/register",
    "/admin/:path",
  ],
};
