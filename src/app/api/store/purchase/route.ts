import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/app/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]/route";
import axios from "axios"; // Import axios for Brevo API

const BREVO_API_KEY = process.env.BREVO_API_KEY as string;
const BREVO_SENDER_EMAIL = "pawarvipin14@gmail.com";

interface CartItem {
  itemId: string;
}

export async function POST(req: Request): Promise<Response> {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { cartItems }: { cartItems: CartItem[] } = await req.json();
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json({ success: false, message: "Cart items are required" }, { status: 400 });
    }

    const itemIds = cartItems.map((item) => item.itemId);
    const items = await prisma.item.findMany({
      where: { id: { in: itemIds } },
    });

    if (!items.length) {
      return NextResponse.json({ success: false, message: "Invalid items" }, { status: 400 });
    }

    const purchases = items.map((item) => ({
      userId: session.user.id,
      itemId: item.id,
      pricePaid: item.basePrice,
    }));

    await prisma.purchase.createMany({ data: purchases });

    // Check if a digital product was purchased
    const digitalItems = items.filter((item) => item.downloadUrl);
    if (digitalItems.length > 0) {
      const emailContent = `
        <h2>Thank you for your purchase!</h2>
        <p>Here is your download link:</p>
        <ul>
          ${digitalItems.map((item) => `<li><a href="${item.downloadUrl}">${item.name}</a></li>`).join("")}
        </ul>
      `;

      await axios.post(
        "https://api.brevo.com/v3/smtp/email",
        {
          sender: { email: BREVO_SENDER_EMAIL },
          to: [{ email: session.user.email }],
          subject: "Your Digital Product Download",
          htmlContent: emailContent,
        },
        {
          headers: {
            "api-key": BREVO_API_KEY,
            "Content-Type": "application/json",
          },
        }
      );
    }

    return NextResponse.json({ success: true, message: "Purchase successful!" });
  } catch (err) {
    console.error("Purchase error:", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
