// src/app/api/sell-property/route.ts

import { getSupabaseServiceRoleClient } from "@/src/lib/supabase-server";
import { transporter } from "@/src/lib/mailer";
import {
  sellPropertyEmailHtml,
  sellPropertyEmailText,
  type SellPropertyData,
} from "@/src/lib/email-templates";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = await getSupabaseServiceRoleClient();

    /* ── 1. Save to Supabase ── */
    const { error } = await supabase
      .from("sell_property_submissions")
      .insert({
        full_name: body.fullName,
        phone: body.phone,
        email: body.email,
        address: body.address || null,
        id_number: body.idNumber || null,
        property_type: body.propertyType || null,
        location: body.location || null,
        property_size: body.propertySize || null,
        asking_price: body.askingPrice || null,
        documents_available: body.documentsAvailable || null,
        has_issues: body.hasIssues || null,
        issues_explanation: body.issuesExplanation || null,
      });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    /* ── 2. Send admin email ── */
    const data = body as SellPropertyData;

    await transporter.sendMail({
      from: `"Karisimbi Real Estate" <${process.env.SMTP_FROM_EMAIL}>`,
      to: process.env.SUPABASE_ADMIN_EMAIL,
      subject: `🏠 New Property Listing — ${data.propertyType ?? "Property"} in ${data.location ?? "Kigali"} from ${data.fullName}`,
      text: sellPropertyEmailText(data),
      html: sellPropertyEmailHtml(data),
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}