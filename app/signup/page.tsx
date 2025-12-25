"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        emailRedirectTo: window.location.origin + "/login",
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-morph-black flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="block mb-12">
          <h1 className="font-display text-2xl font-bold text-morph-white tracking-tighter">
            MORPH
          </h1>
        </Link>

        {/* Title */}
        <h2 className="font-display text-4xl text-morph-white mb-2 tracking-tighter">
          Create account
        </h2>
        <p className="text-morph-white/60 mb-8">
          Start your journey of active learning.
        </p>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 border border-red-500/50 bg-red-500/10 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Success message */}
        {success && (
          <div className="mb-6 p-4 border border-green-500/50 bg-green-500/10 text-green-400 text-sm">
            Check your email for a confirmation link.
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-6">
          <div>
            <label className="block text-sm text-morph-white/60 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-morph-panel border border-morph-border px-4 py-3 text-morph-white placeholder:text-morph-white/30 focus:outline-none focus:border-morph-blue transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm text-morph-white/60 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-morph-panel border border-morph-border px-4 py-3 text-morph-white placeholder:text-morph-white/30 focus:outline-none focus:border-morph-blue transition-colors"
              placeholder="Create a password"
            />
          </div>

          <div>
            <label className="block text-sm text-morph-white/60 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full bg-morph-panel border border-morph-border px-4 py-3 text-morph-white placeholder:text-morph-white/30 focus:outline-none focus:border-morph-blue transition-colors"
              placeholder="Confirm your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-morph-white text-morph-black py-4 font-display font-bold tracking-tight hover:bg-morph-blue hover:text-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-8 text-center text-morph-white/60 text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-morph-blue hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
