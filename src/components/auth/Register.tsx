"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { z } from "zod";

// ── SCHEMA ──
const registerSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .regex(/^\+?[0-9\s\-()]+$/, "Please enter a valid phone number"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
    terms: z.literal(true, {
      errorMap: () => ({ message: "You must accept the terms to continue" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
};

type RegisterErrors = Partial<Record<keyof RegisterForm, string>>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [values, setValues] = useState<RegisterForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [errors, setErrors] = useState<RegisterErrors>({});

  const validate = (data: RegisterForm): RegisterErrors => {
    const result = registerSchema.safeParse(data);
    if (result.success) return {};
    return Object.fromEntries(
      result.error.issues.map((i) => [i.path[0], i.message])
    ) as RegisterErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    const next = {
      ...values,
      [name]: type === "checkbox" ? checked : value,
    };
    setValues(next);
    if (submitted) setErrors(validate(next));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      // submit logic here
      console.log("Valid:", values);
    }
  };

  // helper for field styling
  const fieldClass = (field: keyof RegisterErrors) =>
    `w-full h-12 px-4 rounded-lg border transition
     focus:outline-none focus:ring-2 focus:ring-primary/30
     ${errors[field] ? "border-red-400 bg-red-50" : "border-border"}`;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-8 lg:px-12 py-12">

      {/* ── INNER CARD ── */}
      <div className="w-full max-w-6xl flex rounded-2xl overflow-hidden shadow-lg min-h-[700px]">

        {/* ───── LEFT SIDE (FORM) ───── */}
        <div className="w-full lg:w-1/2 flex items-center justify-center py-12 px-8 lg:px-12 bg-background">
          <div className="w-full max-w-md">

            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <Image src="/logo-blak.png" alt="Logo" width={45} height={45} />
              <div className="leading-tight">
                <h1 className="text-xl font-heading font-bold text-primary">KARISIMBI</h1>
                <p className="text-xs tracking-[0.3em] text-gray-mid uppercase">Real Estate</p>
              </div>
            </div>

            {/* Title */}
            <h2 className="landing-title-compact mb-2">Create Account</h2>
            <p className="text-gray-mid mb-8">Fill in your details to get started</p>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-4">

              {/* First & Last Name */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First name"
                    value={values.firstName}
                    onChange={handleChange}
                    className={fieldClass("firstName")}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    value={values.lastName}
                    onChange={handleChange}
                    className={fieldClass("lastName")}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={values.email}
                  onChange={handleChange}
                  className={fieldClass("email")}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone number"
                  value={values.phone}
                  onChange={handleChange}
                  className={fieldClass("phone")}
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
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
                    className={fieldClass("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-mid"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    className={fieldClass("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-mid"
                  >
                    {showConfirm ? "Hide" : "Show"}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Terms */}
              <div>
                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="terms"
                    name="terms"
                    checked={values.terms}
                    onChange={handleChange}
                    className="mt-1 accent-primary cursor-pointer"
                  />
                  {/* <label htmlFor="terms" className="text-sm text-gray-mid leading-snug cursor-pointer">
                    I agree to the{" "}
                    <Link href="/terms" className="text-primary font-medium">Terms of Service</Link>
                    {" "}and{" "}
                    <Link href="/privacy" className="text-primary font-medium">Privacy Policy</Link>
                  </label> */}

                </div>
                {errors.terms && (
                  <p className="mt-1 text-xs text-red-500">{errors.terms}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full h-12 rounded-full bg-primary text-white font-semibold transition mt-2"
              >
                Create Account
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-gray-mid">or continue</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Login link */}
              <p className="text-center text-sm text-gray-mid mt-4">
                Already have an account?{" "}
                <Link href="/login" className="text-primary font-medium">Sign in</Link>
              </p>

            </form>
          </div>
        </div>

        {/* ───── RIGHT SIDE (VISUAL) ───── */}
        <div className="hidden lg:flex w-1/2 relative items-end justify-center overflow-hidden bg-[#111]">
          <Image
            src="/real-estate.jpg"
            alt="Register Illustration"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 text-center pb-12 px-8">
            <h3 className="text-white text-2xl font-bold">
              Find Your Dream Property
            </h3>
            <p className="text-white/70 mt-2 text-sm">
              Join thousands of buyers and sellers on Rwanda's leading real estate platform.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}