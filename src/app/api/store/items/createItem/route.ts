import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { name, category, basePrice, imageUrl }: { 
      name: string;
      category: string;
      basePrice: string | number;
      imageUrl: string;
    } = await request.json();

    console.log(name);

    const item = await prisma.item.create({
      data: {
        name,
        category,
        basePrice: Number(basePrice),
        imageUrl,
      },
    });

    return NextResponse.json({ item });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create item" }, { status: 500 });
  }
}
