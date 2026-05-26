"use client";

import React, { useState } from "react";
import { z } from "zod";
import { toast } from "react-toastify";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Home,
  AlertCircle,
  CheckCircle,
  Send,
} from "lucide-react";

interface FormState {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  idNumber: string;
  propertyType: string;
  location: string;
  propertySize: string;
  askingPrice: string;
  documentsAvailable: string;
  hasIssues: string;
  issuesExplanation: string;
}

/* ─── VALIDATION SCHEMA ─── */
const formSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Name must contain only letters"),

  phone: z
    .string()
    .min(8, "Phone number is too short")
    .max(20, "Phone number is too long")
    .regex(
      /^\+?[0-9\s]+$/,
      "Phone must contain only digits (and optional leading +)"
    ),

  email: z.string().email("Please enter a valid email address"),

  address: z
    .string()
    .min(5, "Address must be at least 5 characters"),

  idNumber: z
    .string()
    .min(3, "ID / Passport number is required")
    .regex(
      /^[0-9A-Za-z\s-]+$/,
      "ID must contain only letters, numbers, spaces or dashes"
    ),

  propertyType: z.string().min(1, "Please select a property type"),

  location: z.string().min(2, "Property location is required"),

  propertySize: z
    .string()
    .min(1, "Property size is required")
    .regex(
      /^[0-9]+(\.[0-9]+)?\s*(m²|sqft|m2)?$/,
      "Enter a valid size (e.g. 500 or 500 m²)"
    ),

  askingPrice: z
    .string()
    .min(1, "Asking price is required")
    .regex(/^[0-9,]+$/, "Price must contain only numbers"),

  documentsAvailable: z
    .string()
    .min(1, "Please select document status"),

  hasIssues: z
    .string()
    .min(1, "Please indicate if the property has issues"),

  issuesExplanation: z.string().optional(),
});

const defaultForm: FormState = {
  fullName: "",
  phone: "",
  email: "",
  address: "",
  idNumber: "",
  propertyType: "",
  location: "",
  propertySize: "",
  askingPrice: "",
  documentsAvailable: "",
  hasIssues: "",
  issuesExplanation: "",
};

/* ─── HELPERS ─── */

function sanitizePhone(value: string): string {
  return value.replace(/[^0-9+\s]/g, "").replace(/(?!^)\+/g, "");
}

function sanitizePrice(value: string): string {
  return value.replace(/[^0-9,]/g, "");
}

function blockNonDigitKeys(e: React.KeyboardEvent<HTMLInputElement>) {
  const allowed = [
    "Backspace",
    "Delete",
    "Tab",
    "ArrowLeft",
    "ArrowRight",
    "Home",
    "End",
    " ",
  ];

  if (allowed.includes(e.key)) return;

  if (e.key === "+" && (e.currentTarget.selectionStart ?? 0) === 0) return;

  if (!/^[0-9]$/.test(e.key)) e.preventDefault();
}

function blockNonPriceKeys(e: React.KeyboardEvent<HTMLInputElement>) {
  const allowed = [
    "Backspace",
    "Delete",
    "Tab",
    "ArrowLeft",
    "ArrowRight",
    "Home",
    "End",
    ",",
  ];

  if (allowed.includes(e.key)) return;

  if (!/^[0-9]$/.test(e.key)) e.preventDefault();
}

function blockNonSizeKeys(e: React.KeyboardEvent<HTMLInputElement>) {
  const allowed = [
    "Backspace",
    "Delete",
    "Tab",
    "ArrowLeft",
    "ArrowRight",
    "Home",
    "End",
    " ",
    ".",
    "²",
  ];

  if (allowed.includes(e.key)) return;

  if (/^[0-9a-zA-Z²]$/.test(e.key)) return;

  e.preventDefault();
}

/* ─── COMPONENTS ─── */

function Label({
  text,
  required,
}: {
  text: string;
  required?: boolean;
}) {
  return (
    <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400">
      {text}
      {required && <span className="ml-1 text-primary">*</span>}
    </label>
  );
}

function InputField({
  icon: Icon,
  label,
  required,
  ...props
}: {
  icon: React.ElementType;
  label: string;
  required?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <Label text={label} required={required} />

      <div className="relative">
        <Icon
          size={15}
          strokeWidth={1.8}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"
        />

        <input
          {...props}
          className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4
                     text-[14px] text-gray-800 outline-none placeholder:text-gray-300
                     transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10"
        />
      </div>
    </div>
  );
}

function RadioCard({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={[
        "flex flex-1 items-center gap-3 rounded-xl border px-4 py-3 min-w-[120px]",
        "text-[13px] font-medium transition-all duration-200 cursor-pointer",
        checked
          ? "border-primary bg-primary/5 text-primary"
          : "border-gray-200 bg-white text-gray-500 hover:border-gray-300",
      ].join(" ")}
    >
      <div
        className={[
          "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-all",
          checked ? "border-primary" : "border-gray-300",
        ].join(" ")}
      >
        {checked && (
          <div className="h-[7px] w-[7px] rounded-full bg-primary" />
        )}
      </div>

      {label}
    </button>
  );
}

