import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcrypt";
import prisma from "@/app/lib/prisma";

const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  // role: z.enum(["user", "admin"]),
});

// POST Handler
export async function POST(req) {
  try {
    const body = await req.json();

    // Validate using Zod
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      const errorMessages = parsed.error.errors.map((err) => err.message);
      return NextResponse.json({ error: errorMessages }, { status: 400 });
    }

    const { username, email, password } = parsed.data;
    // const { username, email, password, role } = parsed.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role:'user', // ! add case if user is admin 
      },
    }); 

    return NextResponse.json({
      message: "User registered successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
