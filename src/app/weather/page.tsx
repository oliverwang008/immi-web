"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Bot,
  Cloud,
  Sun,
  CloudRain,
  Wind,
  Thermometer,
  Droplets,
  RotateCcw,
  MapPin,
  Sparkles,
} from "lucide-react";
import Header from "@/components/Header";
import clsx from "clsx";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const QUICK_QUESTIONS = [
  "What's the weather like in Sydney today?",
  "Give me the 7-day forecast for Melbourne",
  "Is it raining in Brisbane right now?",
  "What's the temperature in Perth?",
  "How's the weather in Adelaide this week?",
  "What should I wear in Darwin today?",
];

const CITIES = [
  "Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide",
  "Canberra", "Darwin", "Hobart", "Gold Coast", "Cairns",
];

const WEATHER_ICONS = [
  { icon: Sun, color: "#FFD200", label: "Clear" },
  { icon: Cloud, color: "#A0B8D0", label: "Cloudy" },
  { icon: CloudRain, color: "#6BAED6", label: "Rainy" },
  { icon: Wind, color: "#7FB3C8", label: "Windy" },
];

function MessageBubble({ msg, isLast }: { msg: Message; isLast: boolean }) {
  const isUser = msg.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={clsx("flex gap-3", isUser && "flex-row-reverse")}
    >
      {/* Avatar */}
      <div
        className={clsx(
          "flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center",
          isUser
            ? "bg-gradient-to-br from-[#003DA5] to-[#0052CC]"
            : "bg-gradient-to-br from-[#0070B8] to-[#0094D4]"
        )}
      >
        {isUser ? (
          <span className="text-white text-xs font-bold">U</span>
        ) : (
          <Cloud className="w-4 h-4 text-white" />
        )}
      </div>

      {/* Bubble */}
      <div
        className={clsx(
          "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
          isUser
            ? "bg-[#003DA5] text-white rounded-tr-sm"
            : "bg-[#0D1E3A] border border-[rgba(0,61,165,0.3)] text-[#C8D8F0] rounded-tl-sm"
        )}
        style={{ whiteSpace: "pre-wrap" }}
      >
        {msg.content}
      </div>
    </motion.div>
  );
}

