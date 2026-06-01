import { NextResponse } from "next/server";
import { getSupabaseServiceRoleClient } from "@/src/lib/supabase-server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const limit = searchParams.get("limit");

  const supabase = getSupabaseServiceRoleClient();

  let query = supabase
    .from("properties")
    .select("id, title, location, type, price, status, bedrooms, bathrooms, area, area_has_plus, image_url, created_at")
    .order("created_at", { ascending: false });

  if (type && type !== "All") {
    query = query.eq("type", type);
  }

  if (limit) {
    query = query.limit(Number(limit));
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ properties: data });
}
