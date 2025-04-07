import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import { isJWT } from "validator";

const privateRoutes = ["/dashboard", "/account", "/practice"];
const publicRoutes = ["/", "/about", "/login"];

export const middleware = async (req: NextRequest) => {
  const { pathname } = req.nextUrl;

  // gets account and signature from cookies
  const account = req.cookies.get("account")?.value;
  const signature = req.cookies.get("signature")?.value;
  const token = req.cookies.get("token")?.value;
  const message = "Authenticate with ThinkInk";

  // checks if user is authenticated
  let isAuthenticated = false;

  if (account && signature && token) {
    try {
      if (!isJWT(token)) throw new Error("JWT is invalid!");

      const recoveredAddress = ethers.verifyMessage(message, signature);
      isAuthenticated = recoveredAddress.toLowerCase() === account.toLowerCase();
    } catch (err) {
      console.error("Signature verification failed:", err);
      isAuthenticated = false;
    }
  }

  // prevents authenticated users from accessing `/login`
  if (pathname === "/login" && isAuthenticated) {
    console.log("Authenticated user attempted /login, redirecting to /dashboard");
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // allowing unauthenticated users to access public routes
  if (publicRoutes.includes(pathname) && !isAuthenticated) {
    return NextResponse.next();
  }

  // protects private routes
  if (privateRoutes.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      console.log("Unauthenticated user attempted private route, redirecting to /login");
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // proceed user is authenticated
  return NextResponse.next();
};

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
