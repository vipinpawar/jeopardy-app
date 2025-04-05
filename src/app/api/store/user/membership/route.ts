import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/app/lib/prisma";
import { Membership } from "@prisma/client";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { membershipType }: { membershipType: string } = await request.json();
    if (!["MONTHLY", "YEARLY", "LIFETIME"].includes(membershipType)) {
      return NextResponse.json({ error: "Invalid membership type" }, { status: 400 });
    }

    let membershipEndDate: Date | null = null;
    const now = new Date();
    if (membershipType === "MONTHLY") {
      membershipEndDate = new Date(now.setMonth(now.getMonth() + 1));
    } else if (membershipType === "YEARLY") {
      membershipEndDate = new Date(now.setFullYear(now.getFullYear() + 1));
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        membership: membershipType as Membership,
        membershipStartDate: new Date(),
        membershipEndDate: membershipEndDate,
      },
    });

    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error("Error updating membership:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
