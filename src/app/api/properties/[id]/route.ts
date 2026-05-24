// 📁 app/api/properties/[id]/route.ts

import { getSupabaseServiceRoleClient } from "@/src/lib/supabase-server";
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

  const { data, error } = await supabase
    .from("properties")
    .update({
      title: body.title,
      location: body.location,
      type: body.type,
      price: Number(body.price),
      bedrooms: Number(body.bedrooms),
      bathrooms: Number(body.bathrooms),
      area: Number(body.area),
      status: body.status,
      image_url: body.image_url || null,
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