function SectionHeader({
  icon: Icon,
  title,
}: {
  icon: React.ElementType;
  title: string;
}) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
        <Icon size={14} strokeWidth={2} className="text-white" />
      </div>

      <h4 className="font-heading text-[20px] font-bold text-gray-900">
        {title}
      </h4>
    </div>
  );
}

function SuccessState({
  name,
  onReset,
}: {
  name: string;
  onReset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-8 py-20 text-center">
      <div className="mb-7 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <CheckCircle size={32} strokeWidth={1.5} className="text-primary" />
      </div>

      <h2 className="font-heading mb-4 text-[36px] font-bold text-gray-900">
        Registration Received!
      </h2>

      <p className="mb-8 max-w-[400px] text-[15px] leading-relaxed text-gray-500">
        Thank you,{" "}
        <strong className="text-gray-900">
          {name || "valued client"}
        </strong>
        . Our team will review your property and be in touch within 24 hours.
      </p>

      <button
        onClick={onReset}
        className="inline-flex items-center gap-2.5 rounded-full bg-primary px-7 py-3.5
                   text-[13px] font-semibold text-white border-0 cursor-pointer
                   transition-all duration-200 hover:bg-primary/90 hover:-translate-y-px"
      >
        Submit Another Registration
      </button>
    </div>
  );
}

