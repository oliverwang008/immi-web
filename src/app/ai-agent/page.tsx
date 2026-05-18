"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Bot,
  Sparkles,
  Shield,
  Clock,
  BookOpen,
  ChevronRight,
  RotateCcw,
  AlertTriangle,
  Layers,
  Star,
  MapPin,
  Calculator,
} from "lucide-react";
import Header from "@/components/Header";
import clsx from "clsx";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const POPULAR_QUESTIONS = [
  "What is the points test and how is my score calculated?",
  "What's the difference between 189, 190 and 491 visas?",
  "How long does an EOI typically wait in the pool?",
  "Which occupations are on the skilled migration list?",
  "Can my partner's qualifications boost my points?",
];

const QUICK_START_CARDS = [
  {
    icon: Layers,
    title: "Compare visa pathways",
    desc: "Understand the difference between 189, 190, 491 and employer-sponsored routes.",
    prompt: "What's the difference between 189, 190 and 491 visas?",
  },
  {
    icon: Calculator,
    title: "Points test explained",
    desc: "Learn how age, English, experience and qualifications combine into your score.",
    prompt: "How does the points test work and what score do I need?",
  },
  {
    icon: Clock,
    title: "EOI wait times",
    desc: "Find out what current SkillSelect invitation rounds look like for your visa type.",
    prompt: "What are current EOI wait times and points cutoffs?",
  },
];

const CAPABILITIES = [
  "189 / 190 / 491 skilled visa guidance",
  "482 & 186 employer-sponsored visas",
  "Points test calculation help",
  "EOI & SkillSelect strategy",
  "State nomination requirements",
  "Skills assessment bodies",
  "Bridging visa conditions",
  "Occupation list queries",
];

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function renderContent(text: string) {
  const paragraphs = text.split(/\n{2,}/);
  return paragraphs.map((para, pi) => {
    const lines = para.split("\n");
    return (
      <p key={pi} className={pi > 0 ? "mt-3" : ""}>
        {lines.map((line, li) => (
          <span key={li}>
            {li > 0 && <br />}
            {line.split(/(\*\*[^*]+\*\*)/g).map((chunk, ci) =>
              chunk.startsWith("**") && chunk.endsWith("**") ? (
                <strong key={ci} className="font-semibold text-[#F0F4FF]">
                  {chunk.slice(2, -2)}
                </strong>
              ) : (
                <span key={ci}>{chunk}</span>
              )
            )}
          </span>
        ))}
      </p>
    );
  });
}

function BotAvatar({ size = "sm" }: { size?: "sm" | "lg" }) {
  const dim = size === "lg" ? "w-16 h-16" : "w-8 h-8";
  const icon = size === "lg" ? 28 : 16;
  return (
    <div
      className={clsx(
        "relative shrink-0 flex items-center justify-center rounded-xl",
        dim
      )}
      style={{
        background: "linear-gradient(135deg, #001E55 0%, #001040 100%)",
        border: "1px solid rgba(255,210,0,0.35)",
        boxShadow:
          "0 0 16px rgba(255,210,0,0.08), inset 0 1px 0 rgba(255,210,0,0.1)",
      }}
    >
      <Bot size={icon} className="text-[#FFD200]" />
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 px-1 py-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-2 h-2 rounded-full bg-[#FFD200] opacity-60"
          animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.8, 1.1, 0.8] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={clsx("flex gap-3 w-full", isUser ? "justify-end" : "justify-start")}
    >
      {!isUser && <BotAvatar size="sm" />}

      <div
        className={clsx(
          "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
          isUser
            ? "rounded-tr-sm text-[#F0F4FF]"
            : "rounded-tl-sm text-[#CBD8F0]"
        )}
        style={
          isUser
            ? {
                background: "rgba(255,210,0,0.08)",
                border: "1px solid rgba(255,210,0,0.2)",
              }
            : {
                background: "rgba(0,21,64,0.75)",
                border: "1px solid rgba(0,61,165,0.45)",
              }
        }
      >
        {renderContent(message.content)}
      </div>

      {isUser && (
        <div
          className="w-8 h-8 shrink-0 rounded-xl flex items-center justify-center text-xs font-bold text-[#000918]"
          style={{
            background: "linear-gradient(135deg, #FFD200 0%, #CCB000 100%)",
          }}
        >
          You
        </div>
      )}
    </motion.div>
  );
}

