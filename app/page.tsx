import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero */}
      <section className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 pt-16">
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-teal-100 to-emerald-50 opacity-60 blur-3xl" />
          <div className="absolute -bottom-20 -left-40 h-[400px] w-[400px] rounded-full bg-gradient-to-tr from-blue-50 to-teal-50 opacity-40 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-600 text-xl font-bold text-white shadow-xl shadow-teal-600/20">
            R
          </div>

          <h1 className="text-5xl font-bold leading-tight tracking-tight text-slate-900 sm:text-6xl">
            Know exactly when
            <br />
            <span className="bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">
              your money runs out
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-500">
            Plan your retirement with clarity. Enter your financial details, get instant projections
            across multiple scenarios, and receive AI-powered strategies to extend your savings.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/register"
              className="rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-600/25 transition-all hover:shadow-xl hover:shadow-teal-600/30"
            >
              Get Started — It&apos;s Free
            </Link>
            <Link
              href="/login"
              className="rounded-xl border border-slate-200 bg-white px-8 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Feature cards */}
        <div className="relative z-10 mx-auto mt-24 grid max-w-4xl gap-6 pb-20 sm:grid-cols-3">
          {[
            {
              title: "Multi-Scenario Projections",
              desc: "See typical, downside, and upside scenarios with interactive charts showing your savings trajectory.",
              icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              ),
            },
            {
              title: "AI-Powered Insights",
              desc: "Get personalized, actionable strategies powered by AI to optimize your retirement plan.",
              icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                </svg>
              ),
            },
            {
              title: "Free PDF Report",
              desc: "Download a comprehensive retirement strategy report with all your projections and recommendations.",
              icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              ),
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-slate-200/80 bg-white/70 p-6 backdrop-blur-sm transition-all hover:border-teal-200 hover:shadow-lg hover:shadow-teal-100/50"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600 transition-colors group-hover:bg-teal-100">
                {feature.icon}
              </div>
              <h3 className="text-sm font-semibold text-slate-900">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
