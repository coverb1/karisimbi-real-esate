"use client";

import { useState, useRef, useCallback, type ChangeEvent, type DragEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// ─── Schema — only fields that exist in the database ─────────────────────────
// title, location, type, price, bedrooms, bathrooms, area, image_url, status

const formSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be under 100 characters"),
  location: z.string().min(2, "Location is required"),
  type: z.string().min(1, "Please select a property type"),
  status: z.enum(["Active", "Featured", "Pending"], {
    errorMap: () => ({ message: "Please select a listing status" }),
  }),
  price: z
    .string()
    .min(1, "Price is required")
    .regex(/^[\d,]+$/, "Price must be digits and commas only")
    .refine((v) => parseInt(v.replace(/,/g, ""), 10) > 0, "Price must be greater than 0"),
  bedrooms: z.string().min(1, "Please select number of bedrooms"),
  bathrooms: z.string().min(1, "Please select number of bathrooms"),
  area: z
    .string()
    .min(1, "Area is required")
    .regex(/^\d+$/, "Area must be a number")
    .refine((v) => parseInt(v) >= 10, "Area must be at least 10 m²"),
});

type FormValues = z.infer<typeof formSchema>;

// ─── Options ──────────────────────────────────────────────────────────────────

const PROPERTY_TYPES = ["Villa", "Family House", "Penthouse", "Apartment", "Mansion", "Townhouse", "Studio", "Commercial"];
const STATUSES = ["Active", "Featured", "Pending"] as const;
const BED_BATH = ["1", "2", "3", "4", "5", "6", "7+"];

type Status = "Active" | "Featured" | "Pending";
const STATUS_STYLES: Record<Status, string> = {
  Featured: "bg-amber-50 text-amber-700 border border-amber-200",
  Active: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Pending: "bg-red-50 text-red-600 border border-red-200",
};

// ─── Shared styles ────────────────────────────────────────────────────────────

const labelCls = "block text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400 mb-1.5";
const inputCls = (err?: string) =>
  `w-full rounded-xl border ${err ? "border-red-400 bg-red-50/30" : "border-input bg-white"} px-3.5 py-2.5 text-sm text-gray-800 placeholder:text-gray-300 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-colors`;
const selectCls = (err?: string) =>
  `w-full rounded-xl border ${err ? "border-red-400 bg-red-50/30" : "border-input bg-white"} px-3.5 py-2.5 text-sm text-gray-700 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-colors appearance-none cursor-pointer`;

// ─── Small components ─────────────────────────────────────────────────────────

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-[11px] font-medium text-red-500">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      {message}
    </p>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {children}
      <FieldError message={error} />
    </div>
  );
}

function SelectWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {children}
      <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
      </span>
    </div>
  );
}

