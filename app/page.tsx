import Link from "next/link";

export default function Home() {
  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}} />
      <div className="flex min-h-screen flex-col bg-[#fafbfc] font-jakarta selection:bg-indigo-100 selection:text-indigo-900">



        {/* Hero Section */}
        <section className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 pt-32 sm:pt-40">

          {/* Ambient Background Glows */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -right-[10%] -top-[10%] h-[600px] w-[600px] rounded-full bg-indigo-200/40 blur-[100px]" />
            <div className="absolute -bottom-[10%] -left-[10%] h-[600px] w-[600px] rounded-full bg-emerald-200/30 blur-[100px]" />
            <div className="absolute left-[20%] top-[20%] h-[300px] w-[300px] rounded-full bg-purple-200/30 blur-[80px]" />
          </div>

          <div className="relative z-10 mx-auto max-w-4xl text-center">

            {/* Pill Badge */}
            <div className="mx-auto mb-8 inline-flex items-center gap-2.5 rounded-full border border-indigo-100 bg-indigo-50/50 px-4 py-1.5 text-sm font-medium text-indigo-700 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500"></span>
              </span>
              AI-Powered Projections
            </div>

            {/* Headline */}
            <h1 className="text-5xl font-normal leading-[1.1] tracking-tight text-slate-900 sm:text-7xl">
              Know exactly when
              <br />
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-emerald-600 via-emerald-800 to-emerald-500 bg-clip-text text-transparent">
                  your money runs out.
                </span>
              </span>
            </h1>

            {/* Subheadline */}
            <p className="mx-auto mt-8 max-w-2xl text-lg font-medium leading-relaxed text-slate-500 sm:text-xl">
              Plan your future with absolute clarity. Input your financials, instantly view multi-scenario projections, and get personalized AI strategies to extend your savings.
            </p>

            {/* CTAs */}
            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
              <Link
                href="/login"
                className="group relative flex w-full items-center justify-center gap-2.5 rounded-2xl bg-slate-900 px-8 py-4 text-base font-medium text-white shadow-xl shadow-slate-900/20 transition-all hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-2xl hover:shadow-slate-900/30 sm:w-auto"
              >
                <span>Start Planning for Free</span>
                <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link
                href="/calculator"
                className="flex w-full items-center justify-center rounded-2xl border-2 border-slate-200/80 bg-white/50 px-8 py-4 text-base font-medium text-slate-700 backdrop-blur-sm transition-all hover:border-slate-300 hover:bg-white sm:w-auto"
              >
                Try the Calculator
              </Link>
            </div>

            <p className="mt-6 text-sm font-medium text-slate-400">No credit card required • Setup takes 2 minutes</p>
          </div>

          {/* Feature Cards */}
          <div className="relative z-10 mx-auto mt-28 grid max-w-6xl gap-6 pb-24 sm:grid-cols-3">
            {[
              {
                title: "Multi-Scenario Modeling",
                desc: "Visualize typical, downside, and upside market conditions with beautiful interactive charts.",
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                ),
                color: "indigo"
              },
              {
                title: "AI-Powered Insights",
                desc: "Receive highly personalized, actionable strategies to optimize and extend your retirement runway.",
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                  </svg>
                ),
                color: "purple"
              },
              {
                title: "Exportable Reports",
                desc: "Download a beautiful, comprehensive PDF report of your strategy to share with your advisor or spouse.",
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                ),
                color: "emerald"
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-3xl border border-slate-200/60 bg-white/60 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)]"
              >
                <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-${feature.color}-50 text-${feature.color}-600 transition-transform group-hover:scale-110`}>
                  {feature.icon}
                </div>
                <h3 className="mb-3 text-xl font-medium text-slate-900">{feature.title}</h3>
                <p className="text-base font-medium leading-relaxed text-slate-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
