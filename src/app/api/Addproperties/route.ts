import { NextResponse } from "next/server";
import { getSupabaseServiceRoleClient } from "@/src/lib/supabase-server";
import { requireAdminUser } from "@/src/lib/auth/session";
import type { Database } from "@/src/types/database";

type PropertyInsert = Database["public"]["Tables"]["properties"]["Insert"];

export async function POST(request: Request) {
  const user = await requireAdminUser().catch(() => null);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  // Only the columns that exist in your database
  const { title, location, type, price, bedrooms, bathrooms, area, image_url, status } = body;

  if (!title || !location || !type || !price || !bedrooms || !bathrooms || !area) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const supabase = getSupabaseServiceRoleClient();

  const newProperty: PropertyInsert = {
    title,
    location,
    type,
    status: status || "Active",
    price: Number(price),
    bedrooms: Number(bedrooms),
    bathrooms: Number(bathrooms),
    area: Number(area),
    image_url: image_url || null,
  };

  const { data, error } = await supabase
    .from("properties")
    .insert(newProperty)
    .select()
    .single();

  if (error) {
    console.error("Supabase insert error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ property: data }, { status: 201 });
}