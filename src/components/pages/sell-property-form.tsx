"use client";

import { useState } from "react";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Home,
  FileText,
  Upload,
  AlertCircle,
  CheckCircle,
  Send,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

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
  documentTypes: string;
  propertyFile: File | null;
  propertyFileName: string;
  hasIssues: string;
  issuesExplanation: string;
}

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
  documentTypes: "",
  propertyFile: null,
  propertyFileName: "",
  hasIssues: "",
  issuesExplanation: "",
};

// ─── Reusable Field Components ───────────────────────────────────────────────

function Label({ text, required }: { text: string; required?: boolean }) {
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
        {checked && <div className="h-[7px] w-[7px] rounded-full bg-primary" />}
      </div>
      {label}
    </button>
  );
}

function FileUpload({
  label,
  required,
  fileName,
  onChange,
}: {
  label: string;
  required?: boolean;
  fileName: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <Label text={label} required={required} />
      <label
        className={[
          "flex cursor-pointer items-center gap-3 rounded-xl border-[1.5px] border-dashed px-4 py-3.5 transition-all duration-200",
          fileName
            ? "border-primary bg-primary/5"
            : "border-gray-200 bg-gray-50 hover:border-gray-300",
        ].join(" ")}
      >
        <Upload
          size={15}
          strokeWidth={1.8}
          className={fileName ? "text-primary" : "text-gray-300"}
        />
        <span
          className={`text-[13px] ${fileName ? "text-primary" : "text-gray-400"}`}
        >
          {fileName || "Click to upload (PDF, JPG, PNG)"}
        </span>
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
          onChange={onChange}
        />
      </label>
    </div>
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

// ─── Success State ────────────────────────────────────────────────────────────

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
        <strong className="text-gray-900">{name || "valued client"}</strong>.
        Our team will review your property and be in touch within 24 hours.
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

// ─── Main Form ────────────────────────────────────────────────────────────────

export function SellPropertyForm() {
  const [form, setForm] = useState<FormState>(defaultForm);
  const [submitted, setSubmitted] = useState(false);

  const set =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file)
      setForm((f) => ({
        ...f,
        propertyFile: file,
        propertyFileName: file.name,
      }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted)
    return (
      <SuccessState name={form.fullName} onReset={() => setSubmitted(false)} />
    );

  return (
    <section className="mx-auto max-w-7xl px-8 py-14 lg:px-12 lg:py-16">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_300px] lg:items-start">
        {/* ── FORM ── */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-0">
          {/* Form header */}
          <div className="mb-10 flex items-start justify-between">
            <div className="mb-8">
            <h3 className="font-heading  font-black uppercase tracking-wide text-primary">
              Official Form
            </h3>
            <p className="mt-1 text-gray-500">List Your Property</p>
          </div>
          </div>

          {/* ── SECTION 1: Owner ── */}
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
                  placeholder="+250 788 123 456"
                  value={form.phone}
                  onChange={set("phone")}
                  type="tel"
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

          {/* ── SECTION 2: Property ── */}
          <div className="mb-8">
            <SectionHeader icon={Home} title="Property Details" />
            <div className="flex flex-col gap-4">
              {/* Type */}
              <div>
                <Label text="Type of Property" required />
                <div className="flex gap-3 flex-wrap">
                  {["House", "Land"].map((t) => (
                    <RadioCard
                      key={t}
                      label={t}
                      checked={form.propertyType === t}
                      onChange={() =>
                        setForm((f) => ({ ...f, propertyType: t }))
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
                />
              </div>

              <InputField
                icon={Home}
                label="Asking Price (RWF)"
                required
                placeholder="e.g. 320,000,000"
                value={form.askingPrice}
                onChange={set("askingPrice")}
              />

              {/* Documents available */}
              <div>
                <Label text="Are all required documents available?" required />
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
                        setForm((f) => ({ ...f, documentsAvailable: o.value }))
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8 h-px bg-gray-100" />

          {/* ── SECTION 3: Additional ── */}
          <div className="mb-10">
            <SectionHeader icon={AlertCircle} title="Additional Information" />
            <div className="flex flex-col gap-4">
              <div>
                <Label text="Does the property have any issues?" required />
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
                        setForm((f) => ({ ...f, hasIssues: o.value }))
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

          {/* Submit */}
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2.5 rounded-full bg-primary py-4
                       text-[14px] font-semibold text-white border-0 cursor-pointer
                       shadow-[0_4px_20px_rgba(122,34,64,0.25)]
                       transition-all duration-200 hover:bg-primary/90 hover:shadow-[0_8px_28px_rgba(122,34,64,0.35)]
                       hover:-translate-y-px"
          >
            <Send size={16} strokeWidth={2} />
            Submit Registration
          </button>
        </form>

        {/* ── RIGHT SIDEBAR ── */}
        <aside className="flex flex-col gap-5 lg:sticky lg:top-28">
          {/* What to expect */}
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
                { step: "03", text: "We contact you to verify documents" },
                { step: "04", text: "Your property goes live on our listings" },
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

          {/* Need Help */}
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
              <Phone size={14} strokeWidth={2} /> +250 788 123 456
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
