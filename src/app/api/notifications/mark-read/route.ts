import { getSupabaseServiceRoleClient } from "@/src/lib/supabase-server";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, type } = body;
    const supabase = await getSupabaseServiceRoleClient();

    const table =
      type === "sell-property"
        ? "sell_property_submissions"
        : "property_visit_submissions";

    const { error } = await supabase
      .from(table)
      .update({ unread: false })
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
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