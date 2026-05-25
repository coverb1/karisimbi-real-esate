import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as {
      token?: unknown;
      newPassword?: unknown;
    } | null;

    const token = typeof body?.token === "string" ? body.token.trim() : "";
    const newPassword = typeof body?.newPassword === "string" ? body.newPassword : "";

    // 1. Validate inputs
    if (!token) {
      return NextResponse.json({ error: "Reset token is missing." }, { status: 400 });
    }
    if (!newPassword || newPassword.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    // 2. Find user by token
    const { data: user, error: findError } = await supabase
      .from("profiles")
      .select("id, reset_token, reset_token_expiry")
      .eq("reset_token", token)
      .maybeSingle();

    if (findError) {
      console.error("[reset-password] DB lookup error:", findError);
      return NextResponse.json(
        { error: "Something went wrong. Please try again." },
        { status: 500 }
      );
    }

    // 3. Token not found
    if (!user) {
      return NextResponse.json(
        { error: "This reset link is invalid or has already been used." },
        { status: 400 }
      );
    }

    // 4. Check expiry
    if (!user.reset_token_expiry) {
      return NextResponse.json(
        { error: "This reset link has expired. Please request a new one." },
        { status: 400 }
      );
    }

    const expiry = new Date(user.reset_token_expiry);
    if (Number.isNaN(expiry.getTime()) || expiry < new Date()) {
      return NextResponse.json(
        { error: "This reset link has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // 5. Update the Supabase Auth password used by signInWithPassword.
    const { error: authUpdateError } = await supabase.auth.admin.updateUserById(
      user.id,
      { password: newPassword }
    );

    if (authUpdateError) {
      console.error("[reset-password] Auth password update error:", authUpdateError);
      return NextResponse.json(
        { error: "Failed to update password. Please try again." },
        { status: 500 }
      );
    }

    // 6. Save new password + clear token
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        reset_token: null,
        reset_token_expiry: null,
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("[reset-password] Password update error:", updateError);
      return NextResponse.json(
        { error: "Failed to update password. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("[reset-password] Unhandled error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
