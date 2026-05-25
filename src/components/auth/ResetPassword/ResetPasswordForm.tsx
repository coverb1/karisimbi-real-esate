"use client";

import { FormEvent, useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";

function ResetPasswordInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({ password: "", confirm: "" });

  const validate = () => {
    const errs = { password: "", confirm: "" };
    if (password.length < 8)
      errs.password = "Password must be at least 8 characters";
    if (password !== confirmPassword)
      errs.confirm = "Passwords do not match";
    setFieldErrors(errs);
    return !errs.password && !errs.confirm;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (!validate()) return;
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.error || "Failed to reset password. The link may have expired.");
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Invalid / missing token ──
  if (!token) {
    return (
      <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
              <AlertCircle size={26} strokeWidth={1.6} className="text-red-400" />
            </div>
            <h2 className="landing-card-title text-gray-900 mb-2">Invalid Reset Link</h2>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              This password reset link is invalid or has expired. Please request a new one.
            </p>
            <Link
              href="/forgot-password"
              className="inline-flex items-center justify-center h-11 px-6 rounded-full bg-primary
                         text-white text-sm font-semibold no-underline hover:opacity-90 transition-opacity"
            >
              Request New Link
            </Link>
          </div>
        </div>
      </div>
    );
  }

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

          {!success ? (
            <>
              {/* Header */}
              <div className="mb-7">
                <div className="w-11 h-11 rounded-2xl bg-primary/8 flex items-center justify-center mb-5">
                  <Lock size={20} strokeWidth={1.6} className="text-primary" />
                </div>
                <h1 className="landing-title-compact text-gray-900 mb-2">
                  Set New Password
                </h1>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Your new password must be at least 8 characters long.
                </p>
              </div>

              {/* Server error */}
              {error && (
                <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-500">
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} noValidate className="space-y-4">

                {/* New password */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      placeholder="••••••••"
                      required
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setFieldErrors((p) => ({ ...p, password: "" }));
                      }}
                      className={`w-full h-12 pl-4 pr-11 rounded-xl border text-sm text-gray-800
                                  placeholder:text-gray-300 transition-all outline-none
                                  focus:ring-2 focus:ring-primary/10
                                  ${fieldErrors.password
                                    ? "border-red-300 bg-red-50 focus:border-red-300"
                                    : "border-gray-200 bg-white focus:border-primary/40"}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <p className="mt-1.5 text-xs text-red-500">{fieldErrors.password}</p>
                  )}
                </div>

                {/* Confirm password */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      placeholder="••••••••"
                      required
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setFieldErrors((p) => ({ ...p, confirm: "" }));
                      }}
                      className={`w-full h-12 pl-4 pr-11 rounded-xl border text-sm text-gray-800
                                  placeholder:text-gray-300 transition-all outline-none
                                  focus:ring-2 focus:ring-primary/10
                                  ${fieldErrors.confirm
                                    ? "border-red-300 bg-red-50 focus:border-red-300"
                                    : "border-gray-200 bg-white focus:border-primary/40"}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((p) => !p)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                    >
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {fieldErrors.confirm && (
                    <p className="mt-1.5 text-xs text-red-500">{fieldErrors.confirm}</p>
                  )}
                </div>

                {/* Password strength bar */}
                {password.length > 0 && (
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-all ${
                          password.length >= level * 3
                            ? password.length < 8
                              ? "bg-amber-400"
                              : "bg-emerald-400"
                            : "bg-gray-100"
                        }`}
                      />
                    ))}
                    <span className={`text-[10px] font-semibold ml-1 ${
                      password.length < 8 ? "text-amber-500" : "text-emerald-500"
                    }`}>
                      {password.length < 6 ? "Weak" : password.length < 8 ? "Fair" : password.length < 12 ? "Good" : "Strong"}
                    </span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || !token}
                  className="w-full h-12 rounded-full bg-primary text-white text-sm font-semibold
                             transition-all hover:opacity-90 active:scale-[0.98]
                             disabled:opacity-60 disabled:cursor-not-allowed mt-1"
                >
                  {isSubmitting ? "Resetting password..." : "Reset Password"}
                </button>
              </form>
            </>
          ) : (
            /* ── Success state ── */
            <div className="text-center py-4">
              {/* <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 size={26} strokeWidth={1.6} className="text-emerald-500" />
              </div> */}
              <h2 className="landing-card-title text-gray-900 mb-2">Password Reset!</h2>
              <p className="text-sm text-gray-400 leading-relaxed">
                Your password has been updated successfully. Redirecting you to login…
              </p>
              <div className="mt-5 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ animation: "progress 3s linear forwards" }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Back to login */}
        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors no-underline"
          >
            <ArrowLeft size={14} />
            Back to Login.
          </Link>
        </div>

      </div>
    </div>
  );
}

export function ResetPasswordForm() {
  return (
    // It reads a token from the URL like:
    <Suspense>
      <ResetPasswordInner />
    </Suspense>
  );
}
