"use client";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles, Bot } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

const responses: Record<string, string[]> = {
  bn: [
    "Namaste! Ami Rahat Ahmed er AI assistant. Tumi ki bhabe sahajjo cha?",
    "Web design, development, o blood donation info niye bolte paro.",
    "Theme upgrade, 3D animation, chatbot — sob update hoyeche!",
    "Multilingual support (BN/EN) ekhon active.",
    "Tumi amar portfolio visit korcho — thank you!",
  ],
  en: [
    "Hello! I'm Rahat Ahmed's AI assistant. How can I help you today?",
    "You can ask about web design, development, blood donation, or updates.",
    "Theme upgrade, 3D animations, chatbot — all updated!",
    "Multilingual support (BN/EN) is now active.",
    "You're visiting my portfolio — thank you!",
  ],
};

export default function AIChatbot() {
  const { lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "bot"; text: string }[]>([
    { role: "bot", text: lang === "bn" ? responses.bn[0] : responses.en[0] },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const send = () => {
    if (!input.trim()) return;
    const userText = input.trim();
    setMessages((m) => [...m, { role: "user", text: userText }]);
    setInput("");
    const pool = responses[lang] || responses.en;
    const botText = pool[Math.floor(Math.random() * pool.length)];
    setTimeout(() => setMessages((m) => [...m, { role: "bot", text: botText }]), 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-[340px] sm:w-[380px] rounded-3xl border border-white/10 bg-[#0f0f1a]/95 backdrop-blur-2xl shadow-2xl shadow-brand-900/30 overflow-hidden animate-fade-in">
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-brand-700/40 to-rose-600/30 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-white shadow-lg shadow-brand-500/30">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white leading-none">Rahat AI</h3>
                <span className="text-[10px] text-brand-300">{lang === "bn" ? "স্মার্ট সহায়ক" : "Smart Assistant"}</span>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="rounded-full p-1 text-white/70 hover:text-white hover:bg-white/10 transition" aria-label="Close"><X className="h-4 w-4" /></button>
          </div>
          <div ref={scrollRef} className="h-[280px] overflow-y-auto px-3 py-3 space-y-3 scroll-smooth">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[82%] rounded-2xl px-3 py-2 text-sm leading-snug shadow-lg ${m.role === "user" ? "bg-brand-600 text-white rounded-br-md" : "bg-surface/70 text-fg-soft rounded-bl-md border border-white/5"}`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 border-t border-white/10 px-3 py-3 bg-[#0f0f1a]/60">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder={lang === "bn" ? "বার্তা লিখুন..." : "Type a message..."}
              className="flex-1 rounded-full bg-surface/60 border border-white/10 px-3 py-2 text-sm text-fg placeholder:text-fg-muted focus:outline-none focus:ring-2 focus:ring-brand-500/40"
            />
            <button onClick={send} className="rounded-full bg-brand-600 p-2 text-white shadow-lg shadow-brand-600/30 hover:bg-brand-500 transition" aria-label="Send"><Send className="h-4 w-4" /></button>
          </div>
        </div>
      )}
      <button onClick={() => setOpen(!open)} className="h-14 w-14 rounded-full bg-gradient-to-br from-brand-600 to-rose-600 text-white shadow-2xl shadow-brand-600/40 flex items-center justify-center hover:scale-105 transition-transform ring-2 ring-white/20" aria-label="AI Chat" title={lang === "bn" ? "AI চ্যাট" : "AI Chat"}>
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
}
