"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await register(name, email, password);
      router.push("/calculator");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
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
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-xl font-medium text-white shadow-lg shadow-indigo-600/20">
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 className="text-3xl font-normal tracking-tight text-slate-900">Create account</h1>
            <p className="mt-2.5 text-base text-slate-500">Start planning your retirement today</p>
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
                  <label htmlFor="name" className="mb-2 block text-sm font-semibold text-slate-700">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-base font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 placeholder:font-normal focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 hover:bg-slate-50"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">
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
                  <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-base font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 placeholder:font-normal focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 hover:bg-slate-50"
                    placeholder="At least 6 characters"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="group relative flex w-full items-center justify-center gap-2.5 rounded-2xl bg-slate-900 px-8 py-4 text-base font-medium text-white shadow-lg shadow-slate-900/20 transition-all hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-900/30 active:translate-y-0 disabled:pointer-events-none disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <svg className="h-5 w-5 animate-spin text-white/70" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>Creating account...</span>
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-sm font-medium text-slate-500">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-indigo-600 transition-colors hover:text-indigo-700">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