function WelcomeState({ onQuickStart }: { onQuickStart: (q: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col items-center justify-center h-full px-4 py-10 text-center"
    >
      <div className="mb-6">
        <BotAvatar size="lg" />
      </div>

      <div className="mb-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-[#FFD200] border border-[rgba(255,210,0,0.2)] bg-[rgba(255,210,0,0.06)] mb-4">
          <Sparkles size={11} />
          AI-Powered
        </span>
      </div>

      <h2
        className="font-display text-2xl sm:text-3xl font-semibold text-[#F0F4FF] mb-3"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        Your Immigration Advisor
      </h2>
      <p className="text-[#8BB8DC] text-sm max-w-sm mb-8 leading-relaxed">
        Ask anything about Australian skilled visas — points test, EOI
        strategy, state nomination, or which visa pathway suits you.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl">
        {QUICK_START_CARDS.map((card) => (
          <button
            key={card.prompt}
            onClick={() => onQuickStart(card.prompt)}
            className="group text-left rounded-xl p-4 transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: "rgba(0,21,64,0.6)",
              border: "1px solid rgba(0,61,165,0.45)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor =
                "rgba(255,210,0,0.3)";
              (e.currentTarget as HTMLElement).style.background =
                "rgba(0,30,85,0.7)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor =
                "rgba(0,61,165,0.45)";
              (e.currentTarget as HTMLElement).style.background =
                "rgba(0,21,64,0.6)";
            }}
          >
            <card.icon
              size={18}
              className="text-[#FFD200] mb-2 group-hover:scale-110 transition-transform"
            />
            <div className="text-xs font-semibold text-[#F0F4FF] mb-1">
              {card.title}
            </div>
            <div className="text-[11px] text-[#3D6080] leading-snug">
              {card.desc}
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}

export default function AIAgentPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  const adjustTextareaHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || isLoading) return;

      const userMsg: Message = {
        id: generateId(),
        role: "user",
        content: trimmed,
      };

      const nextMessages = [...messages, userMsg];
      setMessages(nextMessages);
      setInput("");
      setIsLoading(true);
      setStreamingContent("");

      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: nextMessages.map(({ role, content }) => ({
              role,
              content,
            })),
          }),
        });

        if (!res.ok || !res.body) {
          throw new Error(`HTTP ${res.status}`);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split("\n\n");
          buffer = parts.pop() ?? "";

          for (const part of parts) {
            if (part.startsWith("data: ")) {
              try {
                const text = JSON.parse(part.slice(6));
                accumulated += text;
                setStreamingContent(accumulated);
              } catch {
                // ignore malformed chunks
              }
            }
          }
        }

        const assistantMsg: Message = {
          id: generateId(),
          role: "assistant",
          content: accumulated || "Sorry, I couldn't generate a response.",
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } catch (err) {
        console.error("Chat error:", err);
        setMessages((prev) => [
          ...prev,
          {
            id: generateId(),
            role: "assistant",
            content:
              "Sorry, something went wrong. Please check your connection and try again.",
          },
        ]);
      } finally {
        setIsLoading(false);
        setStreamingContent("");
      }
    },
    [messages, isLoading]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleClear = () => {
    setMessages([]);
    setStreamingContent("");
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-[#000918]">
      {/* Background */}
      <div className="fixed inset-0 bg-grid opacity-100 pointer-events-none z-0" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none z-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(255,210,0,0.07) 0%, transparent 60%)",
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <Header />

        <div className="flex flex-1 overflow-hidden">
          {/* ── Sidebar ─────────────────────────────────────── */}
          <aside
            className="hidden lg:flex flex-col w-72 shrink-0 border-r overflow-y-auto p-4 gap-4"
            style={{ borderColor: "rgba(0,61,165,0.35)" }}
          >
            {/* Advisor identity */}
            <div className="flex items-center gap-3 pt-2 pb-1 px-1">
              <BotAvatar size="sm" />
              <div>
                <div className="text-sm font-semibold text-[#F0F4FF]">
                  Immigration Advisor
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00C65E]" />
                  <span className="text-[10px] text-[#3D6080]">Online</span>
                </div>
              </div>
            </div>

            {/* Capabilities */}
            <div
              className="rounded-xl p-4"
              style={{
                background: "rgba(0,21,64,0.6)",
                border: "1px solid rgba(0,61,165,0.4)",
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Star size={13} className="text-[#FFD200]" />
                <span className="text-xs font-semibold text-[#8BB8DC] uppercase tracking-wider">
                  What I can help with
                </span>
              </div>
              <ul className="space-y-2">
                {CAPABILITIES.map((cap) => (
                  <li key={cap} className="flex items-start gap-2">
                    <span className="mt-[5px] w-1.5 h-1.5 rounded-full bg-[#FFD200] shrink-0 opacity-70" />
                    <span className="text-xs text-[#8BB8DC] leading-snug">
                      {cap}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Disclaimer */}
            <div
              className="rounded-xl p-3 flex gap-2.5"
              style={{
                background: "rgba(255,210,0,0.04)",
                border: "1px solid rgba(255,210,0,0.15)",
              }}
            >
              <AlertTriangle
                size={13}
                className="text-[#FFD200] opacity-70 shrink-0 mt-0.5"
              />
              <p className="text-[11px] text-[#3D6080] leading-snug">
                General information only — not legal advice. Consult a
                MARA-registered migration agent for your specific situation.
              </p>
            </div>

            {/* Popular questions */}
            <div>
              <div className="flex items-center gap-2 mb-2.5 px-1">
                <BookOpen size={12} className="text-[#3D6080]" />
                <span className="text-[10px] font-semibold text-[#3D6080] uppercase tracking-wider">
                  Popular questions
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                {POPULAR_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    disabled={isLoading}
                    className="group text-left flex items-start gap-2 rounded-lg px-3 py-2.5 text-xs text-[#8BB8DC] transition-all disabled:opacity-40"
                    style={{ border: "1px solid rgba(0,61,165,0.3)" }}
                    onMouseEnter={(e) => {
                      if (!isLoading) {
                        (e.currentTarget as HTMLElement).style.background =
                          "rgba(0,43,110,0.4)";
                        (e.currentTarget as HTMLElement).style.borderColor =
                          "rgba(255,210,0,0.2)";
                        (e.currentTarget as HTMLElement).style.color = "#F0F4FF";
                      }
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "";
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "rgba(0,61,165,0.3)";
                      (e.currentTarget as HTMLElement).style.color = "";
                    }}
                  >
                    <ChevronRight
                      size={12}
                      className="shrink-0 mt-0.5 text-[#3D6080] group-hover:text-[#FFD200] transition-colors"
                    />
                    <span className="leading-snug">{q}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="mt-auto flex flex-col gap-1.5 pb-2">
              <a
                href="https://immi.homeaffairs.gov.au"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] text-[#3D6080] hover:text-[#8BB8DC] transition-colors"
              >
                <MapPin size={11} />
                immi.homeaffairs.gov.au
              </a>
              <a
                href="https://www.mara.gov.au"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] text-[#3D6080] hover:text-[#8BB8DC] transition-colors"
              >
                <Shield size={11} />
                Find a MARA agent
              </a>
            </div>
          </aside>

          {/* ── Chat area ────────────────────────────────────── */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Title bar */}
            <div
              className="shrink-0 flex items-center justify-between px-5 py-3 border-b"
              style={{ borderColor: "rgba(0,61,165,0.3)" }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold text-[#FFD200] border"
                  style={{
                    borderColor: "rgba(255,210,0,0.25)",
                    background: "rgba(255,210,0,0.06)",
                  }}
                >
                  <Sparkles size={9} />
                  AI-Powered
                </span>
                <h1 className="text-sm font-semibold text-[#F0F4FF]">
                  Immigration Advisor
                </h1>
              </div>

              {messages.length > 0 && (
                <button
                  onClick={handleClear}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[#3D6080] hover:text-[#8BB8DC] transition-colors"
                  style={{ border: "1px solid rgba(0,61,165,0.3)" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "rgba(0,61,165,0.6)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "rgba(0,61,165,0.3)";
                  }}
                >
                  <RotateCcw size={11} />
                  New chat
                </button>
              )}
            </div>

            {/* Messages */}
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-5"
            >
              {messages.length === 0 && !isLoading ? (
                <WelcomeState onQuickStart={sendMessage} />
              ) : (
                <>
                  <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                      <MessageBubble key={msg.id} message={msg} />
                    ))}
                  </AnimatePresence>

                  {/* Streaming / loading message */}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3 justify-start"
                    >
                      <BotAvatar size="sm" />
                      <div
                        className="max-w-[80%] rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed text-[#CBD8F0]"
                        style={{
                          background: "rgba(0,21,64,0.75)",
                          border: "1px solid rgba(0,61,165,0.45)",
                        }}
                      >
                        {streamingContent ? (
                          <>
                            {renderContent(streamingContent)}
                            <motion.span
                              className="inline-block w-0.5 h-4 bg-[#FFD200] ml-0.5 align-middle"
                              animate={{ opacity: [1, 0] }}
                              transition={{ duration: 0.6, repeat: Infinity }}
                            />
                          </>
                        ) : (
                          <TypingDots />
                        )}
                      </div>
                    </motion.div>
                  )}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input bar */}
            <div
              className="shrink-0 border-t px-4 sm:px-6 py-3"
              style={{ borderColor: "rgba(0,61,165,0.35)" }}
            >
              {/* Mobile popular questions */}
              <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 mb-2 scrollbar-hide">
                {POPULAR_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    disabled={isLoading}
                    className="shrink-0 px-3 py-1.5 rounded-full text-[11px] text-[#8BB8DC] whitespace-nowrap transition-all disabled:opacity-40 hover:text-[#F0F4FF]"
                    style={{
                      background: "rgba(0,21,64,0.6)",
                      border: "1px solid rgba(0,61,165,0.4)",
                    }}
                  >
                    {q.length > 40 ? q.slice(0, 38) + "…" : q}
                  </button>
                ))}
              </div>

              {/* Input row */}
              <div
                className="flex items-end gap-3 rounded-xl px-4 py-3"
                style={{
                  background: "rgba(0,16,40,0.85)",
                  border: isLoading
                    ? "1px solid rgba(0,61,165,0.4)"
                    : "1px solid rgba(0,61,165,0.55)",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
                }}
                onFocus={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "rgba(255,210,0,0.4)";
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 0 0 3px rgba(255,210,0,0.06)";
                }}
                onBlur={(e) => {
                  if (
                    !e.currentTarget.contains(
                      e.relatedTarget as Node
                    )
                  ) {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "rgba(0,61,165,0.55)";
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      "0 2px 12px rgba(0,0,0,0.3)";
                  }
                }}
              >
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    adjustTextareaHeight();
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about Australian visas, points test, EOI strategy…"
                  rows={1}
                  disabled={isLoading}
                  className="flex-1 resize-none bg-transparent text-sm text-[#F0F4FF] placeholder-[#3D6080] outline-none leading-relaxed disabled:opacity-60"
                  style={{ maxHeight: "120px", fontFamily: "var(--font-outfit)" }}
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={isLoading || !input.trim()}
                  className="shrink-0 w-9 h-9 flex items-center justify-center rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{
                    background:
                      input.trim() && !isLoading
                        ? "linear-gradient(135deg, #FFD200 0%, #CCB000 100%)"
                        : "rgba(0,43,110,0.4)",
                    color: input.trim() && !isLoading ? "#000918" : "#3D6080",
                  }}
                >
                  <Send size={15} />
                </button>
              </div>
              <p className="mt-2 text-center text-[10px] text-[#3D6080]">
                General information only · Not legal advice ·{" "}
                <a
                  href="https://www.mara.gov.au"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#8BB8DC] transition-colors underline underline-offset-2"
                >
                  Find a MARA agent
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
