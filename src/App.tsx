import { type ReactNode, useEffect, useRef, useState } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";

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

type ChatMessage = { role: "user" | "assistant"; content: string };

type PageProps = {
  onOpenChat: () => void;
};

function ExplorePlatformPage({ onOpenChat }: PageProps) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="grid gap-10 md:grid-cols-[1.05fr_0.95fr] md:items-center">
        <div className="space-y-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Explore Platform</p>
          <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
            Explore MarketEdge capabilities
          </h1>
          <p className="text-lg text-slate-300">
            Review the platform highlights and open the BD Assistant when you need real-time support.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              className="rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold"
              onClick={onOpenChat}
            >
              Open BD Assistant
            </button>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8">
          <ul className="space-y-4 text-sm text-slate-300">
            <li>• Generate briefs for high-priority accounts.</li>
            <li>• Compare segment performance across regions.</li>
            <li>• Summarize competitive shifts in minutes.</li>
          </ul>
        </div>
      </div>
      <div className="mt-12 grid gap-10 md:grid-cols-[1.05fr_0.95fr] md:items-start">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Ranking Tool</p>
          <h2 className="text-2xl font-semibold">Compare value chains</h2>
          <p className="text-sm text-slate-300">
            Compares value chains such as climate‑smart rice, shrimp, and bananas, highlighting relative strengths and
            weaknesses.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              className="rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold"
              to="/explore-platform/ranking-tool/"
            >
              Open Ranking Tool
            </Link>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8">
          <ul className="space-y-3 text-sm text-slate-300">
            <li>• Assess potential to generate income.</li>
            <li>• Evaluate support for vulnerable groups.</li>
            <li>• Measure sustainability contributions.</li>
            <li>• Surface near‑term opportunities for improvement.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function HomePage() {
  return (
    <>
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
            <a
              className="rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold"
              href={`${import.meta.env.BASE_URL}get-started/`}
            >
              Get started
            </a>
            <Link
              className="rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-200"
              to="/explore-platform/"
            >
              Explore platform
            </Link>
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
    </>
  );
}

function FeaturesPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div className="space-y-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Platform features</p>
            <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
              Everything your team needs to move faster.
            </h1>
            <p className="text-lg text-slate-300">
              Unify market signals, automate reporting, and act on real-time intelligence across regions.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                className="rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold"
                href={`${import.meta.env.BASE_URL}get-started/`}
              >
                Get started
              </a>
              <Link
                className="rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-200"
                to="/"
              >
                Back to overview
              </Link>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8">
            <div className="space-y-4 text-sm text-slate-300">
              <div className="flex items-center justify-between">
                <span>Weekly insight refresh</span>
                <span className="font-semibold text-emerald-400">+32%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Automated report time saved</span>
                <span className="font-semibold text-emerald-400">18 hrs</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Coverage across segments</span>
                <span className="font-semibold text-emerald-400">14</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-900 bg-slate-950/60">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="mb-10 max-w-2xl">
            <h2 className="text-3xl font-semibold">Core capabilities</h2>
            <p className="mt-3 text-slate-400">
              From discovery to executive reporting, MarketEdge Global keeps every stakeholder aligned.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6"
              >
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="mt-3 text-sm text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Automation</p>
            <h3 className="mt-3 text-2xl font-semibold">Reporting without the rush</h3>
            <ul className="mt-6 space-y-4 text-sm text-slate-300">
              <li>• Auto-generate weekly and quarterly briefings.</li>
              <li>• Standardize visuals across regions and teams.</li>
              <li>• Export slides and summaries in one click.</li>
            </ul>
          </div>
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <h4 className="text-lg font-semibold">Competitive intelligence</h4>
              <p className="mt-2 text-sm text-slate-400">
                Track pricing, positioning, and share-of-wallet shifts with continuous updates.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <h4 className="text-lg font-semibold">Segment dashboards</h4>
              <p className="mt-2 text-sm text-slate-400">
                Slice insights by region, vertical, or account tier for fast prioritization.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <h4 className="text-lg font-semibold">Governed collaboration</h4>
              <p className="mt-2 text-sm text-slate-400">
                Share insights securely with role-based controls and audit-ready workflows.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-900 bg-slate-950/60">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-10 text-center">
            <h2 className="text-3xl font-semibold">See the full feature set in action</h2>
            <p className="mt-3 text-slate-400">
              Schedule a guided walkthrough tailored to your regions and reporting cadence.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <button className="rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold">
                Schedule a demo
              </button>
              <Link
                className="rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-200"
                to="/explore-platform/"
              >
                Explore platform
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <Link className="text-lg font-semibold tracking-wide" to="/">
            MarketEdge Global
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
            <Link className="hover:text-white" to="/features/">
              Features
            </Link>
            <a className="hover:text-white" href={`${import.meta.env.BASE_URL}#insights`}>
              Insights
            </a>
            <Link className="hover:text-white" to="/explore-platform/">
              Explore platform
            </Link>
            <a className="hover:text-white" href={`${import.meta.env.BASE_URL}#contact`}>
              Contact
            </a>
          </nav>
          <button className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900">
            Request demo
          </button>
        </div>
      </header>

      <main>{children}</main>

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

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi! I’m the MarketEdge BD Assistant. Ask me about regions, accounts, or competitive trends.",
    },
  ]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  const agentEndpoint = import.meta.env.VITE_AGENT_API_URL as string | undefined;

  useEffect(() => {
    if (!isChatOpen) {
      return;
    }
    inputRef.current?.focus();
  }, [isChatOpen]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isChatOpen]);

  const handleSend = async () => {
    if (!inputValue.trim() || isSending) {
      return;
    }

    const userMessage: ChatMessage = { role: "user", content: inputValue.trim() };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInputValue("");
    setIsSending(true);
    setErrorMessage(null);

    if (!agentEndpoint) {
      setIsSending(false);
      setErrorMessage("Agent endpoint not configured. Set VITE_AGENT_API_URL to your API URL.");
      return;
    }

    try {
      const response = await fetch(agentEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (!response.ok) {
        throw new Error(`Request failed (${response.status})`);
      }

      const data = (await response.json()) as { reply?: string };
      const replyText = data.reply ?? "Sorry, I couldn’t generate a reply.";
      setMessages((prev) => [...prev, { role: "assistant", content: replyText }]);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unexpected error";
      setErrorMessage(message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/features/" element={<FeaturesPage />} />
          <Route
            path="/explore-platform/"
            element={<ExplorePlatformPage onOpenChat={() => setIsChatOpen(true)} />}
          />
        </Routes>
      </Layout>

      {isChatOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm">
          <div className="absolute bottom-6 right-6 flex w-[min(420px,90vw)] flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
              <div>
                <div className="text-sm font-semibold">MarketEdge BD Assistant</div>
                <div className="text-xs text-slate-400">Ask about accounts, regions, or strategy.</div>
              </div>
              <button
                className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300"
                onClick={() => setIsChatOpen(false)}
              >
                Close
              </button>
            </div>
            <div className="flex max-h-[50vh] flex-1 flex-col gap-4 overflow-y-auto px-5 py-4 text-sm">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-indigo-500 text-white"
                        : "bg-slate-900 text-slate-200"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              <div ref={messageEndRef} />
            </div>
            {errorMessage && (
              <div className="border-t border-slate-800 px-5 py-2 text-xs text-rose-400">
                {errorMessage}
              </div>
            )}
            <div className="border-t border-slate-800 p-4">
              <div className="flex items-center gap-3">
                <input
                  ref={inputRef}
                  className="flex-1 rounded-full border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-slate-100 outline-none focus:border-indigo-500"
                  placeholder="Ask the BD Assistant..."
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      void handleSend();
                    }
                  }}
                />
                <button
                  className="rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold"
                  onClick={() => void handleSend()}
                  disabled={isSending}
                >
                  {isSending ? "Sending..." : "Send"}
                </button>
              </div>
              <p className="mt-2 text-[11px] text-slate-500">
                Set VITE_AGENT_API_URL to your backend endpoint (e.g. https://api.yourdomain.com/agent).
              </p>
            </div>
          </div>
        </div>
      )}
    </BrowserRouter>
  );
}

export default App;
