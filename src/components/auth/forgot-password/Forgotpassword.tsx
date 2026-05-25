"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(
        "/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      // ❌ ERROR CASE → Toastify error
      if (!response.ok) {
        const message =
          data?.error ||
          "Unable to send reset link";

        setError(message);

        toast.error(message);

        return;
      }

      // ✅ SUCCESS CASE → Toastify success
      toast.success(
        "Reset link sent to your email"
      );

      setSent(true);
    } catch {
      const msg =
        "Something went wrong. Please try again.";

      setError(msg);

      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <Image
            src="/logo-blak.png"
            alt="Karisimbi Real Estate"
            width={44}
            height={44}
            className="object-contain"
          />
          <div className="leading-tight">
            <p className="font-heading text-[17px] font-bold tracking-widest text-primary">
              KARISIMBI
            </p>
            <p className="text-[7.5px] font-medium uppercase tracking-[0.3em] text-primary/50 mt-0.5">
              Real Estate
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">

          {!sent ? (
            <>
              {/* Header */}
              <div className="mb-7">
                <div className="w-11 h-11 rounded-2xl bg-primary/8 flex items-center justify-center mb-5">
                  <Mail
                    size={20}
                    strokeWidth={1.6}
                    className="text-primary"
                  />
                </div>

                <h1 className="landing-title-compact text-gray-900 mb-2">
                  Forgot Password?
                </h1>

                <p className="text-sm text-gray-400 leading-relaxed">
                  Enter your email address and
                  we&apos;ll send you a link to
                  reset your password.
                </p>
              </div>

              {/* Server error (still works, design unchanged) */}
              {error && (
                <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-500">
                  {error}
                </div>
              )}

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                noValidate
                className="space-y-4"
              >
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5">
                    Email Address
                  </label>

                  <input
                    type="email"
                    value={email}
                    placeholder="you@example.com"
                    required
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-800
                               placeholder:text-gray-300 transition-all outline-none
                               focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 rounded-full bg-primary text-white text-sm font-semibold
                             transition-all hover:opacity-90 active:scale-[0.98]
                             disabled:opacity-60 disabled:cursor-not-allowed mt-1"
                >
                  {isSubmitting
                    ? "Sending link..."
                    : "Send Reset Link"}
                </button>
              </form>
            </>
          ) : (
            /* Success State */
            <div className="text-center py-4">
              <h2 className="landing-card-title text-gray-900 mb-2">
                Check your inbox
              </h2>

              <p className="text-sm text-gray-400 leading-relaxed mb-1">
                We sent a password reset link to
              </p>

              <p className="text-sm font-semibold text-gray-700 mb-6">
                {email}
              </p>

              <p className="text-xs text-gray-400">
                Didn&apos;t receive it?{" "}
                <button
                  onClick={() => {
                    setSent(false);
                    setEmail("");
                  }}
                  className="text-primary font-semibold hover:underline"
                >
                  Try again
                </button>
              </p>
            </div>
          )}
        </div>

        {/* Back */}
        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors no-underline"
          >
            <ArrowLeft size={14} />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}