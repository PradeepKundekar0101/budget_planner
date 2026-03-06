"use client";

import { useEffect, useState, useRef, use, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import type { CalculationResults } from "@/lib/types";
import markdownit from "markdown-it";

const md = markdownit({
  html: false,
  linkify: true,
  typographer: true,
  breaks: true,
});
function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value}`;
}

function StatusBadge({ depletionAge, lifeExpectancy }: { depletionAge: number | null; lifeExpectancy: number }) {
  if (!depletionAge) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50/80 px-2.5 py-1 text-xs font-medium text-emerald-600 ring-1 ring-inset ring-emerald-200/50">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Savings Last
      </span>
    );
  }
  const yearsShort = lifeExpectancy - depletionAge;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50/80 px-2.5 py-1 text-xs font-medium text-rose-600 ring-1 ring-inset ring-rose-200/50">
      <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
      Depletes {yearsShort}yr early
    </span>
  );
}

export default function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<CalculationResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const reportRef = useRef<HTMLDivElement>(null);
  const renderedAiSuggestions = useMemo(() => md.render(data?.aiSuggestions ?? ""), [data?.aiSuggestions]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/calculator/${id}`);
        if (!res.ok) throw new Error("Failed to load results");
        const json = await res.json();
        setData(json.results as CalculationResults);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error loading results");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    const html2canvas = (await import("html2canvas-pro")).default;
    const { jsPDF } = await import("jspdf");

    const canvas = await html2canvas(reportRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#fafafa",
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = pdfHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
    heightLeft -= pdf.internal.pageSize.getHeight();

    while (heightLeft > 0) {
      position -= pdf.internal.pageSize.getHeight();
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();
    }

    pdf.save("retirement-report.pdf");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fafafa]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
          <p className="text-sm font-medium text-slate-500 tracking-wide">Analyzing your future...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fafafa] p-6">
        <div className="w-full max-w-md rounded-3xl border border-rose-100 bg-white p-8 text-center shadow-xl shadow-rose-100/20">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50">
            <svg className="h-6 w-6 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-medium text-slate-900">Oops! Something went wrong</h3>
          <p className="text-sm text-slate-500">{error || "No data found"}</p>
        </div>
      </div>
    );
  }

  const { inputs, typical, downside, upside, improvements, aiSuggestions } = data;

  const allAges = new Set<number>();
  typical.snapshots.forEach((s) => allAges.add(s.age));
  downside.snapshots.forEach((s) => allAges.add(s.age));
  upside.snapshots.forEach((s) => allAges.add(s.age));
  const sortedAges = Array.from(allAges).sort((a, b) => a - b);

  const chartData = sortedAges.map((age) => ({
    age,
    Typical: typical.snapshots.find((s) => s.age === age)?.balance ?? null,
    Downside: downside.snapshots.find((s) => s.age === age)?.balance ?? null,
    Upside: upside.snapshots.find((s) => s.age === age)?.balance ?? null,
  }));

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}} />
      <div className="min-h-screen bg-[#fafbfc] font-jakarta text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
        <div className="mx-auto max-w-6xl px-4 pb-24 pt-24 sm:px-6 lg:px-8">

          {/* Header Section */}
          <div className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
                Projection Ready
              </div>
              <h1 className="text-4xl font-normal tracking-tight text-slate-900 sm:text-5xl">
                Your Retirement Overview
              </h1>
              <p className="mt-4 text-lg text-slate-500">
                Based on retiring at <strong className="font-medium text-slate-700">{inputs.retirementAge}</strong> with <strong className="font-medium text-slate-700">${inputs.currentSavings.toLocaleString()}</strong> in current savings.
              </p>
            </div>
            <button
              onClick={handleDownloadPDF}
              className="group inline-flex items-center gap-2.5 rounded-2xl bg-slate-900 px-6 py-3.5 text-sm font-medium text-white shadow-lg shadow-slate-900/20 transition-all hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-900/30 active:translate-y-0"
            >
              <svg className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Download Report
            </button>
          </div>

          <div ref={reportRef} className="space-y-8 bg-[#fafbfc] pb-8">

            {/* Top Summary Cards */}
            <div className="grid gap-5 md:grid-cols-3">
              {/* Typical Card */}
              <div className="relative overflow-hidden rounded-3xl border border-slate-200/60 bg-white p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-medium text-slate-500">Typical Scenario</h3>
                  </div>
                  <StatusBadge depletionAge={typical.depletionAge} lifeExpectancy={inputs.lifeExpectancy} />
                </div>
                <div className="mt-2">
                  {typical.depletionAge ? (
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold tracking-tight text-rose-600">Age {typical.depletionAge}</span>
                      <span className="text-sm font-medium text-slate-400">depletion</span>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-normal tracking-tight text-slate-900">{formatCurrency(typical.finalBalance)}</span>
                      <span className="text-sm font-medium text-slate-400">final balance</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Downside Card */}
              <div className="relative overflow-hidden rounded-3xl border border-slate-200/60 bg-white p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-medium text-slate-500">Downside Scenario</h3>
                  </div>
                </div>
                <div className="mt-2">
                  {downside.depletionAge ? (
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold tracking-tight text-rose-600">Age {downside.depletionAge}</span>
                      <span className="text-sm font-medium text-slate-400">depletion</span>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-normal tracking-tight text-slate-900">{formatCurrency(downside.finalBalance)}</span>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-amber-600">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-100">↓</span>
                  Return at {inputs.expectedReturn - 2}%
                </div>
              </div>

              {/* Upside Card */}
              <div className="relative overflow-hidden rounded-3xl border border-slate-200/60 bg-white p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-medium text-slate-500">Upside Scenario</h3>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-normal tracking-tight text-slate-900">{formatCurrency(upside.finalBalance)}</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100">↑</span>
                  Return at {inputs.expectedReturn + 2}%
                </div>
              </div>
            </div>

            {/* Main Chart Section */}
            <div className="rounded-3xl border border-slate-200/60 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-8">
              <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Savings Trajectory</h2>
                  <p className="mt-1 text-sm text-slate-500">Projected portfolio balance over time across different market conditions.</p>
                </div>
                <div className="flex items-center gap-4 rounded-full bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
                  <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-indigo-500"></span> Typical</div>
                  <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-emerald-400"></span> Upside</div>
                  <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-amber-400"></span> Downside</div>
                </div>
              </div>

              <div className="h-[450px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorTypical" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorUpside" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#34d399" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
                    <XAxis
                      dataKey="age"
                      tick={{ fontSize: 13, fill: "#94a3b8", fontWeight: 500 }}
                      tickLine={false}
                      axisLine={false}
                      dy={10}
                      minTickGap={20}
                    />
                    <YAxis
                      tickFormatter={(v) => formatCurrency(v)}
                      tick={{ fontSize: 13, fill: "#94a3b8", fontWeight: 500 }}
                      tickLine={false}
                      axisLine={false}
                      dx={-10}
                      width={80}
                    />
                    <Tooltip
                      formatter={(value: number | undefined, name: string | undefined) => [
                        value ? `$${value.toLocaleString()}` : "",
                        name ? <span key={name} className="font-medium text-slate-700">{name}</span> : "",
                        <span key={name} className="font-medium text-slate-700">{name}</span>
                      ]}
                      labelFormatter={(label) => <span className="font-medium text-slate-900">Age {label}</span>}
                      contentStyle={{
                        borderRadius: '16px',
                        border: 'none',
                        boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)',
                        padding: '12px 16px',
                        fontFamily: "'Plus Jakarta Sans', sans-serif"
                      }}
                      itemStyle={{ padding: '4px 0' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="Upside"
                      stroke="#34d399"
                      strokeWidth={2}
                      fill="url(#colorUpside)"
                      dot={false}
                      activeDot={{ r: 6, strokeWidth: 0, fill: '#34d399' }}
                      connectNulls
                    />
                    <Area
                      type="monotone"
                      dataKey="Typical"
                      stroke="#6366f1"
                      strokeWidth={3}
                      fill="url(#colorTypical)"
                      dot={false}
                      activeDot={{ r: 6, strokeWidth: 0, fill: '#6366f1' }}
                      connectNulls
                    />
                    <Line
                      type="monotone"
                      dataKey="Downside"
                      stroke="#fbbf24"
                      strokeWidth={2}
                      strokeDasharray="6 6"
                      dot={false}
                      activeDot={{ r: 6, strokeWidth: 0, fill: '#fbbf24' }}
                      connectNulls
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              {/* Inputs Summary */}
              <div className="rounded-3xl border border-slate-200/60 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] lg:col-span-1">
                <h2 className="mb-6 text-lg font-bold text-slate-900">Your Profile</h2>
                <div className="flex flex-col gap-4">
                  {[
                    { label: "Current Age", value: `${inputs.currentAge} yrs`, icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
                    { label: "Retirement Age", value: `${inputs.retirementAge} yrs`, icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
                    { label: "Life Expectancy", value: `${inputs.lifeExpectancy} yrs`, icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" },
                    { label: "Current Savings", value: `$${inputs.currentSavings.toLocaleString()}`, icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
                    { label: "Monthly Spend", value: `$${inputs.monthlySpending.toLocaleString()}`, icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" },
                    { label: "Expected Return", value: `${inputs.expectedReturn}%`, icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" },
                  ].map((item, idx) => (
                    <div key={item.label} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 transition-colors hover:bg-slate-100/80">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-slate-500">{item.label}</span>
                      </div>
                      <span className="text-sm font-bold text-slate-900">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Improvements & AI */}
              <div className="flex flex-col gap-8 lg:col-span-2">
                <div className="rounded-3xl border border-slate-200/60 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-8">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-slate-900">Optimization Scenarios</h2>
                    <p className="mt-1 text-sm text-slate-500">Discover how small adjustments can significantly extend your portfolio&apos;s longevity.</p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {improvements.map((imp, i) => (
                      <div
                        key={i}
                        className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/50 p-5 transition-all hover:border-indigo-100 hover:bg-indigo-50/30 hover:shadow-md hover:shadow-indigo-100/50"
                      >
                        <div className="mb-3 flex items-start justify-between gap-3">
                          <h3 className="font-medium text-slate-800">{imp.title}</h3>
                          {imp.yearsGained > 0 ? (
                            <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">
                              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                              {imp.yearsGained} yrs
                            </span>
                          ) : (
                            <span className="whitespace-nowrap rounded-full bg-slate-200/60 px-2.5 py-1 text-xs font-medium text-slate-500">
                              No change
                            </span>
                          )}
                        </div>
                        <p className="text-sm leading-relaxed text-slate-500">{imp.description}</p>
                        <div className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-400">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          {imp.depletionAge
                            ? `Lasts until age ${imp.depletionAge}`
                            : "Lasts through life expectancy"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {aiSuggestions && (
                  <div className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 shadow-sm sm:p-8">
                    <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-indigo-400/10 blur-3xl"></div>
                    <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-purple-400/10 blur-3xl"></div>

                    <div className="relative">
                      <div className="mb-5 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">AI Insights</h2>
                      </div>
                      <div
                        className="prose prose-sm max-w-none text-slate-600 prose-p:leading-relaxed prose-strong:text-indigo-900 prose-li:marker:text-indigo-400 prose-a:text-indigo-700 prose-a:no-underline hover:prose-a:text-indigo-800 hover:prose-a:underline"
                        dangerouslySetInnerHTML={{ __html: renderedAiSuggestions }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
