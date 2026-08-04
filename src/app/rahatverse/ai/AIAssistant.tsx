'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface Message {
  type: 'assistant' | 'user';
  text: string;
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { type: 'assistant', text: "Hello! I'm Rahat's AI Assistant. How can I help you explore today?" }
  ]);
  const [input, setInput] = useState('');

  const quickReplies = [
    "Tell me about Rahat",
    "Show me the Website Store",
    "Start a guided tour",
    "How do I order a website?"
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    setMessages(prev => [...prev, { type: 'user', text }]);

    // Simple rule-based responses
    let response = "Thank you! I'll remember that for future improvements.";
    
    if (text.toLowerCase().includes('about') || text.toLowerCase().includes('rahat')) {
      response = "Rahat Ahmed is a student, teacher, blood donor, and web developer from Sunamganj. Would you like to visit the About Me district?";
    } else if (text.toLowerCase().includes('order') || text.toLowerCase().includes('website')) {
      response = "Great! You can order a website starting from ৳8,000. Would you like me to take you to the Website Store?";
    } else if (text.toLowerCase().includes('tour')) {
      response = "Perfect! I'll start the guided tour. You can pause or change modes anytime using the controls.";
    }

    setTimeout(() => {
      setMessages(prev => [...prev, { type: 'assistant', text: response }]);
    }, 600);

    setInput('');
  };

  return (
    <>
      {/* AI Assistant Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-[70] flex h-14 w-14 items-center justify-center rounded-full bg-[#22d3ee] text-black shadow-xl hover:bg-[#67e8f9] transition-all active:scale-95"
      >
        <span className="text-3xl">🤖</span>
      </button>

      {/* AI Assistant Panel */}
      {isOpen && (
        <div className="fixed bottom-8 right-6 z-[80] w-full max-w-sm rounded-3xl border border-white/20 bg-[#0f172a] shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🤖</div>
              <div>
                <div className="font-semibold">Rahat AI Assistant</div>
                <div className="text-xs text-[#22d3ee]">Online • Ready to help</div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-xl text-white/50 hover:text-white">×</button>
          </div>

          {/* Messages */}
          <div className="max-h-80 overflow-y-auto p-5 space-y-4 text-sm">
            {messages.map((msg, index) => (
              <div key={index} className={msg.type === 'assistant' ? 'flex justify-start' : 'flex justify-end'}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${msg.type === 'assistant' ? 'bg-white/10' : 'bg-[#22d3ee] text-black'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Replies */}
          <div className="flex flex-wrap gap-2 border-t border-white/10 p-4">
            {quickReplies.map((reply, index) => (
              <button
                key={index}
                onClick={() => handleSend(reply)}
                className="rounded-full border border-white/20 px-3 py-1 text-xs hover:bg-white/5"
              >
                {reply}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-2 border-t border-white/10 p-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
              placeholder="Ask me anything..."
              className="flex-1 rounded-full border border-white/20 bg-transparent px-4 py-2 text-sm placeholder:text-white/40 focus:outline-none focus:border-[#22d3ee]"
            />
            <Button onClick={() => handleSend(input)} size="sm" className="rounded-full px-5">Send</Button>
          </div>
        </div>
      )}
    </>
  );
}
