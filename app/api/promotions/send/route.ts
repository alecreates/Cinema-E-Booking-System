import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import emailjs from "@emailjs/nodejs";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { promoCode, type, value } = body;

    // ✅ validation (UPDATED FOR DECORATOR SYSTEM)
    if (!promoCode || !type || value == null) {
      return NextResponse.json(
        { success: false, message: "Missing promo data" },
        { status: 400 }
      );
    }

    // 1. get subscribed users
    const users = await User.find({ promoSub: true }).lean();

    const results: any[] = [];

    // 2. send emails
    for (const user of users) {
      try {
        await emailjs.send(
          process.env.EMAILJS_SERVICE_ID!,
          "template_w4asuw3",
          {
            name: user.name,
            email: user.email,

            // ✅ NEW PROMO FIELDS (NO MORE discount)
            promoCode,
            discount: value,
          },
          {
            publicKey: process.env.EMAILJS_PUBLIC_KEY!,
          }
        );

        results.push({ email: user.email, status: "sent" });
      } catch (err) {
        console.error("Email failed:", user.email, err);
        results.push({ email: user.email, status: "failed" });
      }
    }

    return NextResponse.json({
      success: true,
      sent: results.filter(r => r.status === "sent").length,
      results,
    });

  } catch (err) {
    console.error("Send promo error:", err);
    return NextResponse.json(
      { success: false, message: "Server error sending emails" },
      { status: 500 }
    );
  }
}