export function SellPropertyForm() {
  const [form, setForm] = useState<FormState>(defaultForm);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const setPhone = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, phone: sanitizePhone(e.target.value) }));

  const setPrice = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({
      ...f,
      askingPrice: sanitizePrice(e.target.value),
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    const result = formSchema.safeParse(form);

    if (!result.success) {
      const firstError = result.error.errors[0]?.message;

      setError(firstError || "Please fill all required fields correctly.");

      toast.error(firstError || "Validation failed");

      setLoading(false);
      return;
    }

    if (form.hasIssues === "yes" && !form.issuesExplanation?.trim()) {
      setError("Please describe the property issues.");

      toast.error("Please describe the property issues.");

      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/sell-property", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const json = await res.json();

      if (!json.success) {
        setError(json.message || "Something went wrong. Please try again.");

        toast.error(json.message || "Something went wrong.");

        setLoading(false);
        return;
      }

      toast.success("Form submitted successfully!");

      setSubmitted(true);
    } catch {
      setError("Network error. Please check your connection.");

      toast.error("Network error. Please check your connection.");
    }

    setLoading(false);
  };

  if (submitted) {
    return (
      <SuccessState
        name={form.fullName}
        onReset={() => {
          setForm(defaultForm);
          setSubmitted(false);
        }}
      />
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-8 py-14 lg:px-12 lg:py-16">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_300px] lg:items-start">
        <form onSubmit={handleSubmit} className="flex flex-col gap-0">
          <div className="mb-10">
            <h3 className="font-heading font-black uppercase tracking-wide text-primary">
              Official Form
            </h3>

            <p className="mt-1 text-gray-500">List Your Property</p>
          </div>

          {/* Section 1 */}
          <div className="mb-8">
            <SectionHeader icon={User} title="Owner Information" />

            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InputField
                  icon={User}
                  label="Full Name"
                  required
                  placeholder="Jean Paul Nkurunziza"
                  value={form.fullName}
                  onChange={set("fullName")}
                />

                <InputField
                  icon={Phone}
                  label="Phone Number"
                  required
                  placeholder="+250 787 861 400"
                  value={form.phone}
                  onChange={setPhone}
                  onKeyDown={blockNonDigitKeys}
                  type="tel"
                  inputMode="numeric"
                  maxLength={20}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InputField
                  icon={Mail}
                  label="Email Address"
                  required
                  placeholder="jean@example.com"
                  value={form.email}
                  onChange={set("email")}
                  type="email"
                />

                <InputField
                  icon={User}
                  label="ID / Passport No"
                  required
                  placeholder="1 1990 8 0012345 1 23"
                  value={form.idNumber}
                  onChange={set("idNumber")}
                />
              </div>

              <InputField
                icon={MapPin}
                label="Residential Address"
                required
                placeholder="KG 15 Ave, Kigali"
                value={form.address}
                onChange={set("address")}
              />
            </div>
          </div>

          <div className="mb-8 h-px bg-gray-100" />

          {/* Section 2 */}
          <div className="mb-8">
            <SectionHeader icon={Home} title="Property Details" />

            <div className="flex flex-col gap-4">
              <div>
                <Label text="Type of Property" required />

                <div className="flex gap-3 flex-wrap">
                  {["House", "Land"].map((t) => (
                    <RadioCard
                      key={t}
                      label={t}
                      checked={form.propertyType === t}
                      onChange={() =>
                        setForm((f) => ({
                          ...f,
                          propertyType: t,
                        }))
                      }
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InputField
                  icon={MapPin}
                  label="Property Location"
                  required
                  placeholder="Nyarutarama, Kigali"
                  value={form.location}
                  onChange={set("location")}
                />

                <InputField
                  icon={Home}
                  label="Property Size (m²/sqft)"
                  required
                  placeholder="e.g. 500 m²"
                  value={form.propertySize}
                  onChange={set("propertySize")}
                  onKeyDown={blockNonSizeKeys}
                />
              </div>

              <InputField
                icon={Home}
                label="Asking Price (RWF)"
                required
                placeholder="e.g. 320,000,000"
                value={form.askingPrice}
                onChange={setPrice}
                onKeyDown={blockNonPriceKeys}
                inputMode="numeric"
              />

              <div>
                <Label
                  text="Are all required documents available?"
                  required
                />

                <div className="flex gap-3 flex-wrap">
                  {[
                    { value: "yes", label: "Yes — All Ready" },
                    { value: "no", label: "No — Some Missing" },
                  ].map((o) => (
                    <RadioCard
                      key={o.value}
                      label={o.label}
                      checked={form.documentsAvailable === o.value}
                      onChange={() =>
                        setForm((f) => ({
                          ...f,
                          documentsAvailable: o.value,
                        }))
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8 h-px bg-gray-100" />

          {/* Section 3 */}
          <div className="mb-10">
            <SectionHeader
              icon={AlertCircle}
              title="Additional Information"
            />

            <div className="flex flex-col gap-4">
              <div>
                <Label
                  text="Does the property have any issues?"
                  required
                />

                <div className="flex gap-3 flex-wrap">
                  {[
                    { value: "yes", label: "Yes" },
                    { value: "no", label: "No" },
                  ].map((o) => (
                    <RadioCard
                      key={o.value}
                      label={o.label}
                      checked={form.hasIssues === o.value}
                      onChange={() =>
                        setForm((f) => ({
                          ...f,
                          hasIssues: o.value,
                        }))
                      }
                    />
                  ))}
                </div>
              </div>

              {form.hasIssues === "yes" && (
                <div>
                  <Label text="Please explain" required />

                  <textarea
                    rows={4}
                    value={form.issuesExplanation}
                    onChange={set("issuesExplanation")}
                    placeholder="Describe any structural, legal, or other issues..."
                    className="w-full resize-y rounded-xl border border-gray-200 bg-white px-4 py-3
                               text-[14px] leading-relaxed text-gray-800 outline-none placeholder:text-gray-300
                               transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>
              )}
            </div>
          </div>

          {error && (
            <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 border border-red-100">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2.5 rounded-full bg-primary py-4
                       text-[14px] font-semibold text-white border-0 cursor-pointer
                       shadow-[0_4px_20px_rgba(122,34,64,0.25)]
                       transition-all duration-200 hover:bg-primary/90 hover:-translate-y-px
                       disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Send size={16} strokeWidth={2} />

            {loading ? "Submitting..." : "Submit Registration"}
          </button>
        </form>

        {/* Sidebar */}
        <aside className="flex flex-col gap-5 lg:sticky lg:top-28">
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
            <h4 className="font-heading mb-5 text-[20px] font-bold text-gray-900">
              What to Expect
            </h4>

            <div className="flex flex-col gap-4">
              {[
                { step: "01", text: "Submit your registration form" },
                {
                  step: "02",
                  text: "Our team reviews your property within 24 hrs",
                },
                {
                  step: "03",
                  text: "We contact you to verify documents",
                },
                {
                  step: "04",
                  text: "Your property goes live on our listings",
                },
              ].map(({ step, text }) => (
                <div key={step} className="flex items-start gap-3.5">
                  <span className="font-heading w-8 shrink-0 text-[26px] font-bold leading-none text-gray-200">
                    {step}
                  </span>

                  <p className="m-0 pt-1 text-[13px] leading-relaxed text-gray-500">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-primary p-6">
            <h4 className="font-heading mb-2 text-[20px] font-bold text-white">
              Need Help?
            </h4>

            <p className="mb-5 text-[13px] leading-relaxed text-white/65">
              Call us directly with any questions about listing your property.
            </p>

            <a
              href="tel:+250788123456"
              className="mb-3 flex items-center gap-2.5 text-[13px] font-semibold text-white no-underline hover:text-white/80 transition-colors"
            >
              <Phone size={14} strokeWidth={2} /> +250 787 861 400
            </a>

            <a
              href="mailto:info@karisimbirealestate.com"
              className="flex items-center gap-2.5 text-[12.5px] text-white/60 no-underline hover:text-white/80 transition-colors"
            >
              <Mail size={14} strokeWidth={2} /> info@karisimbirealestate.com
            </a>
          </div>
        </aside>
      </div>
    </section>
  );
}