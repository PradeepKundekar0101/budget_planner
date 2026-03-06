"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await login(email, password);
      router.push("/calculator");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}} />
      <div className="flex min-h-screen items-center justify-center bg-[#fafbfc] px-4 py-12 font-jakarta selection:bg-indigo-100 selection:text-indigo-900">
        <div className="w-full max-w-[440px]">

          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-xl font-bold text-white shadow-lg shadow-indigo-600/20">
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h1 className="text-3xl font-normal tracking-tight text-slate-900">Welcome back</h1>
            <p className="mt-2.5 text-base text-slate-500">Sign in to access your retirement planner</p>
          </div>

          <div className="rounded-3xl border border-slate-200/60 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="flex items-center gap-3 rounded-2xl border border-rose-100 bg-rose-50/80 p-4 text-sm font-medium text-rose-600">
                  <svg className="h-5 w-5 shrink-0 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {error}
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-normal text-slate-700">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-base font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 placeholder:font-normal focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 hover:bg-slate-50"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="mb-2 block text-sm font-normal text-slate-700">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-base font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 placeholder:font-normal focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 hover:bg-slate-50"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="group relative flex w-full items-center justify-center gap-2.5 rounded-2xl bg-slate-900 px-8 py-4 text-base font-bold text-white shadow-lg shadow-slate-900/20 transition-all hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-900/30 active:translate-y-0 disabled:pointer-events-none disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <svg className="h-5 w-5 animate-spin text-white/70" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>Signing in...</span>
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-sm font-medium text-slate-500">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-bold text-indigo-600 transition-colors hover:text-indigo-700">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
