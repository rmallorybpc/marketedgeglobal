import { useEffect, useRef, useState } from "react";
import { sendMessage, type ChatMessage } from "../lib/openai";

type PageProps = {
  onOpenChat?: () => void;
};

export function GetStartedPage({ onOpenChat }: PageProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm here to help you with your organization's communications. Ask me anything about messaging, storytelling, or explaining your work to donors and partners.",
    },
  ]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const messageEndRef = useRef<HTMLDivElement | null>(null);

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

    try {
      const reply = await sendMessage(inputValue.trim());
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unexpected error";
      setErrorMessage(message);
    } finally {
      setIsSending(false);
    }
  };

  const openChat = () => {
    setIsChatOpen(true);
    onOpenChat?.();
  };

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="space-y-8">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Getting Started
          </p>
          <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
            Get Started Now
          </h1>
          <p className="mt-4 text-lg text-slate-300">
            Explore our tools and chat with our communications coach to help you explain your work
            clearly and build trust with your supporters.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h3 className="text-lg font-semibold">AI Analytics</h3>
            <p className="mt-3 text-sm text-slate-400">
              Leverage our agents trained in advanced analytics for data-driven insights, streamlining
              decision-making and program effectiveness.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h3 className="text-lg font-semibold">Learning Companion</h3>
            <p className="mt-3 text-sm text-slate-400">
              Enhance learning through AI-powered guidance, interactive simulations, and tailored
              learning pathways.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h3 className="text-lg font-semibold">Task Assistant Automations</h3>
            <p className="mt-3 text-sm text-slate-400">
              Optimize workflows and improve productivity with AI-driven assistants for key
              organizational tasks.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h3 className="text-lg font-semibold">Rapid Diagnostics</h3>
            <p className="mt-3 text-sm text-slate-400">
              Gain comprehensive assessments of organizational capacity and performance for strategic
              growth and impact.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8">
          <h2 className="text-2xl font-semibold">Need help with your messaging?</h2>
          <p className="mt-3 text-slate-400">
            Our communications coach can help you explain your work simply and clearly so donors,
            partners, and supporters understand and trust what you do.
          </p>
          <button
            className="mt-6 rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold hover:bg-indigo-600"
            onClick={openChat}
          >
            Chat with Coach
          </button>
        </div>
      </div>

      {isChatOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm">
          <div className="absolute bottom-6 right-6 flex w-[min(420px,90vw)] flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
              <div>
                <div className="text-sm font-semibold">Communications Coach</div>
                <div className="text-xs text-slate-400">Ask about messaging and storytelling.</div>
              </div>
              <button
                className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300 hover:text-slate-100"
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
                  placeholder="Ask the coach..."
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      void handleSend();
                    }
                  }}
                />
                <button
                  className="rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold hover:bg-indigo-600 disabled:opacity-50"
                  onClick={() => void handleSend()}
                  disabled={isSending}
                >
                  {isSending ? "..." : "Send"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
