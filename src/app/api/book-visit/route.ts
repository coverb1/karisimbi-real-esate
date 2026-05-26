// src/app/api/book-visit/route.ts

import { getSupabaseServiceRoleClient } from "@/src/lib/supabase-server";
import { transporter } from "@/src/lib/mailer";
import {
  bookVisitEmailHtml,
  bookVisitEmailText,
  type BookVisitData,
} from "@/src/lib/email-templates";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = await getSupabaseServiceRoleClient();

    /* ── 1. Save to Supabase ── */
    const { error } = await supabase
      .from("property_visit_submissions")
      .insert({
        full_name: body.fullName,
        phone: body.phone,
        email: body.email || null,
        address: body.address || null,
        id_number: body.idNumber || null,
        property_type: body.propertyType || null,
        property_location: body.propertyLocation || null,
        property_price: body.propertyPrice || null,
        visit_date: body.visitDate || null,
        visit_time: body.visitTime || null,
        transportation: body.transportation || null,
      });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    /* ── 2. Send admin email ── */
    const data = body as BookVisitData;

    await transporter.sendMail({
      from: `"Karisimbi Real Estate" <${process.env.SMTP_FROM_EMAIL}>`,
      to: process.env.SUPABASE_ADMIN_EMAIL,
      subject: `📅 New Viewing Request — ${data.propertyType ?? "Property"} in ${data.propertyLocation ?? "Kigali"} from ${data.fullName}`,
      text: bookVisitEmailText(data),
      html: bookVisitEmailHtml(data),
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