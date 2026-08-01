"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import {
  MessageSquare,
  Send,
  User,
  Loader2,
  Paperclip,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { sendProjectMessageAction } from "@/app/actions/chat";
import { Reveal } from "@/components/ui/reveal";

interface Message {
  id: string;
  order_id: string;
  sender_id: string;
  message: string;
  attachments: any[];
  created_at: string;
  profiles?: { full_name: string | null; avatar_url: string | null } | null;
}

interface Project {
  id: string;
  reference: string;
  website_type: string | null;
}

interface ProjectChatProps {
  projects: Project[];
  initialMessages: Message[];
  profile: any;
}

export function ProjectChat({ projects, initialMessages, profile }: ProjectChatProps) {
  const { t, lang } = useLanguage();
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || "");
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [typedMessage, setTypedMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Filter messages for currently selected project
  const filteredMessages = messages.filter((m) => m.order_id === selectedProjectId);

  // Auto scroll to bottom of chat thread on change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [filteredMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim() || !selectedProjectId) return;

    const messageText = typedMessage;
    setTypedMessage("");

    // Optimistic local state update for zero lag
    const tempId = `temp_msg_${Date.now()}`;
    const optimisticMsg: Message = {
      id: tempId,
      order_id: selectedProjectId,
      sender_id: profile.id,
      message: messageText,
      attachments: [],
      created_at: new Date().toISOString(),
      profiles: {
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
      },
    };

    setMessages((prev) => [...prev, optimisticMsg]);

    startTransition(async () => {
      const res = await sendProjectMessageAction({
        orderId: selectedProjectId,
        message: messageText,
      });

      if (!res.success) {
        // Rollback optimistic message on error
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
        alert(res.error || "Failed to deliver message");
        return;
      }

      // Replace optimistic temp message with database confirmed payload
      setMessages((prev) =>
        prev.map((m) => (m.id === tempId ? { ...(res.data as Message), profiles: optimisticMsg.profiles } : m))
      );
    });
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Title Header */}
      <Reveal direction="fade">
        <div>
          <h1 className="text-display-sm font-bold tracking-tight">
            <span className="text-gradient">প্রজেক্ট চ্যাট (Project Chat)</span>
          </h1>
          <p className="text-sm text-fg-soft mt-1">
            আপনার প্রজেক্টের রিকোয়ারমেন্টস এবং কাজের অগ্রগতি নিয়ে সরাসরি ডেভলপার দলের সাথে রিয়েল-টাইমে কথা বলুন।
          </p>
        </div>
      </Reveal>

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-stretch h-[60vh] max-h-[600px]">
          {/* Projects Threads List sidebar - 1 col */}
          <div className="md:col-span-1 border border-border/10 bg-surface/30 backdrop-blur rounded-2xl p-4 space-y-3 flex flex-col overflow-y-auto">
            <p className="text-xs font-bold uppercase tracking-wider text-fg-muted px-1">Active Projects</p>
            <div className="space-y-1.5 flex-1">
              {projects.map((p) => {
                const selected = p.id === selectedProjectId;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProjectId(p.id)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      selected
                        ? "bg-brand-500/10 border-brand-500/20 text-brand-500 font-bold"
                        : "border-transparent bg-canvas/20 hover:bg-canvas-muted/40 text-fg-soft"
                    }`}
                  >
                    <h4 className="text-xs font-bold leading-tight truncate">{p.website_type}</h4>
                    <span className="text-[10px] text-fg-muted mt-1 block font-mono">{p.reference}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Chat Thread Viewport - 3 cols */}
          <div className="md:col-span-3 border border-border/10 bg-surface/30 backdrop-blur rounded-2xl flex flex-col justify-between overflow-hidden h-full">
            {/* Header info */}
            <div className="p-4 border-b border-border/5 bg-canvas/30 flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand-500 text-white font-bold text-xs shrink-0">
                <MessageSquare className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-fg leading-tight">
                  {projects.find((p) => p.id === selectedProjectId)?.website_type || "Conversation Thread"}
                </h4>
                <span className="text-[10px] text-fg-muted mt-0.5 block font-mono">
                  {projects.find((p) => p.id === selectedProjectId)?.reference}
                </span>
              </div>
            </div>

            {/* Bubble logs feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {filteredMessages.length > 0 ? (
                filteredMessages.map((msg) => {
                  const isOwn = msg.sender_id === profile.id;
                  return (
                    <div key={msg.id} className={`flex gap-3 items-start max-w-[80%] ${isOwn ? "ml-auto flex-row-reverse" : "mr-auto"}`}>
                      {/* Avatar */}
                      <div className="grid h-8 w-8 place-items-center rounded-xl bg-canvas border border-border/10 text-fg-muted font-bold text-xs shrink-0 select-none">
                        {msg.profiles?.full_name?.slice(0, 2).toUpperCase() || <User className="h-4 w-4" />}
                      </div>

                      {/* Msg bubble container */}
                      <div className="space-y-1">
                        {!isOwn && (
                          <p className="text-[10px] font-bold text-fg-muted">{msg.profiles?.full_name || "Support Team"}</p>
                        )}
                        <div
                          className={`p-3 rounded-2xl text-xs leading-relaxed ${
                            isOwn
                              ? "bg-brand-600 text-white rounded-tr-none"
                              : "bg-canvas-muted border border-border/5 text-fg-soft rounded-tl-none"
                          }`}
                        >
                          <p className="whitespace-pre-line">{msg.message}</p>
                        </div>
                        <p className={`text-[9px] text-fg-muted ${isOwn ? "text-right" : "text-left"}`}>
                          {formatTime(msg.created_at)}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center text-center h-full text-fg-muted italic text-xs py-8">
                  <MessageSquare className="h-8 w-8 text-border mb-2" />
                  নতুন একটি চ্যাট মেসেজ লিখে কথা বলা শুরু করুন।
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Message composer box */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-border/5 bg-canvas/30 flex items-center gap-3">
              <input
                type="text"
                value={typedMessage}
                onChange={(e) => setTypedMessage(e.target.value)}
                placeholder="Type your project message..."
                className="flex-1 h-11 px-4 rounded-full border border-border/10 bg-canvas/50 text-xs focus:border-brand-500 outline-none"
              />
              <button
                type="submit"
                disabled={isPending || !typedMessage.trim()}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-600 text-white hover:bg-brand-500 shadow-soft transition-colors disabled:opacity-40"
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <Reveal direction="fade">
          <div className="card-surface border border-border/10 rounded-3xl bg-surface/10 p-12 text-center text-fg-muted italic text-sm">
            <MessageSquare className="h-10 w-10 text-border mx-auto mb-3" />
            চ্যাট করার জন্য আপনার প্রজেক্ট থাকতে হবে।
          </div>
        </Reveal>
      )}
    </div>
  );
}
