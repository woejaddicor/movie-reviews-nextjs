"use client";
import Link from "next/link";
import { useState, useTransition } from "react";
import { auth } from "../actions/auth-actions";

interface AuthFormProps {
  mode: "login" | "signup";
}

interface FormErrors {
  email?: string;
  password?: string;
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [formState, setFormState] = useState<{ errors?: FormErrors }>({});
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      const result = await auth(mode, {}, formData);
      setFormState(result ?? {});
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {mode === "signup" ? "Create Account" : "Welcome Back"}
            </h1>
            <p className="text-white/70">
              {mode === "signup"
                ? "Sign up to get started"
                : "Sign in to continue"}
            </p>
          </div>

          {/* Form */}
          <form
            id="auth-form"
            action={handleSubmit}
            className="space-y-6 bg-gray-900 p-6 rounded-lg"
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white mb-2"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white mb-2"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>

            {formState?.errors ? (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <ul className="space-y-1">
                  {Object.keys(formState.errors).map((error) => (
                    <li key={error} className="text-sm text-red-400">
                      {formState.errors![error as keyof FormErrors]}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isPending}
              className="w-full px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending
                ? "Loading..."
                : mode === "signup"
                  ? "Create Account"
                  : "Sign In"}
            </button>

            <div className="text-center">
              {mode === "login" && (
                <Link
                  href="/?mode=signup"
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  Don't have an account?{" "}
                  <span className="text-purple-400 font-medium">Sign up</span>
                </Link>
              )}
              {mode === "signup" && (
                <Link
                  href="/?mode=login"
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  Already have an account?{" "}
                  <span className="text-purple-400 font-medium">Sign in</span>
                </Link>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
