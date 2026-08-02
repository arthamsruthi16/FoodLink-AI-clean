import { AnimatePresence, motion } from 'motion/react';
import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFood } from '../context/FoodContext';
import { api } from '../services/api';

interface GeminiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'gemini';
  text: string;
  timestamp: string;
  source?: string;
}

export const GeminiAssistantModal: React.FC<GeminiAssistantModalProps> = ({ isOpen, onClose }) => {
  const { activeRole, currentUser } = useAuth();
  const { notifyAction } = useFood();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'gemini',
      text: `Hello ${currentUser ? currentUser.name.split(' ')[0] : 'there'}! I am **FoodLink Gemini AI Assistant** powered by Gemini 3.6 Flash.\n\nHow can I assist your ${activeRole.toUpperCase()} operations today? You can ask me about food safety standards, Good Samaritan Act legal protections, tax receipting, or logistics dispatch rules!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'Gemini 3.6 Flash'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    '🛡️ Am I legally protected under Good Samaritan Act?',
    '🌡️ Safe temperature thresholds for cooked buffet food?',
    '💰 How do Section 170(e)(3) tax deductions work?',
    '🚚 How does AI freshness matching calculate urgency?'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputText('');
    setIsLoading(true);

    try {
      const res = await api.askGeminiAssistant(textToSend, activeRole);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'gemini',
        text: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: res.source
      };
      setMessages((prev) => [...prev, aiMsg]);
      await notifyAction(
        '✨ Gemini AI Response',
        `Answered query: "${textToSend.slice(0, 30)}..."`,
        'system'
      );
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'gemini',
        text: `Sorry, I encountered an issue: ${err.message || 'Unable to connect to Gemini API'}. Please try again shortly.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'Error'
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl h-[80vh] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white flex items-center justify-between border-b border-emerald-800/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-xl shadow-inner">
                ✨
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm tracking-wide text-white">FoodLink Gemini AI Assistant</h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 text-[10px] font-bold">
                    Gemini 3.6 Flash
                  </span>
                </div>
                <p className="text-[11px] text-emerald-200/80">
                  Real-time food safety, legal, ESG & operational guidance
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xs font-bold transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Quick Prompts Bar */}
          <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 overflow-x-auto flex gap-2 text-xs scrollbar-none">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                disabled={isLoading}
                className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 text-[11px] font-medium transition-all shadow-sm"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-950/50 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-4 shadow-sm space-y-1.5 ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-none'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] opacity-80 gap-4 mb-1">
                    <span className="font-bold">
                      {msg.sender === 'user' ? 'You' : 'Gemini AI'}
                    </span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div className="whitespace-pre-wrap leading-relaxed">
                    {msg.text}
                  </div>

                  {msg.source && (
                    <div className="text-[9px] text-emerald-600 dark:text-emerald-400 font-medium pt-1 border-t border-slate-100 dark:border-slate-800/60">
                      ⚡ Engine: {msg.source}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-slate-500 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-semibold">Gemini 3.6 Flash thinking...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask Gemini AI about food safety, tax credits, or recipes..."
                className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                disabled={isLoading || !inputText.trim()}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
              >
                <span>Send</span>
                <span>✨</span>
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
