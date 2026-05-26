import { getSupabaseServiceRoleClient } from "@/src/lib/supabase-server";
import { NextResponse } from "next/server";

export async function PATCH() {
  try {
    const supabase = await getSupabaseServiceRoleClient();

    const [sellRes, visitRes] = await Promise.all([
      supabase
        .from("sell_property_submissions")
        .update({ unread: false })
        .eq("unread", true),
      supabase
        .from("property_visit_submissions")
        .update({ unread: false })
        .eq("unread", true),
    ]);

    if (sellRes.error || visitRes.error) {
      return NextResponse.json(
        { success: false, message: "Failed to update" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}