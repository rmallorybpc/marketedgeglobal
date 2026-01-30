const features = [
  {
    title: "Market intelligence",
    description:
      "Track trends, compare performance, and spot opportunities across regions and segments.",
  },
  {
    title: "Operational insights",
    description:
      "Monitor key metrics with clear dashboards and actionable summaries.",
  },
  {
    title: "Secure collaboration",
    description:
      "Share insights across teams with role-based access and audit-friendly workflows.",
  },
];

const stats = [
  { label: "Regions covered", value: "45+" },
  { label: "Weekly reports", value: "120+" },
  { label: "Data points", value: "2.4M" },
];

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <div className="text-lg font-semibold tracking-wide">MarketEdge Global</div>
          <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
            <a className="hover:text-white" href="#features">
              Features
            </a>
            <a className="hover:text-white" href="#insights">
              Insights
            </a>
            <a className="hover:text-white" href="#contact">
              Contact
            </a>
          </nav>
          <button className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900">
            Request demo
          </button>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              Market Intelligence Platform
            </p>
            <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
              Make faster, smarter decisions with real-time market visibility.
            </h1>
            <p className="text-lg text-slate-300">
              MarketEdge Global helps teams unify reporting, track competitive movement, and
              turn complex data into clear action plans.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold">
                Get started
              </button>
              <button className="rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-200">
                Explore platform
              </button>
            </div>
            <div className="flex flex-wrap gap-6 pt-6">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-semibold">{stat.value}</div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-8">
            <div className="space-y-6">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Live snapshot</p>
                <h2 className="text-2xl font-semibold">Regional performance</h2>
              </div>
              <div className="space-y-4">
                {[
                  { name: "North America", value: "$4.2M", change: "+12%" },
                  { name: "EMEA", value: "$3.1M", change: "+9%" },
                  { name: "APAC", value: "$2.7M", change: "+15%" },
                ].map((row) => (
                  <div
                    key={row.name}
                    className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3"
                  >
                    <div>
                      <div className="text-sm font-medium">{row.name}</div>
                      <div className="text-xs text-slate-500">Weekly total</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">{row.value}</div>
                      <div className="text-xs text-emerald-400">{row.change}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="border-t border-slate-900 bg-slate-950/60">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <div className="mb-10 max-w-2xl">
              <h2 className="text-3xl font-semibold">Everything your team needs</h2>
              <p className="mt-3 text-slate-400">
                Bring data, research, and market signals together in one workspace.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.title} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-3 text-sm text-slate-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="insights" className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Insight feed</p>
              <h3 className="mt-3 text-2xl font-semibold">Daily highlights</h3>
              <ul className="mt-6 space-y-4 text-sm text-slate-300">
                <li>• 18 new opportunities flagged across enterprise accounts.</li>
                <li>• Competitive pricing shifted in 3 priority segments.</li>
                <li>• Product adoption rate up 7% week-over-week.</li>
              </ul>
            </div>
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                <h4 className="text-lg font-semibold">Executive-ready reporting</h4>
                <p className="mt-2 text-sm text-slate-400">
                  Generate client-ready briefings with automated narratives and visual summaries.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                <h4 className="text-lg font-semibold">Integrated data sources</h4>
                <p className="mt-2 text-sm text-slate-400">
                  Connect CRM, analytics, and custom sources into one trusted view.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                <h4 className="text-lg font-semibold">Automated alerts</h4>
                <p className="mt-2 text-sm text-slate-400">
                  Stay ahead with alerts for pricing moves, emerging competitors, and demand shifts.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="border-t border-slate-900 bg-slate-950/60">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-10 text-center">
              <h2 className="text-3xl font-semibold">Ready to see MarketEdge Global in action?</h2>
              <p className="mt-3 text-slate-400">
                Tell us about your team and we will tailor a walkthrough to your goals.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                <button className="rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold">
                  Schedule a demo
                </button>
                <button className="rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-200">
                  Contact sales
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-900">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <span>© 2026 MarketEdge Global. All rights reserved.</span>
          <div className="flex gap-6">
            <span>Privacy</span>
            <span>Terms</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
