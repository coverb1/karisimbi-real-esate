"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";

// ── SCHEMA ──
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;
type LoginErrors = Partial<Record<keyof LoginForm, string>>;

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const [values, setValues] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<LoginErrors>({});

  const [submitted, setSubmitted] = useState(false);

  const [loading, setLoading] = useState(false);

  const [serverError, setServerError] = useState("");

  // validate a single field on blur / change after first submit
  const validate = (data: LoginForm): LoginErrors => {
    const result = loginSchema.safeParse(data);

    if (result.success) return {};

    return Object.fromEntries(
      result.error.issues.map((i) => [i.path[0], i.message])
    ) as LoginErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = {
      ...values,
      [e.target.name]: e.target.value,
    };

    setValues(next);

    if (submitted) {
      setErrors(validate(next));
    }

    setServerError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitted(true);

    const errs = validate(values);

    setErrors(errs);

    if (Object.keys(errs).length > 0) return;

    try {
      setLoading(true);
      setServerError("");

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        setServerError(data.error || "Login failed");
        return;
      }

      console.log("Login Success:",data);

      // redirect after login
      router.push("/admin/dashboard");
    } catch (error) {
      console.error(error);
      setServerError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-8 lg:px-12 py-12">
      <div className="w-full max-w-6xl flex rounded-2xl overflow-hidden shadow-lg min-h-[600px]">
        {/* ───── LEFT SIDE (FORM) ───── */}
        <div className="w-full lg:w-1/2 flex items-center justify-center py-12 px-8 lg:px-12 bg-background">
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <Image
                src="/logo-blak.png"
                alt="Logo"
                width={45}
                height={45}
              />

              <div className="leading-tight">
                <h1 className="text-xl font-heading font-bold text-primary">
                  KARISIMBI
                </h1>

                <p className="text-xs tracking-[0.3em] text-gray-mid uppercase">
                  Real Estate
                </p>
              </div>
            </div>

            {/* Title */}
            <h2 className="landing-title-compact mb-2">
              Welcome Back!
            </h2>

            <p className="text-gray-mid mb-8">
              Please enter your login details below
            </p>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              noValidate
              className="space-y-4"
            >
              {/* Server Error */}
              {serverError && (
                <div className="w-full rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-500">
                  {serverError}
                </div>
              )}

              {/* Email */}
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={values.email}
                  onChange={handleChange}
                  className={`w-full h-12 px-4 rounded-lg border transition
                    focus:outline-none focus:ring-2 focus:ring-primary/30
                    ${
                      errors.email
                        ? "border-red-400 bg-red-50"
                        : "border-border"
                    }`}
                />

                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={values.password}
                    onChange={handleChange}
                    className={`w-full h-12 px-4 rounded-lg border transition
                      focus:outline-none focus:ring-2 focus:ring-primary/30
                      ${
                        errors.password
                          ? "border-red-400 bg-red-50"
                          : "border-border"
                      }`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-mid"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Forgot */}
              <div className="text-right">
                <Link
                  href="/forgot-password"
                  className="text-sm text-gray-mid"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-full bg-primary text-white font-semibold transition disabled:opacity-70"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-border" />

                <span className="text-xs text-gray-mid">
                  or continue
                </span>

                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Sign up link */}
              {/* 
              <p className="text-center text-sm text-gray-mid mt-4">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="text-primary font-medium"
                >
                  Sign up
                </Link>
              </p> 
              */}
            </form>
          </div>
        </div>

        {/* ───── RIGHT SIDE (VISUAL) ───── */}
        <div className="hidden lg:flex w-1/2 relative items-end justify-center overflow-hidden bg-[#111]">
          <Image
            src="/real-estate.jpg"
            alt="Login Illustration"
            fill
            className="object-cover object-center"
            priority
          />

          <div className="absolute inset-0 bg-black/40" />

          <div className="relative z-10 text-center pb-12 px-8">
            <h3 className="text-white text-2xl font-bold">
              Manage your Property Anywhere
            </h3>

            <p className="text-white/70 mt-2 text-sm">
              Access your dashboard, manage listings and
              track activity in real time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}