export default function WeatherPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => `w-${Date.now()}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
  }, [input]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      const userMsg: Message = {
        id: `u-${Date.now()}`,
        role: "user",
        content: trimmed,
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setLoading(true);

      try {
        const res = await fetch("/api/weather/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: trimmed, session_id: sessionId }),
        });

        let reply = "Sorry, I couldn't get weather data right now. Please try again.";
        if (res.ok) {
          const data = await res.json();
          reply = data.reply ?? reply;
        } else if (res.status === 503) {
          reply = "The weather service is not currently available. Please check back later.";
        }

        const assistantMsg: Message = {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: reply,
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: `e-${Date.now()}`,
            role: "assistant",
            content: "Network error — please check your connection and try again.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [loading, sessionId]
  );

  const handleReset = useCallback(async () => {
    setMessages([]);
    try {
      await fetch("/api/weather/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId }),
      });
    } catch {
      // ignore
    }
  }, [sessionId]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage(input);
      }
    },
    [input, sendMessage]
  );

  const isEmpty = messages.length === 0;

  return (
    <div className="min-h-screen bg-[#000918] text-[#F0F4FF] flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col max-w-4xl w-full mx-auto px-4 py-6 gap-6">
        {/* Page header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#0070B8]/30 to-[#0094D4]/10 border border-[rgba(0,148,212,0.3)]" />
              <Cloud className="absolute inset-0 m-auto w-5 h-5 text-[#38B2F0]" />
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#F0F4FF]">
              Australian Weather Agent
            </h1>
          </div>
          <p className="text-sm text-[#3D6080] max-w-md mx-auto">
            Powered by Claude AI with live weather data — ask about any Australian city
          </p>
        </div>

        {/* Live stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {WEATHER_ICONS.map(({ icon: Icon, color, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 rounded-xl border border-[rgba(0,61,165,0.2)] bg-[#050E1F] px-3 py-2"
            >
              <Icon className="w-4 h-4 flex-shrink-0" style={{ color }} />
              <span className="text-xs text-[#3D6080]">{label}</span>
            </div>
          ))}
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col rounded-2xl border border-[rgba(0,61,165,0.3)] bg-[#050E1F] overflow-hidden min-h-0" style={{ minHeight: "400px" }}>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {isEmpty ? (
              <div className="h-full flex flex-col items-center justify-center gap-6 py-8">
                {/* Hero */}
                <div className="text-center space-y-3">
                  <div className="flex justify-center gap-2">
                    {[Sun, Cloud, CloudRain].map((Icon, i) => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
                        className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#0D1E3A] border border-[rgba(0,61,165,0.3)]"
                      >
                        <Icon className="w-5 h-5 text-[#38B2F0]" />
                      </motion.div>
                    ))}
                  </div>
                  <p className="text-[#3D6080] text-sm">
                    Ask me about weather anywhere in Australia
                  </p>
                </div>

                {/* City quick-select */}
                <div className="w-full max-w-lg">
                  <p className="text-xs text-[#3D6080] mb-2 text-center">Quick city lookup</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {CITIES.map((city) => (
                      <button
                        key={city}
                        onClick={() => sendMessage(`What's the weather in ${city}?`)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[rgba(0,61,165,0.3)] bg-[#0D1E3A] text-[#8AABCC] text-xs hover:bg-[#0D2040] hover:border-[rgba(0,61,165,0.5)] transition-all"
                      >
                        <MapPin className="w-3 h-3" />
                        {city}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Suggested questions */}
                <div className="w-full max-w-lg">
                  <p className="text-xs text-[#3D6080] mb-2 text-center flex items-center justify-center gap-1">
                    <Sparkles className="w-3 h-3" /> Suggested questions
                  </p>
                  <div className="space-y-2">
                    {QUICK_QUESTIONS.slice(0, 3).map((q) => (
                      <button
                        key={q}
                        onClick={() => sendMessage(q)}
                        className="w-full text-left px-4 py-2.5 rounded-xl border border-[rgba(0,61,165,0.2)] bg-[#0D1E3A] text-[#8AABCC] text-sm hover:bg-[#0D2040] hover:border-[rgba(0,61,165,0.4)] transition-all flex items-center gap-2"
                      >
                        <Sun className="w-4 h-4 text-[#FFD200] flex-shrink-0" />
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg, i) => (
                  <MessageBubble key={msg.id} msg={msg} isLast={i === messages.length - 1} />
                ))}
                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0070B8] to-[#0094D4] flex items-center justify-center flex-shrink-0">
                      <Cloud className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-[#0D1E3A] border border-[rgba(0,61,165,0.3)] rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="block w-1.5 h-1.5 rounded-full bg-[#38B2F0]"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input area */}
          <div className="border-t border-[rgba(0,61,165,0.2)] p-3 space-y-2">
            {/* Quick questions (when chat has started) */}
            {!isEmpty && (
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    disabled={loading}
                    className="flex-shrink-0 text-xs px-3 py-1.5 rounded-lg border border-[rgba(0,61,165,0.25)] bg-[#0D1E3A] text-[#5A80A0] hover:text-[#8AABCC] hover:border-[rgba(0,61,165,0.5)] transition-all disabled:opacity-40"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            <div className="flex gap-2 items-end">
              {!isEmpty && (
                <button
                  onClick={handleReset}
                  title="Reset conversation"
                  className="flex-shrink-0 w-9 h-9 rounded-xl border border-[rgba(0,61,165,0.3)] flex items-center justify-center text-[#3D6080] hover:text-[#8AABCC] hover:border-[rgba(0,61,165,0.5)] transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}

              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about weather in any Australian city…"
                  rows={1}
                  disabled={loading}
                  className="w-full resize-none rounded-xl border border-[rgba(0,61,165,0.3)] bg-[#0D1E3A] text-[#C8D8F0] placeholder:text-[#2A4060] text-sm px-4 py-2.5 pr-12 focus:outline-none focus:border-[rgba(0,112,184,0.6)] transition-colors disabled:opacity-50"
                  style={{ lineHeight: "1.5" }}
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || loading}
                  className="absolute right-2 bottom-2 w-8 h-8 rounded-lg bg-[#003DA5] hover:bg-[#0052CC] disabled:bg-[#0D1E3A] disabled:text-[#2A4060] text-white flex items-center justify-center transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <p className="text-center text-[10px] text-[#1E3450]">
              Live data from Open-Meteo • No API key required • Australian cities only
            </p>
          </div>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icon: Thermometer, label: "Real-time Data", desc: "Current temperature, humidity & conditions" },
            { icon: Wind, label: "7-Day Forecast", desc: "Rainfall, wind speed & daily highs/lows" },
            { icon: Bot, label: "AI-Powered", desc: "Claude uses function calling to fetch live data" },
          ].map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              className="rounded-xl border border-[rgba(0,61,165,0.2)] bg-[#050E1F] p-4 space-y-1"
            >
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-[#38B2F0]" />
                <span className="text-sm font-medium text-[#C8D8F0]">{label}</span>
              </div>
              <p className="text-xs text-[#3D6080]">{desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
