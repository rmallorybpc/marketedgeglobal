import { useEffect, useRef, useState } from "react";

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
              <a
                className="rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold"
                href={`${import.meta.env.BASE_URL}get-started/`}
              >
                Get started
              </a>
              <a
                className="rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-200"
                href={`${import.meta.env.BASE_URL}explore-platform/bd-assistant/`}
              >
                Explore platform
              </a>
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

        <section id="bd-assistant" className="border-t border-slate-900 bg-slate-950/60">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-center">
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">BD Assistant</p>
                <h3 className="text-3xl font-semibold">Accelerate business development with AI</h3>
                <p className="text-sm text-slate-400">
                  Ask the BD Assistant for regional insights, account briefs, and competitive positioning.
                </p>
                <button
                  className="rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold"
                  onClick={() => setIsChatOpen(true)}
                >
                  Open BD Assistant
                </button>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8">
                <ul className="space-y-4 text-sm text-slate-300">
                  <li>• Draft outreach notes and call prep in seconds.</li>
                  <li>• Compare segment performance by region or vertical.</li>
                  <li>• Summarize shifts in pricing and competitive moves.</li>
                </ul>
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
    </div>
  );
}

export default App;
