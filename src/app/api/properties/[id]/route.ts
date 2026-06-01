// 📁 app/api/properties/[id]/route.ts

import { getSupabaseServiceRoleClient } from "@/src/lib/supabase-server";
import { serializePropertyImages } from "@/src/lib/property-images";
import { parseAreaInput } from "@/src/lib/property-area";
import { NextRequest, NextResponse } from "next/server";

// ── DELETE ────────────────────────────────────────────────────────────────────
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // ← params is a Promise in Next.js 15
) {
  const { id } = await params;  // ← must await it

  if (!id || id === "undefined") {
    return NextResponse.json({ error: "Missing property ID" }, { status: 400 });
  }

  const supabase = getSupabaseServiceRoleClient();

  const { error } = await supabase
    .from("properties")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

// ── PATCH ─────────────────────────────────────────────────────────────────────
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // ← same here
) {
  const { id } = await params;  // ← must await it

  if (!id || id === "undefined") {
    return NextResponse.json({ error: "Missing property ID" }, { status: 400 });
  }

  const supabase = getSupabaseServiceRoleClient();
  const body = await req.json();
  const imageUrl = Array.isArray(body.image_urls)
    ? serializePropertyImages(body.image_urls)
    : body.image_url || null;
  const parsedArea = parseAreaInput(body.area);

  const { data, error } = await supabase
    .from("properties")
    .update({
      title: body.title,
      location: body.location,
      type: body.type,
      price: Number(body.price),
      bedrooms: Number(body.bedrooms),
      bathrooms: Number(body.bathrooms),
      area: parsedArea.area,
      area_has_plus: parsedArea.area_has_plus,
      status: body.status,
      description: body.description || null,
      image_url: imageUrl,
      video_url: body.video_url || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ property: data });
}

//API for patch and edit
