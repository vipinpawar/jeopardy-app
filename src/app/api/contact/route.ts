import { z } from "zod";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();

    const validated = contactSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { message: "Validation failed", errors: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, message } = body;

    const brevoResUser = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { name: "Jeopardy Quiz Game", email: "pawarvipin14@gmail.com" },
        to: [{ email }],
        templateId: parseInt(process.env.BREVO_USER_TEMPLATE_ID as string, 10),
        params: {
          NAME: name,
          MESSAGE: message,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.BREVO_API_KEY as string,
        },
      }
    );

    const brevoResAdmin = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { name: "Jeopardy Quiz Game", email: "pawarvipin14@gmail.com" },
        to: [{ email: process.env.ADMIN_EMAIL as string }],
        templateId: parseInt(process.env.BREVO_ADMIN_TEMPLATE_ID as string, 10),
        params: {
          NAME: name,
          EMAIL: email,
          MESSAGE: message,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.BREVO_API_KEY as string,
        },
      }
    );

    if (!brevoResUser.data || !brevoResAdmin.data) {
      return NextResponse.json({ message: "Failed to send emails" }, { status: 500 });
    }

    return NextResponse.json({ message: "Emails sent successfully!" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}