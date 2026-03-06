"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

const fields = [
  { key: "currentAge", label: "Current Age", placeholder: "30", min: 18, max: 80, suffix: "years" },
  { key: "retirementAge", label: "Retirement Age", placeholder: "65", min: 30, max: 90, suffix: "years" },
  { key: "lifeExpectancy", label: "Life Expectancy", placeholder: "85", min: 60, max: 110, suffix: "years" },
  { key: "currentSavings", label: "Current Savings", placeholder: "100,000", min: 0, max: 100000000, prefix: "$" },
  { key: "monthlySpending", label: "Monthly Spending in Retirement", placeholder: "4,000", min: 100, max: 100000, prefix: "$" },
  { key: "expectedReturn", label: "Expected Annual Return", placeholder: "7", min: 0, max: 30, suffix: "%" },
  { key: "inflationRate", label: "Inflation Rate", placeholder: "3", min: 0, max: 15, suffix: "%" },
] as const;

type FieldKey = (typeof fields)[number]["key"];

export default function CalculatorPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [values, setValues] = useState<Record<FieldKey, string>>({
    currentAge: "",
    retirementAge: "",
    lifeExpectancy: "",
    currentSavings: "",
    monthlySpending: "",
    expectedReturn: "",
    inflationRate: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  const handleChange = (key: FieldKey, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setError("");
    setIsLoading(true);

    const numericValues = Object.fromEntries(
      Object.entries(values).map(([k, v]) => [k, parseFloat(v.replace(/,/g, ""))])
    );

    for (const [key, val] of Object.entries(numericValues)) {
      if (isNaN(val)) {
        setError(`Please enter a valid number for ${fields.find((f) => f.key === key)?.label}`);
        setIsLoading(false);
        return;
      }
    }

    try {
      const res = await fetch("/api/calculator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(numericValues),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push(`/results/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Calculation failed");
      setIsLoading(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fafbfc]">
        <p className="text-sm font-medium text-slate-500">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}} />
      <div className="min-h-screen bg-[#fafbfc] font-jakarta text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
        <div className="mx-auto max-w-3xl px-4 pb-24 pt-24 sm:px-6 lg:px-8">

          <div className="mb-10 text-center">
            <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-sm">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-4xl font-normal tracking-tight text-slate-900 sm:text-5xl">
              Retirement Calculator
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-slate-500">
              Enter your financial details to project how long your savings will last and explore optimization scenarios.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200/60 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="flex items-center gap-3 rounded-2xl border border-rose-100 bg-rose-50/80 p-4 text-sm font-medium text-rose-600">
                  <svg className="h-5 w-5 shrink-0 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {error}
                </div>
              )}

              <div className="grid gap-6 sm:grid-cols-2">
                {fields.map((field) => (
                  <div
                    key={field.key}
                    className={field.key === "monthlySpending" ? "sm:col-span-2" : ""}
                  >
                    <label
                      htmlFor={field.key}
                      className="mb-2 block text-sm font-normal text-slate-700"
                    >
                      {field.label}
                    </label>
                    <div className="relative group">
                      {"prefix" in field && field.prefix && (
                        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                          {field.prefix}
                        </span>
                      )}
                      <input
                        id={field.key}
                        type="text"
                        inputMode="decimal"
                        required
                        value={values[field.key]}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        className={`w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3.5 text-base font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 placeholder:font-normal focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 hover:bg-slate-50 ${"prefix" in field && field.prefix ? "pl-8 pr-4" : "px-4"
                          } ${"suffix" in field && field.suffix ? "pr-14" : ""}`}
                        placeholder={field.placeholder}
                      />
                      {"suffix" in field && field.suffix && (
                        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                          {field.suffix}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-5">
                <div className="flex gap-3">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-600">
                    <strong className="font-normal text-slate-900">How it works:</strong> We project your savings growth
                    until retirement, then model monthly withdrawals adjusted for inflation across three
                    scenarios (typical, downside, and upside). You&apos;ll also get AI-powered personalized suggestions.
                  </p>
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
                    <span>Analyzing your profile...</span>
                  </>
                ) : (
                  <>
                    <span>Calculate My Retirement</span>
                    <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