function IconCheck({ color = "white" }: { color?: string }) {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconStar() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

// ─── Step indicator ───────────────────────────────────────────────────────────

const STEPS = ["Property Info", "Rooms & Size", "Photo & Publish"];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center">
      {STEPS.map((label, i) => (
        <div key={i} className="flex items-center">
          <div className="flex flex-col items-center gap-1.5">
            <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${i < current ? "bg-primary text-white" : i === current ? "bg-primary text-white ring-4 ring-primary/20" : "bg-gray-100 text-gray-400"}`}>
              {i < current ? <IconCheck /> : i + 1}
            </div>
            <span className={`hidden text-[10px] font-semibold uppercase tracking-wider sm:block ${i === current ? "text-primary" : "text-gray-400"}`}>{label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`mx-3 mb-4 h-px w-10 sm:w-14 transition-colors ${i < current ? "bg-primary" : "bg-gray-200"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Helper: File → base64 ────────────────────────────────────────────────────

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

// ─── Image dropzone ───────────────────────────────────────────────────────────

function ImageDropzone({
  previews, onAdd, onRemove, onSetPrimary, primaryIdx, imageError,
}: {
  previews: string[]; onAdd: (files: File[]) => void; onRemove: (i: number) => void;
  onSetPrimary: (i: number) => void; primaryIdx: number; imageError?: string;
}) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    onAdd(Array.from(files).filter((f) => f.type.startsWith("image/")));
  }, [onAdd]);

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`group relative flex cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed px-6 py-12 transition-all duration-200 ${
          imageError ? "border-red-300 bg-red-50/30" :
          dragging ? "border-primary bg-primary/5 scale-[1.01]" :
          "border-gray-200 bg-gray-50/60 hover:border-primary/40 hover:bg-primary/[0.02]"
        }`}
      >
        <input ref={inputRef} type="file" accept="image/*" className="hidden"
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleFiles(e.target.files)} />

        <div className="relative flex h-20 w-20 items-center justify-center">
          <div className={`absolute inset-0 rounded-full border-2 border-dashed opacity-60 ${imageError ? "border-red-300" : "border-gray-200"}`} />
          <div className={`absolute inset-3 rounded-full border opacity-40 ${imageError ? "border-red-200" : "border-gray-200"}`} />
          <div className={`flex h-12 w-12 items-center justify-center rounded-full shadow-sm transition-all ${dragging ? "bg-primary text-white scale-110" : imageError ? "bg-red-100 text-red-400" : "bg-white text-gray-400 group-hover:text-primary"}`}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" />
              <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
            </svg>
          </div>
        </div>

        <div className="text-center">
          <p className={`text-sm font-semibold ${imageError ? "text-red-500" : "text-gray-700"}`}>Drop a property photo here</p>
          <p className="mt-1 text-xs text-gray-400">or <span className="text-primary underline underline-offset-2">browse files</span> · PNG, JPG, WEBP up to 10MB</p>
        </div>

        {dragging && (
          <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-primary/10">
            <p className="text-sm font-bold text-primary">Release to upload</p>
          </div>
        )}
      </div>

      {imageError && <FieldError message={imageError} />}

      {previews.length > 0 && (
        <div className="relative aspect-video w-full overflow-hidden rounded-xl border-2 border-primary shadow-md shadow-primary/20">
          <Image src={previews[0]} alt="Property cover photo" fill className="object-cover" />
          <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-primary px-2 py-1">
            <IconStar />
            <span className="text-[9px] font-bold uppercase tracking-wider text-white">Cover Photo</span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(0); }}
            className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AddPropertyPage() {
  const [step, setStep] = useState(0);

  // Only one image needed — matches the single image_url column in the DB
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string[]>([]);

  const [imageError, setImageError] = useState<string | undefined>();
  const [submitError, setSubmitError] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { register, trigger, getValues, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      title: "", location: "", type: "", status: undefined,
      price: "", bedrooms: "", bathrooms: "", area: "",
    },
  });

  // Step 0 — title, location, type, status, price
  const step0Fields: (keyof FormValues)[] = ["title", "location", "type", "status", "price"];
  // Step 1 — bedrooms, bathrooms, area
  const step1Fields: (keyof FormValues)[] = ["bedrooms", "bathrooms", "area"];

  async function handleNext() {
    const fields = step === 0 ? step0Fields : step1Fields;
    const valid = await trigger(fields);
    if (valid) setStep((s) => s + 1);
  }

  async function handleSubmit() {
    if (!imageFile) {
      setImageError("Please upload a cover photo");
      return;
    }
    setImageError(undefined);
    setSubmitError(undefined);
    setSubmitting(true);

    try {
      // Step 1: Convert image to base64 and upload to Cloudinary
      const base64 = await fileToBase64(imageFile);

      const uploadRes = await fetch("/api/uploadToCloudinary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images: [base64] }),
      });

      if (!uploadRes.ok) {
        const err = await uploadRes.json();
        throw new Error(err.message || "Image upload failed");
      }

      const { mainImageUrl } = await uploadRes.json();

      // Step 2: Save to database — only the columns in your DB blueprint
      const values = getValues();

      const saveRes = await fetch("/api/Addproperties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title:     values.title,
          location:  values.location,
          type:      values.type,
          status:    values.status,
          price:     parseInt(values.price.replace(/,/g, ""), 10),
          bedrooms:  parseInt(values.bedrooms, 10),
          bathrooms: parseInt(values.bathrooms, 10),
          area:      parseInt(values.area, 10),
          image_url: mainImageUrl,
        }),
      });

      if (!saveRes.ok) {
        const err = await saveRes.json();
        throw new Error(err.error || "Failed to save property");
      }

      setSubmitted(true);
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  function handleAddImage(files: File[]) {
    if (files.length === 0) return;
    const file = files[0]; // Only one image — matches single image_url column
    if (imagePreview[0]) URL.revokeObjectURL(imagePreview[0]);
    setImageFile(file);
    setImagePreview([URL.createObjectURL(file)]);
    setImageError(undefined);
  }

  function handleRemoveImage() {
    if (imagePreview[0]) URL.revokeObjectURL(imagePreview[0]);
    setImageFile(null);
    setImagePreview([]);
  }

  const values = getValues();

  // Checklist — exactly the DB columns, nothing more
  const checklist = [
    { label: "Property title", done: (values.title?.length ?? 0) >= 5 },
    { label: "Location", done: !!values.location },
    { label: "Property type", done: !!values.type },
    { label: "Listing status", done: !!values.status },
    { label: "Price", done: !!values.price },
    { label: "Bedrooms", done: !!values.bedrooms },
    { label: "Bathrooms", done: !!values.bathrooms },
    { label: "Area (m²)", done: !!values.area },
    { label: "Cover photo", done: !!imageFile },
  ];

  const allDone = checklist.every((c) => c.done);

  // ── Success screen ──
  if (submitted) {
    return (
      <div className="admin-shell flex min-h-screen flex-col items-center justify-center bg-surface px-4 py-16">
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 ring-8 ring-emerald-50/50">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#1a5c2a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><polyline points="9 12 11 14 15 10" />
            </svg>
          </div>
          <div>
            <h2 className="landing-title-compact text-gray-900">Property Listed!</h2>
            <p className="landing-body mt-2 max-w-sm text-gray-500">
              <span className="font-semibold text-gray-800">{values.title || "Your property"}</span> is now live on Karisimbi RE.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/dashboard" className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              Back to Dashboard
            </Link>
            <button
              onClick={() => { reset(); handleRemoveImage(); setStep(0); setSubmitted(false); }}
              className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            >
              Add Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-shell min-h-screen bg-surface">

      {/* Top bar */}
      <div className="sticky top-0 z-10 border-b border-gray-100 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-3">
          <Link href="/admin/dashboard" className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
            Dashboard
          </Link>
          <StepIndicator current={step} />
          <div className="w-20" />
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-5 py-8">
        <div className="mb-8">
          <p className="landing-eyebrow text-primary">Properties · New Listing</p>
          <h1 className="landing-title-compact mt-1 text-gray-900">Add Property</h1>
          <p className="landing-body mt-1 text-gray-500">
            {step === 0 && "Enter the property identity, location and price."}
            {step === 1 && "Enter the number of rooms and total area."}
            {step === 2 && "Upload a cover photo then publish."}
          </p>
        </div>

        {/* ══ STEP 0 — title, location, type, status, price ══ */}
        {step === 0 && (
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-300">Basic Information</p>

              <Field label="Property Title" error={errors.title?.message}>
                <input {...register("title")} placeholder="e.g. Modern Luxury Villa" className={inputCls(errors.title?.message)} />
              </Field>

              <Field label="Location / District" error={errors.location?.message}>
                <input {...register("location")} placeholder="e.g. Kigali" className={inputCls(errors.location?.message)} />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Property Type" error={errors.type?.message}>
                  <SelectWrapper>
                    <select {...register("type")} className={selectCls(errors.type?.message)}>
                      <option value="">Select type</option>
                      {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </SelectWrapper>
                </Field>

                <Field label="Listing Status" error={errors.status?.message}>
                  <SelectWrapper>
                    <select {...register("status")} className={selectCls(errors.status?.message)}>
                      <option value="">Select status</option>
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </SelectWrapper>
                </Field>
              </div>

              <Field label="Price (RWF)" error={errors.price?.message}>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400">RWF</span>
                  <input {...register("price")} placeholder="e.g. 450,000,000" className={`${inputCls(errors.price?.message)} pl-12`} />
                </div>
              </Field>
            </div>

            {/* Live preview */}
            <div className="space-y-4">
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <p className="landing-eyebrow mb-4 text-gray-400">Live Preview</p>
                <div className="overflow-hidden rounded-xl border border-gray-100">
                  <div className="flex h-36 items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#cbcbcb" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-semibold truncate text-gray-900">{values.title || "Property Title"}</p>
                        <p className="mt-0.5 text-xs text-gray-400 truncate">{values.location || "Location"}</p>
                      </div>
                      {values.status && (
                        <span className={`shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${STATUS_STYLES[values.status as Status]}`}>
                          {values.status}
                        </span>
                      )}
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <p className="text-sm font-bold text-primary">{values.price ? `RWF ${values.price}` : "RWF —"}</p>
                      <p className="text-xs text-gray-400">{values.type || "Type"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══ STEP 1 — bedrooms, bathrooms, area ══ */}
        {step === 1 && (
          <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
            <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-300">Rooms & Size</p>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Bedrooms" error={errors.bedrooms?.message}>
                  <SelectWrapper>
                    <select {...register("bedrooms")} className={selectCls(errors.bedrooms?.message)}>
                      <option value="">—</option>
                      {BED_BATH.map((n) => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </SelectWrapper>
                </Field>

                <Field label="Bathrooms" error={errors.bathrooms?.message}>
                  <SelectWrapper>
                    <select {...register("bathrooms")} className={selectCls(errors.bathrooms?.message)}>
                      <option value="">—</option>
                      {BED_BATH.map((n) => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </SelectWrapper>
                </Field>
              </div>

              <Field label="Total Area (m²)" error={errors.area?.message}>
                <input {...register("area")} placeholder="e.g. 420" className={inputCls(errors.area?.message)} />
              </Field>
            </div>

            {/* Spec summary */}
            <div className="h-fit rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <p className="landing-eyebrow mb-4 text-gray-400">Summary</p>
              <div className="space-y-3">
                {[
                  { label: "Bedrooms", val: values.bedrooms, icon: "🛏" },
                  { label: "Bathrooms", val: values.bathrooms, icon: "🚿" },
                  { label: "Area", val: values.area ? `${values.area} m²` : "", icon: "📐" },
                ].map(({ label, val, icon }) => (
                  <div key={label} className={`flex items-center justify-between rounded-xl p-3 transition-colors ${val ? "bg-secondary" : "bg-gray-50"}`}>
                    <div className="flex items-center gap-2">
                      <span>{icon}</span>
                      <span className="text-xs font-medium text-gray-500">{label}</span>
                    </div>
                    <span className={`text-sm font-bold ${val ? "text-gray-800" : "text-gray-300"}`}>{val || "—"}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══ STEP 2 — image_url (one photo) + publish ══ */}
        {step === 2 && (
          <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
            <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-300">Cover Photo</p>
              <p className="text-xs text-gray-400">Upload one photo — it will be the cover image shown on all property cards.</p>
              <ImageDropzone
                previews={imagePreview}
                onAdd={handleAddImage}
                onRemove={handleRemoveImage}
                onSetPrimary={() => {}}
                primaryIdx={0}
                imageError={imageError}
              />
            </div>

            {/* Checklist */}
            <div className="space-y-4">
              <div className="h-fit rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <p className="landing-eyebrow mb-4 text-gray-400">Publish Checklist</p>
                <div className="space-y-2.5">
                  {checklist.map(({ label, done }) => (
                    <div key={label} className="flex items-center gap-2.5">
                      <div className={`flex shrink-0 items-center justify-center rounded-full transition-all ${done ? "bg-emerald-500" : "border-2 border-gray-200"}`} style={{ height: 18, width: 18 }}>
                        {done && <IconCheck />}
                      </div>
                      <span className={`text-xs font-medium ${done ? "text-gray-700" : "text-gray-400"}`}>{label}</span>
                    </div>
                  ))}
                </div>
                <div className={`mt-4 rounded-xl px-3.5 py-3 text-[11px] leading-relaxed ${allDone ? "bg-emerald-50 text-emerald-700" : "bg-gray-50 text-gray-400"}`}>
                  {allDone
                    ? "✅ All good! Ready to publish."
                    : `${checklist.filter((c) => !c.done).length} item${checklist.filter((c) => !c.done).length > 1 ? "s" : ""} still needed.`}
                </div>
              </div>

              {submitError && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                  <p className="text-xs font-semibold text-red-600">⚠️ Error</p>
                  <p className="mt-1 text-xs text-red-500">{submitError}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0 || submitting}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors disabled:pointer-events-none disabled:opacity-30"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
            Back
          </button>

          {step < 2 ? (
            <button onClick={handleNext} className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-opacity">
              Continue →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-opacity disabled:opacity-70"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Publishing…
                </>
              ) : "Publish Property"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}