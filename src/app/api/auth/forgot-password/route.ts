import crypto from "crypto";
import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const SUCCESS_MESSAGE =
  "If that email exists, a reset link has been sent.";

const TOKEN_TTL_MS = 15 * 60 * 1000; // 15 minutes

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(
      () => null
    )) as { email?: unknown } | null;

    const email =
      typeof body?.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error: "Email is required",
        },
        { status: 400 }
      );
    }

    // 1. Find user
    const { data: user, error: findError } =
      await supabase
        .from("profiles")
        .select("email")
        .eq("email", email)
        .maybeSingle();

    if (findError) {
      console.error(
        "[forgot-password] DB lookup error:",
        findError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Database error. Please try again.",
        },
        { status: 500 }
      );
    }

    // ✅ NEW: If user not found → return error for Toastify
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "This email is not registered",
        },
        { status: 404 }
      );
    }

    // 2. Generate token + expiry
    const token = crypto
      .randomBytes(32)
      .toString("hex");

    const expiry = new Date(
      Date.now() + TOKEN_TTL_MS
    ).toISOString();

    // 3. Save token
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        reset_token: token,
        reset_token_expiry: expiry,
      })
      .eq("email", email);

    if (updateError) {
      console.error(
        "[forgot-password] Token save error:",
        updateError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Failed to generate reset token",
        },
        { status: 500 }
      );
    }

    // 4. Send email
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      new URL(request.url).origin;

    const resetLink = `${baseUrl}/reset-password?token=${encodeURIComponent(
      token
    )}`;

    await transporter.sendMail({
      from: `"Karisimbi Real Estate" <${process.env.SMTP_FROM_EMAIL}>`,
      to: email,
      subject:
        "Reset Your Password — Karisimbi Real Estate",
      html: `
        <html>
          <body>
            <h2>Reset Password</h2>
            <p>Click below to reset your password</p>
            <a href="${resetLink}">Reset Password</a>
          </body>
        </html>
      `,
    });

    return NextResponse.json({
      success: true,
      message: SUCCESS_MESSAGE,
    });
  } catch (error) {
    console.error(
      "[forgot-password] Unhandled error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong",
      },
      { status: 500 }
    );
  }
}