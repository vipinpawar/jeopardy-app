import axios from "axios";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

interface CaptchaRequestBody {
  captchaToken: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CaptchaRequestBody = await request.json();
    const { captchaToken } = body;

    console.log("Request Body:", body);
    console.log("Captcha Token:", captchaToken);

    if (!captchaToken) {
      console.error("No CAPTCHA token provided");
      return NextResponse.json(
        { message: "No CAPTCHA token provided" },
        { status: 400 }
      );
    }

    const secretKey: string | undefined = process.env.RECAPTCHA_SECRET_KEY;

    console.log("Secret Key:", secretKey);

    if (!secretKey) {
      console.error("RECAPTCHA_SECRET_KEY not found");
      return NextResponse.json(
        { message: "Server configuration error" },
        { status: 500 }
      );
    }

    console.log("Sending request to Google reCAPTCHA API...");

    const captchaResponse = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      {
        params: {
          secret: secretKey,
          response: captchaToken,
        },
      }
    );

    const captchaData: { success: boolean } = captchaResponse.data;

    console.log("Google reCAPTCHA response:", captchaData);

    if (!captchaData.success) {
      console.error("CAPTCHA verification failed:", captchaData);
      return NextResponse.json(
        { message: "CAPTCHA verification failed" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "CAPTCHA verified successfully",
    });
  } catch (error) {
    console.error("Error verifying CAPTCHA:", error);
    return NextResponse.json(
      { message: "Server error during CAPTCHA verification" },
      { status: 500 }
    );
  }
}
