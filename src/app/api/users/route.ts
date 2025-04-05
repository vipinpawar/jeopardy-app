import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET(): Promise<NextResponse> {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
