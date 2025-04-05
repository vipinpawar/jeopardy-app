import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/app/lib/prisma";
import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { id, street, city, state, pin, mobile, country } = await request.json();

    if (!street || !city || !state || !pin || !country) {
      return NextResponse.json(
        { error: "Required address fields (street, city, state, pin, country) are missing" },
        { status: 400 }
      );
    }

    let updatedAddress;
    if (id) {
      // Update existing address if id is provided
      updatedAddress = await prisma.address.update({
        where: { id, userId }, // Ensure the address belongs to the user
        data: { street, city, state, pin, mobile, country },
      });
    } else {
      // Create a new address
      updatedAddress = await prisma.address.create({
        data: { userId, street, city, state, pin, mobile, country, type: "Home" }, // Default type
      });
    }

    return NextResponse.json({
      message: "Address updated successfully",
      address: updatedAddress,
    });
  } catch (error) {
    console.error("Error updating address:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { addressId } = await request.json();

    if (!addressId) {
      return NextResponse.json({ error: "Address ID is required" }, { status: 400 });
    }

    await prisma.address.delete({
      where: { id: addressId, userId }, // Ensure the address belongs to the user
    });

    return NextResponse.json({ message: "Address deleted successfully" });
  } catch (error) {
    console.error("Error deleting address:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}