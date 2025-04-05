import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Item ID is required" }, { status: 400 });
    }

    const body = await req.json();
    const { name, category, basePrice, imageUrl } = body;

    if (!name || !category || !basePrice || !imageUrl) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const item = await prisma.item.update({
      where: { id },
      data: {
        name,
        category,
        basePrice: Number(basePrice), // Ensure basePrice is a number
        imageUrl,
      },
    });

    return NextResponse.json({ item });
  } catch (error) {
    console.error("Error updating item:", error);
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}