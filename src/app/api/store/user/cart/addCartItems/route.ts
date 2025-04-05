import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/app/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextRequest } from "next/server";

// POST: Add Item to Cart
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        console.log(body);
        const { itemId } = body;
        console.log(itemId);

        if (!itemId || typeof itemId !== "string") {
            return NextResponse.json({ error: "Item ID is required and must be a string" }, { status: 400 });
        }

        const item = await prisma.item.findUnique({ where: { id: itemId } });
        if (!item) {
            return NextResponse.json({ error: "Item not found" }, { status: 404 });
        }

        const existingCartItem = await prisma.cart.findFirst({
            where: { userId: session.user.id, itemId },
        });

        if (existingCartItem) {
            return NextResponse.json({ message: "Item already in cart" }, { status: 400 });
        }

        const newCartItem = await prisma.cart.create({
            data: {
                userId: session.user.id,
                itemId,
            },
        });

        return NextResponse.json({ cartItem: newCartItem }, { status: 201 });
    } catch (error) {
        console.error("Error adding to cart:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}