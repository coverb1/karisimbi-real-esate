"use client";

import { useState, useRef, useCallback, type ChangeEvent, type DragEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// ─── Zod Schemas per step ─────────────────────────────────────────────────────

const step0Schema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be under 100 characters"),
  location: z
    .string()
    .min(2, "Location is required"),
  neighborhood: z
    .string()
    .min(1, "Please select a neighbourhood"),
  type: z
    .string()
    .min(1, "Please select a property type"),
  status: z
    .enum(["Active", "Featured", "Pending"], {
      errorMap: () => ({ message: "Please select a listing status" }),
    }),
  price: z
    .string()
    .min(1, "Price is required")
    .regex(/^[\d,]+$/, "Price must be a valid number (digits and commas only)")
    .refine((v) => parseInt(v.replace(/,/g, ""), 10) > 0, "Price must be greater than 0"),
});

const step1Schema = z.object({
  bedrooms: z.string().min(1, "Please select number of bedrooms"),
  bathrooms: z.string().min(1, "Please select number of bathrooms"),
  area: z
    .string()
    .min(1, "Area is required")
    .regex(/^\d+$/, "Area must be a number in m²")
    .refine((v) => parseInt(v) >= 10, "Area must be at least 10 m²"),
  floors: z.string().min(1, "Please select number of floors"),
  parking: z.string().min(1, "Please select a parking option"),
  furnished: z.string().min(1, "Please select furnished status"),
  description: z
    .string()
    .min(30, "Description must be at least 30 characters")
    .max(1000, "Description must be under 1000 characters"),
});

// Full schema (both steps combined — used for final submit type)
const fullSchema = step0Schema.merge(step1Schema);
type FullFormValues = z.infer<typeof fullSchema>;

// ─── Options ──────────────────────────────────────────────────────────────────

const PROPERTY_TYPES = ["Villa", "Family House", "Penthouse", "Apartment", "Mansion", "Townhouse", "Studio", "Commercial"];
const NEIGHBORHOODS = ["Kigali Heights", "Nyarutarama", "Kimihurura", "Gacuriro", "Kacyiru", "Rebero", "Kigali CBD", "Nyamata", "Remera", "Gisozi"];
const STATUSES = ["Active", "Featured", "Pending"] as const;
const FURNISHED_OPTIONS = ["Fully Furnished", "Semi-Furnished", "Unfurnished"];
const PARKING_OPTIONS = ["1 Car", "2 Cars", "3+ Cars", "No Parking"];
const FLOOR_OPTIONS = ["1", "2", "3", "4", "5+"];
const BED_BATH = ["1", "2", "3", "4", "5", "6", "7+"];

type Status = "Active" | "Featured" | "Pending";

const STATUS_STYLES: Record<Status, string> = {
  Featured: "bg-amber-50 text-amber-700 border border-amber-200",
  Active:   "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Pending:  "bg-red-50 text-red-600 border border-red-200",
};

// ─── Shared classes ───────────────────────────────────────────────────────────

const labelCls = "block text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400 mb-1.5";
const inputCls = (err?: string) =>
  `w-full rounded-xl border ${err ? "border-red-400 bg-red-50/30" : "border-input bg-white"} px-3.5 py-2.5 text-sm text-gray-800 placeholder:text-gray-300 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-colors`;
const selectCls = (err?: string) =>
  `w-full rounded-xl border ${err ? "border-red-400 bg-red-50/30" : "border-input bg-white"} px-3.5 py-2.5 text-sm text-gray-700 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-colors appearance-none cursor-pointer`;

// ─── Error message component ──────────────────────────────────────────────────

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

// ─── Field wrapper ────────────────────────────────────────────────────────────

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {children}
      <FieldError message={error} />
    </div>
  );
}

