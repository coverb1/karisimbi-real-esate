"use client";

import { useState } from "react";
import { z } from "zod";
import {
  User,
  Phone,
  Mail,
  MessageSquare,
  Send,
  CheckCircle,
  MapPin,
  Clock,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react";

interface FormState {
  fullName: string;
  phone: string;
  email: string;
  subject: string;
  enquiryType: string;
  message: string;
}

const defaultForm: FormState = {
  fullName: "",
  phone: "",
  email: "",
  subject: "",
  enquiryType: "",
  message: "",
};

/* ─── VALIDATION ─── */
const formSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Name must contain only letters"),

  phone: z
    .string()
    .min(8, "Phone number is too short")
    .max(20, "Phone number is too long")
    .regex(/^\+?[0-9\s]+$/, "Phone must contain only digits"),

  email: z.string().email("Please enter a valid email address"),

  subject: z.string().min(3, "Subject must be at least 3 characters"),

  enquiryType: z.string().min(1, "Please select an enquiry type"),

  message: z
    .string()
    .min(20, "Message must be at least 20 characters")
    .max(1000, "Message must not exceed 1000 characters"),
});

/* ─── HELPERS ─── */
function sanitizePhone(value: string): string {
  return value.replace(/[^0-9+\s]/g, "").replace(/(?!^)\+/g, "");
}

function blockNonDigitKeys(e: React.KeyboardEvent<HTMLInputElement>) {
  const allowed = [
    "Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight", "Home", "End", " ",
  ];
  if (allowed.includes(e.key)) return;
  if (e.key === "+" && (e.currentTarget.selectionStart ?? 0) === 0) return;
  if (!/^[0-9]$/.test(e.key)) e.preventDefault();
}

/* ─── SUB-COMPONENTS ─── */

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
        "flex flex-1 items-center gap-3 rounded-xl border px-4 py-3 min-w-[130px]",
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
      <h4 className="font-heading text-[20px] font-bold text-gray-900">{title}</h4>
    </div>
  );
}

function SuccessState({ name, onReset }: { name: string; onReset: () => void }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-8 py-20 text-center">
      <div className="mb-7 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <CheckCircle size={32} strokeWidth={1.5} className="text-primary" />
      </div>
      <h2 className="font-heading mb-4 text-[36px] font-bold text-gray-900">
        Message Sent!
      </h2>
      <p className="mb-8 max-w-[400px] text-[15px] leading-relaxed text-gray-500">
        Thank you,{" "}
        <strong className="text-gray-900">{name || "valued client"}</strong>.
        We've received your message and will get back to you within 24 hours.
      </p>
      <button
        onClick={onReset}
        className="inline-flex items-center gap-2.5 rounded-full bg-primary px-7 py-3.5
                   text-[13px] font-semibold text-white border-0 cursor-pointer
                   transition-all duration-200 hover:bg-primary/90 hover:-translate-y-px"
      >
        Send Another Message
      </button>
    </div>
  );
}

/* ─── MAIN COMPONENT ─── */

