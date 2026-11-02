'use client';

import React, { useState, useRef, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import { Bot, Send, User, Sparkles, Loader2, Copy, Check } from 'lucide-react';
import { createBrowserSupabase } from '@/lib/supabase/browser';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function CopilotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Hi, I am your DealSafe Contract Copilot. Ask me any question about your contract clauses, obligations, liabilities, or renewal dates.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [contracts, setContracts] = useState<Array<{ id: string; title: string }>>([]);
  const [selectedContractId, setSelectedContractId] = useState('demo');
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadContracts = async () => {
      try {
        const supabase = createBrowserSupabase();
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) return;
        const { data } = await supabase
          .from('contracts')
          .select('id, title')
          .eq('user_id', userData.user.id)
          .order('updated_at', { ascending: false });
        if (data) setContracts(data);
      } catch (e) {
        // Fallback to demo
      }
    };
    loadContracts();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages, loading]);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = (customPrompt || input).trim();
    if (!textToSend || loading) return;

    setMessages((prev) => [...prev, { role: 'user', content: textToSend }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/copilot/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend,
          contractId: selectedContractId,
          chatHistory: messages,
        }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.answer || 'I could not find an answer in the provided agreement context.',
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, there was an issue processing your question. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const copyText = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <AppShell title="Contract Copilot">
      <main className="px-4 sm:px-6 py-6 max-w-5xl mx-auto flex flex-col h-[calc(100vh-80px)] space-y-4">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-[#EEF1F6] p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-7 h-7 rounded-lg bg-blue-50 text-[#1D4ED8] flex items-center justify-center">
                <Bot size={16} />
              </span>
              <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#0B1B3B]">
                Contract Copilot
              </h1>
            </div>
            <p className="text-xs text-[#64748B]">
              Ask questions about your agreements and receive clear, cited answers.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#64748B] font-medium shrink-0">Contract:</span>
            <select
              value={selectedContractId}
              onChange={(e) => setSelectedContractId(e.target.value)}
              className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-1.5 text-xs font-semibold text-[#0B1B3B] focus:outline-none focus:border-[#1E3A8A] max-w-[220px] truncate"
            >
              <option value="demo">Demo Agreement (MSA)</option>
              {contracts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Chat Body */}
        <div className="flex-1 bg-white border border-[#EEF1F6] rounded-2xl shadow-xs flex flex-col overflow-hidden min-h-0">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-[#1E3A8A] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Bot size={15} />
                  </div>
                )}
                <div
                  className={`max-w-[82%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#1E3A8A] text-white rounded-br-xs'
                      : 'bg-[#F8FAFC] text-[#0B1B3B] border border-[#EEF1F6] rounded-bl-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  {msg.role === 'assistant' && (
                    <div className="mt-2 pt-2 border-t border-[#E2E8F0] flex justify-end">
                      <button
                        onClick={() => copyText(msg.content, idx)}
                        className="text-[11px] text-[#64748B] hover:text-[#0B1B3B] flex items-center gap-1"
                      >
                        {copiedIdx === idx ? (
                          <>
                            <Check size={11} className="text-emerald-600" />
                            <span className="text-emerald-600">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy size={11} />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                    <User size={15} />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-xl bg-[#1E3A8A] text-white flex items-center justify-center shrink-0">
                  <Bot size={15} />
                </div>
                <div className="bg-[#F8FAFC] border border-[#EEF1F6] p-4 rounded-2xl rounded-bl-xs flex items-center gap-2">
                  <Loader2 size={16} className="text-[#1D4ED8] animate-spin" />
                  <span className="text-xs text-[#64748B]">Reviewing clauses…</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions */}
          <div className="px-4 py-2 border-t border-[#F1F5F9] bg-[#F8FAFC]/50 flex items-center gap-1.5 overflow-x-auto text-xs shrink-0">
            <span className="text-[10px] uppercase font-bold text-[#94A3B8] shrink-0 mr-1">
              Suggested:
            </span>
            {[
              'What are termination rights?',
              'Is there an indemnity clause?',
              'What is the governing law?',
              'Are liability damages capped?',
            ].map((q) => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                disabled={loading}
                className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-white border border-[#E2E8F0] text-[#0B1B3B] hover:border-[#1E3A8A] hover:text-[#1E3A8A] text-[11px] font-medium transition-colors cursor-pointer shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-[#EEF1F6] bg-white shrink-0">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Ask anything about this contract…"
                disabled={loading}
                className="flex-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#0B1B3B] placeholder-[#94A3B8] focus:outline-none focus:border-[#1E3A8A]"
              />
              <button
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                className="bg-[#1E3A8A] hover:bg-[#1D4ED8] disabled:opacity-40 text-white px-4 py-3 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-semibold shrink-0 cursor-pointer"
              >
                <span>Send</span>
                <Send size={13} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
