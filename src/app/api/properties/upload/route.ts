import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { requireAdminUser } from "@/src/lib/auth/session";

cloudinary.config({
  cloud_name: process.env.NEXT_CLOUD_NAME,
  api_key:    process.env.NEXT_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_CLOUDINARY_SECRET,
});

export async function POST(request: Request) {
  try {
    const user = await requireAdminUser().catch(() => null);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: "Image must be 5MB or smaller" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "longtai",
    });

    return NextResponse.json({ success: true, url: result.secure_url });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Upload failed";
    console.error("Cloudinary upload error:", error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
//This route is used to upload images to Cloudinary.