function SelectWrapper({ error, children }: { error?: string; children: React.ReactNode }) {
  return (
    <div className="relative">
      {children}
      <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
      </span>
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function IconCheck({ color = "white" }: { color?: string }) {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconHome() {
  return (
    <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#cbcbcb" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
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

const STEPS = ["Property Info", "Details & Specs", "Photos & Publish"];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center">
      {STEPS.map((label, i) => (
        <div key={i} className="flex items-center">
          <div className="flex flex-col items-center gap-1.5">
            <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
              i < current ? "bg-primary text-white" :
              i === current ? "bg-primary text-white ring-4 ring-primary/20" :
              "bg-gray-100 text-gray-400"
            }`}>
              {i < current ? <IconCheck /> : i + 1}
            </div>
            <span className={`hidden text-[10px] font-semibold uppercase tracking-wider sm:block ${i === current ? "text-primary" : "text-gray-400"}`}>
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`mx-3 mb-4 h-px w-10 sm:w-14 transition-colors ${i < current ? "bg-primary" : "bg-gray-200"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Image dropzone ───────────────────────────────────────────────────────────

function ImageDropzone({
  images, onAdd, onRemove, onSetPrimary, primaryIdx, imageError,
}: {
  images: string[]; onAdd: (files: File[]) => void; onRemove: (i: number) => void;
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
        <input ref={inputRef} type="file" multiple accept="image/*" className="hidden"
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleFiles(e.target.files)} />

        <div className="relative flex h-20 w-20 items-center justify-center">
          <div className={`absolute inset-0 rounded-full border-2 border-dashed opacity-60 transition-colors ${imageError ? "border-red-300" : "border-gray-200 group-hover:border-primary/30"}`} />
          <div className={`absolute inset-3 rounded-full border opacity-40 transition-colors ${imageError ? "border-red-200" : "border-gray-200 group-hover:border-primary/20"}`} />
          <div className={`flex h-12 w-12 items-center justify-center rounded-full shadow-sm transition-all ${
            dragging ? "bg-primary text-white scale-110" :
            imageError ? "bg-red-100 text-red-400" :
            "bg-white text-gray-400 group-hover:text-primary group-hover:shadow-md"
          }`}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" />
              <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
            </svg>
          </div>
        </div>

        <div className="text-center">
          <p className={`text-sm font-semibold ${imageError ? "text-red-500" : "text-gray-700"}`}>
            Drop property photos here
          </p>
          <p className="mt-1 text-xs text-gray-400">
            or <span className="text-primary underline underline-offset-2">browse files</span> · PNG, JPG, WEBP up to 10MB
          </p>
        </div>

        {dragging && (
          <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-primary/10">
            <p className="text-sm font-bold text-primary">Release to upload</p>
          </div>
        )}
      </div>

      {imageError && <FieldError message={imageError} />}

      {images.length > 0 && (
        <>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {images.map((src, i) => (
              <div
                key={i}
                onClick={() => onSetPrimary(i)}
                className={`group relative aspect-[4/3] overflow-hidden rounded-xl border-2 cursor-pointer transition-all ${
                  i === primaryIdx ? "border-primary shadow-md shadow-primary/20" : "border-transparent hover:border-gray-300"
                }`}
              >
                <Image src={src} alt={`Property photo ${i + 1}`} fill className="object-cover" />
                {i === primaryIdx && (
                  <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 rounded-full bg-primary px-1.5 py-0.5">
                    <IconStar />
                    <span className="text-[9px] font-bold uppercase tracking-wider text-white">Main</span>
                  </div>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); onRemove(i); }}
                  className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/80"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
                {i !== primaryIdx && (
                  <div className="absolute inset-0 flex items-end justify-center bg-black/0 pb-2 text-transparent transition-all group-hover:bg-black/20 group-hover:text-white">
                    <span className="text-[10px] font-semibold">Set as main</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="text-[11px] text-gray-400">
            {images.length} photo{images.length !== 1 ? "s" : ""} · Click to set main cover image
          </p>
        </>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AddPropertyPage() {
  const [step, setStep] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const [primaryIdx, setPrimaryIdx] = useState(0);
  const [imageError, setImageError] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Single form instance for all fields across steps
  const {
    register,
    control,
    trigger,
    getValues,
    reset,
    formState: { errors },
  } = useForm<FullFormValues>({
    resolver: zodResolver(fullSchema),
    mode: "onChange",
    defaultValues: {
      title: "", location: "", neighborhood: "", type: "",
      status: undefined, price: "", bedrooms: "", bathrooms: "",
      area: "", floors: "", parking: "", furnished: "", description: "",
    },
  });

  // Step 0 fields
  const step0Fields: (keyof FullFormValues)[] = ["title", "location", "neighborhood", "type", "status", "price"];
  // Step 1 fields
  const step1Fields: (keyof FullFormValues)[] = ["bedrooms", "bathrooms", "area", "floors", "parking", "furnished", "description"];

  async function handleNext() {
    const fields = step === 0 ? step0Fields : step1Fields;
    const valid = await trigger(fields);
    if (valid) setStep((s) => s + 1);
  }

  async function handleSubmit() {
    // Validate photos
    if (images.length === 0) {
      setImageError("Please upload at least one property photo");
      return;
    }
    setImageError(undefined);
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1800));
    setSubmitting(false);
    setSubmitted(true);
  }

  function handleAddImages(files: File[]) {
    setImages((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
    setImageError(undefined);
  }

  function handleRemoveImage(i: number) {
    setImages((prev) => prev.filter((_, idx) => idx !== i));
    if (primaryIdx >= i && primaryIdx > 0) setPrimaryIdx((p) => p - 1);
  }

  const values = getValues();

  // Publish checklist (combines form state + images)
  const checklist = [
    { label: "Property title (min 5 chars)", done: (values.title?.length ?? 0) >= 5 },
    { label: "Location & neighbourhood", done: !!(values.location && values.neighborhood) },
    { label: "Property type & status", done: !!(values.type && values.status) },
    { label: "Price set", done: !!values.price },
    { label: "Bedrooms & bathrooms", done: !!(values.bedrooms && values.bathrooms) },
    { label: "Area (m²)", done: !!values.area },
    { label: "Description (min 30 chars)", done: (values.description?.length ?? 0) >= 30 },
    { label: "At least 1 photo", done: images.length > 0 },
  ];

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
              <span className="font-semibold text-gray-800">{values.title || "Your property"}</span> has been successfully published and is now live on Karisimbi RE.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/dashboard" className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              Back to Dashboard
            </Link>
            <button
              onClick={() => { reset(); setImages([]); setStep(0); setSubmitted(false); }}
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

      {/* ── Sticky top bar ── */}
      <div className="sticky top-0 z-10 border-b border-gray-100 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
          <Link href="/admin/dashboard" className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
            <IconChevronLeft /> Dashboard
          </Link>
          <StepIndicator current={step} />
          <div className="w-20" />
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-5 py-8">

        {/* Page heading */}
        <div className="mb-8">
          <p className="landing-eyebrow text-primary">Properties · New Listing</p>
          <h1 className="landing-title-compact mt-1 text-gray-900">Add Property</h1>
          <p className="landing-body mt-1 text-gray-500">
            {step === 0 && "Start with the property's identity, location and pricing."}
            {step === 1 && "Provide size, rooms and additional property details."}
            {step === 2 && "Upload photos then publish the listing."}
          </p>
        </div>

        {/* ══ STEP 0 — Property Info ══ */}
        {step === 0 && (
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-300">Basic Information</p>

              <Field label="Property Title" error={errors.title?.message}>
                <input
                  {...register("title")}
                  placeholder="e.g. Modern Luxury Villa"
                  className={inputCls(errors.title?.message)}
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Location / District" error={errors.location?.message}>
                  <input
                    {...register("location")}
                    placeholder="e.g. Kigali"
                    className={inputCls(errors.location?.message)}
                  />
                </Field>

                <Field label="Neighbourhood" error={errors.neighborhood?.message}>
                  <SelectWrapper error={errors.neighborhood?.message}>
                    <select {...register("neighborhood")} className={selectCls(errors.neighborhood?.message)}>
                      <option value="">Select neighbourhood</option>
                      {NEIGHBORHOODS.map((n) => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </SelectWrapper>
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Property Type" error={errors.type?.message}>
                  <SelectWrapper error={errors.type?.message}>
                    <select {...register("type")} className={selectCls(errors.type?.message)}>
                      <option value="">Select type</option>
                      {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </SelectWrapper>
                </Field>

                <Field label="Listing Status" error={errors.status?.message}>
                  <SelectWrapper error={errors.status?.message}>
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
                  <input
                    {...register("price")}
                    placeholder="e.g. 450,000,000"
                    className={`${inputCls(errors.price?.message)} pl-12`}
                  />
                </div>
              </Field>
            </div>

            {/* Live preview */}
            <div className="space-y-4">
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <p className="landing-eyebrow mb-4 text-gray-400">Live Preview</p>
                <div className="overflow-hidden rounded-xl border border-gray-100">
                  <div className="flex h-40 items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                    <IconHome />
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="landing-card-title truncate text-gray-900">{values.title || "Property Title"}</p>
                        <p className="mt-0.5 text-xs text-gray-400 truncate">
                          {[values.neighborhood, values.location].filter(Boolean).join(", ") || "Location, Neighbourhood"}
                        </p>
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

              <div className="rounded-2xl border border-primary/10 bg-primary/[0.03] p-5">
                <p className="landing-eyebrow mb-3 text-primary">Tips</p>
                <ul className="space-y-2 text-xs leading-relaxed text-gray-500">
                  <li className="flex gap-2"><span className="font-bold text-primary">·</span> Use a descriptive title that highlights the key selling point</li>
                  <li className="flex gap-2"><span className="font-bold text-primary">·</span> "Featured" status boosts visibility on the homepage</li>
                  <li className="flex gap-2"><span className="font-bold text-primary">·</span> Enter price in full without currency prefix — digits and commas only</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ══ STEP 1 — Details & Specs ══ */}
        {step === 1 && (
          <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
            <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-300">Property Specifications</p>

              <div className="grid grid-cols-3 gap-4">
                <Field label="Bedrooms" error={errors.bedrooms?.message}>
                  <SelectWrapper error={errors.bedrooms?.message}>
                    <select {...register("bedrooms")} className={selectCls(errors.bedrooms?.message)}>
                      <option value="">—</option>
                      {BED_BATH.map((n) => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </SelectWrapper>
                </Field>

                <Field label="Bathrooms" error={errors.bathrooms?.message}>
                  <SelectWrapper error={errors.bathrooms?.message}>
                    <select {...register("bathrooms")} className={selectCls(errors.bathrooms?.message)}>
                      <option value="">—</option>
                      {BED_BATH.map((n) => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </SelectWrapper>
                </Field>

                <Field label="Floors" error={errors.floors?.message}>
                  <SelectWrapper error={errors.floors?.message}>
                    <select {...register("floors")} className={selectCls(errors.floors?.message)}>
                      <option value="">—</option>
                      {FLOOR_OPTIONS.map((n) => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </SelectWrapper>
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Total Area (m²)" error={errors.area?.message}>
                  <input
                    {...register("area")}
                    placeholder="e.g. 420"
                    className={inputCls(errors.area?.message)}
                  />
                </Field>

                <Field label="Parking" error={errors.parking?.message}>
                  <SelectWrapper error={errors.parking?.message}>
                    <select {...register("parking")} className={selectCls(errors.parking?.message)}>
                      <option value="">Select parking</option>
                      {PARKING_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </SelectWrapper>
                </Field>
              </div>

              <Field label="Furnished" error={errors.furnished?.message}>
                <SelectWrapper error={errors.furnished?.message}>
                  <select {...register("furnished")} className={selectCls(errors.furnished?.message)}>
                    <option value="">Select furnished status</option>
                    {FURNISHED_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
                  </select>
                </SelectWrapper>
              </Field>

              <Field label={`Description (${values.description?.length ?? 0}/1000)`} error={errors.description?.message}>
                <textarea
                  {...register("description")}
                  placeholder="Highlight standout features, views, amenities, recent renovations..."
                  rows={5}
                  className={`${inputCls(errors.description?.message)} resize-none`}
                />
                {/* Character hint */}
                {!errors.description && (values.description?.length ?? 0) < 30 && (
                  <p className="mt-1.5 text-[11px] text-gray-400">
                    {30 - (values.description?.length ?? 0)} more character{30 - (values.description?.length ?? 0) !== 1 ? "s" : ""} needed
                  </p>
                )}
              </Field>
            </div>

            {/* Spec summary */}
            <div className="h-fit rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <p className="landing-eyebrow mb-4 text-gray-400">Spec Summary</p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {[
                  { label: "Beds", val: values.bedrooms, icon: "🛏" },
                  { label: "Baths", val: values.bathrooms, icon: "🚿" },
                  { label: "Area", val: values.area ? `${values.area} m²` : "", icon: "📐" },
                  { label: "Parking", val: values.parking, icon: "🚗" },
                ].map(({ label, val, icon }) => (
                  <div key={label} className={`rounded-xl p-3 text-center transition-colors ${val ? "bg-secondary" : "bg-gray-50"}`}>
                    <p className="text-base">{icon}</p>
                    <p className={`mt-0.5 text-sm font-bold ${val ? "text-gray-800" : "text-gray-300"}`}>{val || "—"}</p>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">{label}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {[
                  { label: "Floors", val: values.floors },
                  { label: "Furnished", val: values.furnished },
                ].map(({ label, val }) => (
                  <div key={label} className="flex items-center justify-between border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                    <span className="text-xs font-medium text-gray-400">{label}</span>
                    <span className={`text-xs font-semibold ${val ? "text-gray-800" : "text-gray-200"}`}>{val || "—"}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══ STEP 2 — Photos & Publish ══ */}
        {step === 2 && (
          <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
            <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-300">Property Photos</p>
              <ImageDropzone
                images={images}
                onAdd={handleAddImages}
                onRemove={handleRemoveImage}
                onSetPrimary={setPrimaryIdx}
                primaryIdx={primaryIdx}
                imageError={imageError}
              />
            </div>

            <div className="space-y-4">
              <div className="h-fit rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <p className="landing-eyebrow mb-4 text-gray-400">Publish Checklist</p>
                <div className="space-y-2.5">
                  {checklist.map(({ label, done }) => (
                    <div key={label} className="flex items-center gap-2.5">
                      <div
                        className={`flex shrink-0 items-center justify-center rounded-full transition-all ${done ? "bg-emerald-500" : "border-2 border-gray-200"}`}
                        style={{ height: 18, width: 18 }}
                      >
                        {done && <IconCheck />}
                      </div>
                      <span className={`text-xs font-medium transition-colors ${done ? "text-gray-700" : "text-gray-400"}`}>{label}</span>
                    </div>
                  ))}
                </div>

                <div className={`mt-4 rounded-xl px-3.5 py-3 text-[11px] leading-relaxed transition-colors ${
                  checklist.every((c) => c.done)
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-gray-50 text-gray-400"
                }`}>
                  {checklist.every((c) => c.done)
                    ? "✅ All good! Your listing is ready to publish."
                    : `${checklist.filter((c) => !c.done).length} item${checklist.filter((c) => !c.done).length > 1 ? "s" : ""} still needed.`}
                </div>
              </div>

              <div className="rounded-2xl border border-primary/10 bg-primary/[0.03] p-4">
                <p className="text-xs text-gray-500 leading-relaxed">
                  Once published, this property will appear immediately on the public listings page and the admin dashboard.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Navigation ── */}
        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors disabled:pointer-events-none disabled:opacity-30"
          >
            <IconChevronLeft /> Back
          </button>

          {step < 2 ? (
            <button
              onClick={handleNext}
              className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-opacity"
            >
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