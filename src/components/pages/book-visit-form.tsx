"use client";

import { useState } from "react";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Home,
  Calendar,
  Clock,
  Car,
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
  propertyLocation: string;
  propertyPrice: string;
  visitDate: string;
  visitTime: string;
  transportation: string;
}

const defaultForm: FormState = {
  fullName: "",
  phone: "",
  email: "",
  address: "",
  idNumber: "",
  propertyType: "",
  propertyLocation: "",
  propertyPrice: "",
  visitDate: "",
  visitTime: "",
  transportation: "",
};

//  Success State

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
        "flex flex-1 items-center gap-3 rounded-xl border px-4 py-3 min-w-30",
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
        {checked && <div className="h-1.75 w-1.75 rounded-full bg-primary" />}
      </div>
      {label}
    </button>
  );
}

function TransportCard({
  label,
  desc,
  checked,
  onChange,
}: {
  label: string;
  desc: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={[
        "flex items-center gap-4 rounded-xl border px-5 py-4 text-left w-full",
        "transition-all duration-200 cursor-pointer",
        checked
          ? "border-primary bg-primary/5"
          : "border-gray-200 bg-white hover:border-gray-300",
      ].join(" ")}
    >
      <div
        className={[
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all",
          checked ? "border-primary" : "border-gray-300",
        ].join(" ")}
      >
        {checked && <div className="h-2 w-2 rounded-full bg-primary" />}
      </div>
      <div>
        <p
          className={`m-0 text-[13.5px] font-semibold ${checked ? "text-primary" : "text-gray-700"}`}
        >
          {label}
        </p>
        <p className="m-0 mt-0.5 text-[12px] text-gray-400">{desc}</p>
      </div>
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

//  Success State
function SuccessState({
  name,
  date,
  onReset,
}: {
  name: string;
  date: string;
  onReset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-8 py-20 text-center">
      <div className="mb-7 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <CheckCircle size={32} strokeWidth={1.5} className="text-primary" />
      </div>
      <h2 className="font-heading mb-4 text-[36px] font-bold text-gray-900">
        Booking Confirmed!
      </h2>
      <p className="mb-2 max-w-100 text-[15px] leading-relaxed text-gray-500">
        Thank you,{" "}
        <strong className="text-gray-900">{name || "valued client"}</strong>.
        Your viewing request has been received.
      </p>
      {date && (
        <p className="mb-8 text-[14px] text-primary font-medium">
          Requested date:{" "}
          {new Date(date).toLocaleDateString("en-RW", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </p>
      )}
      <p className="mb-8 max-w-90 text-[13.5px] text-gray-400">
        Our team will confirm your appointment and send details shortly.
      </p>
      <button
        onClick={onReset}
        className="inline-flex items-center gap-2.5 rounded-full bg-primary px-7 py-3.5
                   text-[13px] font-semibold text-white border-0 cursor-pointer
                   transition-all duration-200 hover:bg-primary/90 hover:-translate-y-px"
      >
        Book Another Visit
      </button>
    </div>
  );
}

// ─── Main Form ─────────────────────────────────────────────────────────────────

export function BookVisitForm() {
  const [form, setForm] = useState<FormState>(defaultForm);
  const [submitted, setSubmitted] = useState(false);

  const set =
    (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted)
    return (
      <SuccessState
        name={form.fullName}
        date={form.visitDate}
        onReset={() => setSubmitted(false)}
      />
    );

  const transportOptions = [
    {
      value: "alone",
      label: "Coming Alone",
      desc: "I will make my own way to the property",
    },
    {
      value: "with-driver",
      label: "Coming with Driver",
      desc: "I have my own transportation arranged",
    },
    {
      value: "need-transport",
      label: "Need Transport",
      desc: "Please arrange a pickup for me",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-8 py-14 lg:px-12 lg:py-16">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_300px] lg:items-start">
        {/* ── FORM ── */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-0">
          {/* Header */}
          <div className="mb-10 flex items-start justify-between">
            <div className="mb-8">
            <h3 className="font-heading  font-black uppercase tracking-wide text-primary">
              Booking Form
            </h3>
            <p className="mt-1 text-gray-500">Schedule a Viewing</p>
          </div>
          </div>

          {/* ── SECTION 1: Client Info ── */}
          <div className="mb-8">
            <SectionHeader icon={User} title="Client Information" />
            <div className="flex flex-col gap-4">
              <InputField
                icon={User}
                label="Full Name"
                required
                placeholder="Jean Paul Nkurunziza"
                value={form.fullName}
                onChange={set("fullName")}
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InputField
                  icon={Phone}
                  label="Phone Number"
                  required
                  placeholder="+250 788 123 456"
                  value={form.phone}
                  onChange={set("phone")}
                  type="tel"
                />
                <InputField
                  icon={Mail}
                  label="Email (optional)"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={set("email")}
                  type="email"
                />
              </div>
              <InputField
                icon={MapPin}
                label="Your Address"
                required
                placeholder="KG 15 Ave, Kigali"
                value={form.address}
                onChange={set("address")}
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
          </div>

          <div className="mb-8 h-px bg-gray-100" />

          {/* ── SECTION 2: Property Details ── */}
          <div className="mb-8">
            <SectionHeader icon={Home} title="Property to Visit" />
            <div className="flex flex-col gap-4">
              {/* Property Type */}
              <div>
                <Label text="Property Type" required />
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

              <InputField
                icon={MapPin}
                label="Property Location"
                required
                placeholder="e.g. Nyarutarama, Kigali"
                value={form.propertyLocation}
                onChange={set("propertyLocation")}
              />
              <InputField
                icon={Home}
                label="Property Price (RWF)"
                placeholder="e.g. RWF 450,000,000"
                value={form.propertyPrice}
                onChange={set("propertyPrice")}
              />

              {/* Visit date + time */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InputField
                  icon={Calendar}
                  label="Visit Date"
                  required
                  type="date"
                  value={form.visitDate}
                  onChange={set("visitDate")}
                />
                <InputField
                  icon={Clock}
                  label="Visit Time"
                  required
                  type="time"
                  value={form.visitTime}
                  onChange={set("visitTime")}
                />
              </div>
            </div>
          </div>

          <div className="mb-8 h-px bg-gray-100" />

          {/* ── SECTION 3: Transportation ── */}
          <div className="mb-10">
            <SectionHeader icon={Car} title="Transportation" />
            <div className="flex flex-col gap-2.5">
              {transportOptions.map((opt) => (
                <TransportCard
                  key={opt.value}
                  label={opt.label}
                  desc={opt.desc}
                  checked={form.transportation === opt.value}
                  onChange={() =>
                    setForm((f) => ({ ...f, transportation: opt.value }))
                  }
                />
              ))}
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
            Submit Booking Request
          </button>
        </form>

        {/* ── RIGHT SIDEBAR ── */}
        <aside className="flex flex-col gap-5 lg:sticky lg:top-28">
          {/* What to expect */}
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
            <h4 className="font-heading mb-5 text-[20px] font-bold text-gray-900">
              What Happens Next
            </h4>
            <div className="flex flex-col gap-4">
              {[
                { step: "01", text: "Submit your booking request below" },
                { step: "02", text: "We confirm your slot within a few hours" },
                { step: "03", text: "Our agent meets you at the property" },
                { step: "04", text: "Guided tour with full property insights" },
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
              Call us to discuss available time slots or get directions.
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
