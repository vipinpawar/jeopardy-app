import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/app/lib/prisma";
import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";

interface DecodedToken extends JwtPayload {
  email: string;
}

export async function POST(req: Request): Promise<Response> {
  try {
    const { token, password }: { token: string; password: string } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { message: "Token and password are required." },
        { status: 400 }
      );
    }

    // 1️ Verify and decode the JWT token
    let decoded: DecodedToken;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
    } catch (err) {
      console.error("Invalid or expired token", err);
      return NextResponse.json(
        { message: "Invalid or expired token." },
        { status: 400 }
      );
    }

    const userEmail = decoded.email;

    // 2️ Find user by email from decoded token
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found." },
        { status: 404 }
      );
    }

    // 3️ Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️ Update user's password
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { message: "Password reset successful!" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
