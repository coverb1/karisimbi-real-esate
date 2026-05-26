import { getSupabaseServiceRoleClient } from "@/src/lib/supabase-server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await getSupabaseServiceRoleClient();

    const [sellRes, visitRes] = await Promise.all([
      supabase
        .from("sell_property_submissions")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("property_visit_submissions")
        .select("*")
        .order("created_at", { ascending: false }),
    ]);

    if (sellRes.error || visitRes.error) {
      return NextResponse.json(
        { success: false, message: "Failed to fetch" },
        { status: 500 }
      );
    }

    const sellItems = (sellRes.data ?? []).map((r) => ({
      id: r.id,
      type: "sell-property" as const,
      name: r.full_name,
      email: r.email,
      phone: r.phone,
      address: r.address,
      id_number: r.id_number,
      property_type: r.property_type,
      location: r.location,
      property_size: r.property_size,
      asking_price: r.asking_price,
      documents_available: r.documents_available,
      has_issues: r.has_issues,
      issues_explanation: r.issues_explanation,
      unread: r.unread,
      created_at: r.created_at,
      message: `Wants to sell a ${r.property_type ?? "property"} in ${r.location ?? "-"} for ${r.asking_price ? "RWF " + r.asking_price : "-"}.`,
    }));

    const visitItems = (visitRes.data ?? []).map((r) => ({
      id: r.id,
      type: "property-visit" as const,
      name: r.full_name,
      email: r.email,
      phone: r.phone,
      address: r.address,
      id_number: r.id_number,
      property_type: r.property_type,
      property_location: r.property_location,
      property_price: r.property_price,
      visit_date: r.visit_date,
      visit_time: r.visit_time,
      transportation: r.transportation,
      unread: r.unread,
      created_at: r.created_at,
      message: `Wants to visit a ${r.property_type ?? "property"} in ${r.property_location ?? "-"} on ${r.visit_date ?? "-"} at ${r.visit_time ?? "-"}.`,
    }));

    const merged = [...sellItems, ...visitItems].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return NextResponse.json({ success: true, data: merged });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
