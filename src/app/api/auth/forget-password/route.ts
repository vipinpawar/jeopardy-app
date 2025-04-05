import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import jwt from "jsonwebtoken";
import axios from "axios";

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const { email }: { email: string } = await req.json();
    console.log(email);
    
    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    // 1️ Check if user exists
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // 2️ Generate secure token & expiry (30 mins)
    const resetToken = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "30m" }
    );

    // 3 Create reset link
    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password?token=${resetToken}`;

    // 4️ Send reset email with Brevo using Axios
    try {
      const emailRes = await axios.post(
        "https://api.brevo.com/v3/smtp/email",
        {
          sender: { name: "Jeopardy Quiz Team", email: "pawarvipin14@gmail.com" },
          to: [{ email }],
          subject: "Reset Your Password",
          htmlContent: `
            <h1>Reset Your Password</h1>
            <p>Click the button below to reset your password:</p>
            <a href="${resetLink}" style="background-color:#4CAF50;color:white;padding:10px 20px;text-decoration:none;">Reset Password</a>
            <p>This link will expire in 30 minutes.</p>
          `,
        },
        {
          headers: {
            accept: "application/json",
            "api-key": process.env.BREVO_API_KEY as string,
            "content-type": "application/json",
          },
        }
      );
      
      console.log("Brevo response:", emailRes.data);

      return NextResponse.json({ message: "Reset email sent!" }, { status: 200 });
    } catch (error: any) {
      console.error("Brevo email error:", error.response?.data || error.message);

      return NextResponse.json(
        {
          message: "Failed to send email",
          error: error.response?.data || error.message,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error in password reset:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}
