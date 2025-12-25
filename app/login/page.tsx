"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push("/dashboard");
      return;
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
          Welcome back
        </h2>
        <p className="text-morph-white/60 mb-8">
          Sign in to continue your learning journey.
        </p>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 border border-red-500/50 bg-red-500/10 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
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
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-morph-white text-morph-black py-4 font-display font-bold tracking-tight hover:bg-morph-blue hover:text-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-8 text-center text-morph-white/60 text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-morph-blue hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
