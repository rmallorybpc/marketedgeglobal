import { useEffect, useRef, useState } from "react";
import { sendMessage, type ChatMessage } from "../lib/openai";

type PageProps = {};

interface AttachedFile {
  name: string;
  size: number;
}

export function GetStartedPage(_: PageProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentAssistantId, setCurrentAssistantId] = useState<string | null>(
    import.meta.env.VITE_OPENAI_ASSISTANT_ID ?? null
  );
  const [currentAssistantName, setCurrentAssistantName] = useState<string>(
    "Coms Support Coach"
  );
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm your Coms Support Coach. Ask me anything about messaging, storytelling, or explaining your work to donors and partners. You can also attach files like documents or images for me to review.",
    },
  ]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles: AttachedFile[] = Array.from(files).map((file) => ({
        name: file.name,
        size: file.size,
      }));
      setAttachedFiles((prev) => [...prev, ...newFiles]);
    }
    // Reset input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isSending) {
      return;
    }

    let messageText = inputValue.trim();
    if (attachedFiles.length > 0) {
      messageText += `\n\n[Attachments: ${attachedFiles.map((f) => f.name).join(", ")}]`;
    }

    const userMessage: ChatMessage = { role: "user", content: messageText };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInputValue("");
    setAttachedFiles([]);
    setIsSending(true);
    setErrorMessage(null);

    try {
      if (!currentAssistantId) {
        throw new Error("No assistant selected");
      }
      const reply = await sendMessage(messageText, currentAssistantId);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unexpected error";
      setErrorMessage(message);
    } finally {
      setIsSending(false);
    }
  };

  

  const openAssistant = (id: string | null, name: string) => {
    setCurrentAssistantId(id);
    setCurrentAssistantName(name);
    // Set initial messages per assistant so previews match the selected agent
    const financialId = import.meta.env.VITE_OPENAI_FINANCIAL_ASSISTANT_ID ?? 'asst_2BNcG5OJXbPfhDmCadhC7aGM';
    const operationsId = import.meta.env.VITE_OPENAI_OPERATIONS_ASSISTANT_ID ?? 'asst_pGMkUNldDi6EXOQKvpM26Gtb';
    const bdId = import.meta.env.VITE_OPENAI_BD_ASSISTANT_ID ?? 'asst_yzDWzTYPE7bJf4vbqQlklmiP';
    const publicationId = import.meta.env.VITE_OPENAI_PUBLICATION_ASSISTANT_ID ?? 'asst_Nctx1jt9HAMfvAp99cfpxNXU';
    const ramiroId = import.meta.env.VITE_OPENAI_RAMIRO_ASSISTANT_ID ?? 'asst_LwQ63jo5RMN3WTwMeSnTRbun';
    let initialMessages: ChatMessage[] = [];
    if (name === "Coms Support Coach" || id === import.meta.env.VITE_OPENAI_ASSISTANT_ID) {
      initialMessages = [
        {
          role: "assistant",
          content:
            "Hi! I'm your Coms Support Coach. Ask me anything about messaging, storytelling, or explaining your work to donors and partners. You can also attach files like documents or images for me to review.",
        },
      ];
    } else if (name === "Financial Management Help" || id === financialId) {
      initialMessages = [
        {
          role: "assistant",
          content:
            "Hello — I'm here to help with financial management, budgeting, and reporting. Ask about forecasts, cashflow, expense categorization, or attach financial documents for review.",
        },
      ];
    } else if (name === "Operations Systems" || id === operationsId) {
      initialMessages = [
        {
          role: "assistant",
          content:
            "Hi — I'm the Operations Systems assistant. I can help with system architecture, deployments, monitoring, integrations, runbooks, and automations. Attach diagrams, configs, or logs and I'll review them.",
        },
      ];
    } else if (name === "Business Development Support" || id === bdId) {
      initialMessages = [
        {
          role: "assistant",
          content:
            "Hello — I'm the Business Development Support assistant. I can help with partnership outreach, proposal framing, market research, and engagement strategies. Attach briefs or partner info and I'll provide recommendations.",
        },
      ];
    }
    else if (name === "Publication Review Support" || id === publicationId) {
      initialMessages = [
        {
          role: "assistant",
          content:
            "Hello — I'm Publication Review Support. I can help review drafts, check structure, suggest edits for clarity and academic tone, and verify references and formatting. Attach manuscripts, figures, or reviewer comments and I'll assist.",
        },
      ];
    }
    else if (name === "Ramiro - The Bolivian Rancher" || id === ramiroId) {
      initialMessages = [
        {
          role: "assistant",
          content:
            "Hola — I'm Ramiro, the Bolivian Rancher. I can role-play local stakeholder perspectives about land use, livestock, community priorities, and traditional practices. Ask me about local constraints, cultural context, or attach field notes and I'll respond as Ramiro.",
        },
      ];
    }
    
    setMessages(initialMessages);
    setIsChatOpen(true);
  };

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="space-y-8">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">PartnerAI™</p>
          <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
            AI that turns insight into action across complex social impact systems
          </h1>
          <p className="mt-4 text-lg text-slate-300 max-w-3xl">
            PartnerAI™ is a proprietary, trademarked AI platform developed and owned by MarketEdge. It embeds AI directly into delivery, portfolio management, and decision-making workflows for social impact organizations operating across multiple stakeholders, incentives, and reporting demands.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h3 className="text-lg font-semibold">AI Analytics</h3>
            <p className="mt-3 text-sm text-slate-400">
              Leverage our agents trained in advanced analytics for data-driven insights, streamlining
              decision-making and program effectiveness.
            </p>
            <div className="mt-4">
              <button
                className="rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold hover:bg-violet-700"
                onClick={() => openAssistant(import.meta.env.VITE_OPENAI_PUBLICATION_ASSISTANT_ID ?? 'asst_Nctx1jt9HAMfvAp99cfpxNXU', "Publication Review Support")}
              >
                Chat with Publication Review Support
              </button>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h3 className="text-lg font-semibold">Practice Engaging Stakeholders</h3>
            <p className="mt-3 text-sm text-slate-400">
              Enhance learning through AI-powered guidance, interactive simulations, and tailored
              learning pathways.
            </p>
            <div className="mt-4">
              <button
                className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold hover:bg-rose-600"
                onClick={() => openAssistant(import.meta.env.VITE_OPENAI_RAMIRO_ASSISTANT_ID ?? 'asst_LwQ63jo5RMN3WTwMeSnTRbun', "Ramiro - The Bolivian Rancher")}
              >
                Chat with Ramiro — The Bolivian Rancher
              </button>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h3 className="text-lg font-semibold">Task Assistant Automations</h3>
            <p className="mt-3 text-sm text-slate-400">
              Optimize workflows and improve productivity with AI-driven assistants for key
              organizational tasks.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                className="rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold hover:bg-indigo-600"
                onClick={() => openAssistant(import.meta.env.VITE_OPENAI_ASSISTANT_ID ?? null, "Coms Support Coach")}
              >
                Chat with Coms Support Coach
              </button>

              <button
                className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold hover:bg-emerald-700"
                onClick={() => openAssistant(import.meta.env.VITE_OPENAI_FINANCIAL_ASSISTANT_ID ?? 'asst_2BNcG5OJXbPfhDmCadhC7aGM', "Financial Management Help")}
              >
                Chat with Financial Management Help
              </button>
              
              <button
                className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold hover:bg-sky-600"
                onClick={() => openAssistant(import.meta.env.VITE_OPENAI_OPERATIONS_ASSISTANT_ID ?? 'asst_pGMkUNldDi6EXOQKvpM26Gtb', "Operations Systems")}
              >
                Chat with Operations Systems
              </button>
              
              <button
                className="rounded-full bg-yellow-500 px-4 py-2 text-sm font-semibold hover:bg-yellow-600"
                onClick={() => openAssistant(import.meta.env.VITE_OPENAI_BD_ASSISTANT_ID ?? 'asst_yzDWzTYPE7bJf4vbqQlklmiP', "Business Development Support")}
              >
                Chat with Business Development Support
              </button>
            </div>
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
          <h2 className="text-2xl font-semibold">About PartnerAI™</h2>

          <h3 className="mt-6 text-lg font-semibold">Why PartnerAI™</h3>
          <p className="mt-2 text-slate-400">
            Social impact organizations operate under tight constraints. Teams juggle delivery, partnerships, learning, and accountability across funders, coordinating entities, and local implementers. PartnerAI™ addresses this gap with a single, integrated operating environment that supports different users without flattening their needs.
          </p>

          <h3 className="mt-6 text-lg font-semibold">What Makes PartnerAI™ Different</h3>
          <ul className="mt-3 list-disc list-inside text-slate-400">
            <li className="mt-2"><strong>Embedded, not layered:</strong> integrates into existing workflows rather than adding parallel tools.</li>
            <li className="mt-2"><strong>Human-led, decision-focused:</strong> amplifies expert judgment and delivers decision-ready outputs.</li>
            <li className="mt-2"><strong>Built for multi-actor systems:</strong> serves funders, coordinating bodies, and implementers while respecting distinct decision rights.</li>
            <li className="mt-2"><strong>Proven in delivery:</strong> used across real engagements for market assessments, partnership design, and portfolio oversight.</li>
          </ul>
        </div>
      </div>

      {isChatOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="flex w-full max-w-2xl h-[80vh] flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
              <div>
                <div className="text-lg font-semibold">{currentAssistantName}</div>
                <div className="text-sm text-slate-400">Ask about messaging, finance, or workflows. Attach files for review.</div>
              </div>
              <button
                className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300 hover:text-slate-100"
                onClick={() => setIsChatOpen(false)}
              >
                Close
              </button>
            </div>
            <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-4 text-sm">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${
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
              <div className="border-t border-slate-800 px-6 py-3 text-sm text-rose-400">
                {errorMessage}
              </div>
            )}
            {attachedFiles.length > 0 && (
              <div className="border-t border-slate-800 px-6 py-3">
                <div className="text-xs text-slate-400 mb-2">Attached files:</div>
                <div className="space-y-2">
                  {attachedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-slate-900 rounded-lg px-3 py-2">
                      <div className="text-sm text-slate-300">
                        <span className="truncate max-w-xs">{file.name}</span>
                        <span className="text-xs text-slate-500 ml-2">({(file.size / 1024).toFixed(1)} KB)</span>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-slate-400 hover:text-rose-400 ml-2"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="border-t border-slate-800 p-4">
              <div className="flex items-center gap-2 mb-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  accept=".txt,.pdf,.doc,.docx,.xls,.xlsx,.csv,.jpg,.jpeg,.png,.gif"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-full border border-slate-600 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-900"
                  title="Attach files (PDF, Word, Excel, images, etc.)"
                >
                  📎 Attach
                </button>
              </div>
              <div className="flex items-center gap-3">
                <input
                  ref={inputRef}
                  className="flex-1 rounded-full border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-indigo-500"
                    placeholder={isChatOpen ? `Ask ${currentAssistantName}...` : "Ask the coach..."}
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      void handleSend();
                    }
                  }}
                />
                <button
                  className="rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold hover:bg-indigo-600 disabled:opacity-50"
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
