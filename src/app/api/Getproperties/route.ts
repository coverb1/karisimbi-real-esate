import { NextResponse } from "next/server";
import { getSupabaseServiceRoleClient } from "@/src/lib/supabase-server";
import { requireAdminUser } from "@/src/lib/auth/session";
import { serializePropertyImages } from "@/src/lib/property-images";
import type { Database } from "@/src/types/database";

type PropertyInsert = Database["public"]["Tables"]["properties"]["Insert"];

// ─── GET — fetch all properties ───────────────────────────────────────────────
export async function GET() {
  const user = await requireAdminUser().catch(() => null);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseServiceRoleClient();

  const { data, error } = await supabase
    .from("properties")
    .select("id, title, location, type, price, status, bedrooms, bathrooms, area, image_url, description, video_url, created_at")
    .order("created_at", { ascending: false }); // newest first

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ properties: data });
}

// ─── POST — add a new property ────────────────────────────────────────────────
export async function POST(request: Request) {
  const user = await requireAdminUser().catch(() => null);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { title, location, type, price, bedrooms, bathrooms, area, image_url, image_urls, status } = body;

  if (!title || !location || !type || !price || !bedrooms || !bathrooms || !area) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
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
    image_url: Array.isArray(image_urls) ? serializePropertyImages(image_urls) : image_url || null,
  };

  const { data, error } = await supabase
    .from("properties")
    .insert(newProperty)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ property: data }, { status: 201 });
}