export function ContactForm() {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = formSchema.safeParse(form);
    if (!result.success) {
      setError(result.error.errors[0]?.message || "Please fill all required fields correctly.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.message || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Network error. Please check your connection.");
    }

    setLoading(false);
  };

  const charCount = form.message.length;

  if (submitted)
    return (
      <SuccessState
        name={form.fullName}
        onReset={() => {
          setForm(defaultForm);
          setSubmitted(false);
        }}
      />
    );

  const enquiryTypes = ["Buying", "Selling", "Renting", "Valuation", "General"];

  return (
    <section className="mx-auto max-w-7xl px-8 py-14 lg:px-12 lg:py-16">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_300px] lg:items-start">
        {/* ── FORM ── */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-0">
          <div className="mb-10">
            <h3 className="font-heading font-black uppercase tracking-wide text-primary">
              Contact Us
            </h3>
            <p className="mt-1 text-gray-500">We'd love to hear from you</p>
          </div>

          {/* Section 1 — Your Details */}
          <div className="mb-8">
            <SectionHeader icon={User} title="Your Details" />
            <div className="flex flex-col gap-4">
              <InputField
                icon={User}
                label="Full Name"
                required
                placeholder="Jean Paul Nkurunziza"
                value={form.fullName}
                onChange={set("fullName")}
                onKeyDown={(e) => {
                  if (/^[0-9]$/.test(e.key)) e.preventDefault();
                }}
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                <InputField
                  icon={Mail}
                  label="Email Address"
                  required
                  placeholder="jean@example.com"
                  value={form.email}
                  onChange={set("email")}
                  type="email"
                />
              </div>
            </div>
          </div>

          <div className="mb-8 h-px bg-gray-100" />

          {/* Section 2 — Your Message */}
          <div className="mb-10">
            <SectionHeader icon={MessageSquare} title="Your Message" />
            <div className="flex flex-col gap-4">

              {/* Enquiry Type */}
              <div>
                <Label text="Enquiry Type" required />
                <div className="flex gap-3 flex-wrap">
                  {enquiryTypes.map((t) => (
                    <RadioCard
                      key={t}
                      label={t}
                      checked={form.enquiryType === t}
                      onChange={() => setForm((f) => ({ ...f, enquiryType: t }))}
                    />
                  ))}
                </div>
              </div>

              {/* Subject */}
              <InputField
                icon={MessageSquare}
                label="Subject"
                required
                placeholder="e.g. Interested in a property in Nyarutarama"
                value={form.subject}
                onChange={set("subject")}
              />

              {/* Message */}
              <div>
                <Label text="Message" required />
                <div className="relative">
                  <textarea
                    rows={6}
                    value={form.message}
                    onChange={set("message")}
                    maxLength={1000}
                    placeholder="Tell us how we can help you. The more detail you provide, the better we can assist..."
                    className="w-full resize-y rounded-xl border border-gray-200 bg-white px-4 py-3
                               text-[14px] leading-relaxed text-gray-800 outline-none placeholder:text-gray-300
                               transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                  <span
                    className={`absolute bottom-3 right-4 text-[11px] tabular-nums transition-colors ${
                      charCount > 900 ? "text-red-400" : "text-gray-300"
                    }`}
                  >
                    {charCount}/1000
                  </span>
                </div>
              </div>
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
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>

        {/* ── SIDEBAR ── */}
        <aside className="flex flex-col gap-5 lg:sticky lg:top-28">

          {/* Contact Info card */}
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
            <h4 className="font-heading mb-5 text-[20px] font-bold text-gray-900">
              Get in Touch
            </h4>
            <div className="flex flex-col gap-4">
              <a
                href="tel:+250788123456"
                className="flex items-start gap-3.5 no-underline group"
              >
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <Phone size={14} strokeWidth={2} className="text-primary" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400">
                    Phone
                  </p>
                  <p className="text-[13.5px] font-semibold text-gray-700 group-hover:text-primary transition-colors">
                    +250 787 861 400
                  </p>
                </div>
              </a>

              <a
                href="mailto: karisimbirealestate@gmail.com"
                className="flex items-start gap-3.5 no-underline group"
              >
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <Mail size={14} strokeWidth={2} className="text-primary" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400">
                    Email
                  </p>
                  <p className="text-[13px] font-semibold text-gray-700 group-hover:text-primary transition-colors break-all">
                    info@karisimbirealestate.com
                  </p>
                </div>
              </a>

              <div className="flex items-start gap-3.5">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <MapPin size={14} strokeWidth={2} className="text-primary" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400">
                    Office
                  </p>
                  <p className="text-[13.5px] font-semibold text-gray-700">
                    KG 15 Ave, Kigali
                  </p>
                  <p className="text-[12px] text-gray-400">Gasabo District, Rwanda</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Clock size={14} strokeWidth={2} className="text-primary" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400">
                    Hours
                  </p>
                  <p className="text-[13.5px] font-semibold text-gray-700">
                    Mon – Fri: 8:00 – 18:00
                  </p>
                  <p className="text-[12px] text-gray-400">Sat: 9:00 – 14:00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Social / CTA card */}
          <div className="rounded-2xl bg-primary p-6">
            <h4 className="font-heading mb-2 text-[20px] font-bold text-white">
              Follow Us
            </h4>
            <p className="mb-5 text-[13px] leading-relaxed text-white/65">
              Stay updated with our latest listings and news.
            </p>

            <div className="flex gap-3">
              {[
                { icon: Instagram, href: "#", label: "Instagram" },
                { icon: Facebook, href: "#", label: "Facebook" },
                { icon: Twitter, href: "#", label: "Twitter" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15
                             text-white no-underline transition-all duration-200
                             hover:bg-white/25 hover:-translate-y-px"
                >
                  <Icon size={15} strokeWidth={1.8} />
                </a>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}