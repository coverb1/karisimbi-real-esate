import { NextResponse } from "next/server";
import { getSupabaseServiceRoleClient } from "@/src/lib/supabase-server";
import { requireAdminUser } from "@/src/lib/auth/session";
import { serializePropertyImages } from "@/src/lib/property-images";
import type { Database } from "@/src/types/database";

type PropertyInsert = Database["public"]["Tables"]["properties"]["Insert"];

export async function POST(request: Request) {
  const user = await requireAdminUser().catch(() => null);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const {
    title,
    location,
    type,
    price,
    bedrooms,
    bathrooms,
    area,
    area_has_plus,
    image_url,
    image_urls,
    status,
    description,
    video_url,
  } = body;

  // For "Plot of Land", bedrooms and bathrooms are optional (sent as 0 or omitted).
  // For all other types they are required.
  const isPlot = type === "Plot of Land";

  if (!title || !location || !type || !price || !area) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  if (!isPlot && (!bedrooms || !bathrooms)) {
    return NextResponse.json(
      { error: "Bedrooms and bathrooms are required for this property type" },
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
    // Store null for plots so the UI knows not to display them
    bedrooms: isPlot ? null : Number(bedrooms),
    bathrooms: isPlot ? null : Number(bathrooms),
    area: Number(area),
    area_has_plus: Boolean(area_has_plus),
    image_url: Array.isArray(image_urls)
      ? serializePropertyImages(image_urls)
      : image_url || null,
    description: description || null,
    video_url: video_url || null,
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
