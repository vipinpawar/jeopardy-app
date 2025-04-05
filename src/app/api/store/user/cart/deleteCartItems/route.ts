import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/app/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextRequest } from "next/server";

// DELETE: Remove Item from Cart
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const cartItemId: string = body.cartItemId;

    if (!cartItemId) {
      return NextResponse.json(
        { error: "Item ID is required" },
        { status: 400 }
      );
    }

    const deletedCart = await prisma.cart.delete({
      where: { 
        id: cartItemId,
        userId: session.user.id, // Ensuring item belongs to user
      },
    });

    return NextResponse.json(
      { message: "Item removed from cart", deletedCart },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error removing from cart:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}