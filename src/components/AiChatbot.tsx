import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Car,
  ChevronDown,
  RotateCcw,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { SelectedVehicle } from '../types';

interface AiChatbotProps {
  activeVehicle: SelectedVehicle | null;
  onOpenBooking: (service?: string) => void;
  onOpenVisualizer: () => void;
  onOpenCatalogCategory: (category: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  action?: {
    type: 'visualizer' | 'booking' | 'category';
    label: string;
    payload?: string;
  };
}

export const AiChatbot: React.FC<AiChatbotProps> = ({
  activeVehicle,
  onOpenBooking,
  onOpenVisualizer,
  onOpenCatalogCategory,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Jambo! I am your SJO Motorsport AI Specialist. Ask me anything about 4x4 accessories, legal nano-ceramic tint %, 3M vinyl vehicle wraps ("rapper" studio), paint protection, or Lipa na M-Pesa payments. How can I assist with your vehicle today?`,
      timestamp: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const quickPrompts = [
    activeVehicle
      ? `Does the Summit Bullbar fit my ${activeVehicle.make} ${activeVehicle.model.split(' ')[0]}?`
      : 'Which accessories fit Toyota Prado and Hilux?',
    'What tint % is legal in Kenya?',
    'How long does a 3M full vinyl color wrap last?',
    'How does Lipa na M-Pesa STK push work?',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          vehicleContext: activeVehicle,
        }),
      });

      if (!response.ok) {
        throw new Error('Server returned an error');
      }

      const data = await response.json();

      // Check if message mentions visualizer, booking, or accessories
      let suggestedAction: ChatMessage['action'] = undefined;
      const lower = query.toLowerCase();
      if (lower.includes('wrap') || lower.includes('color') || lower.includes('visualizer')) {
        suggestedAction = { type: 'visualizer', label: 'Launch Wrap & Tint Studio' };
      } else if (lower.includes('book') || lower.includes('appointment') || lower.includes('install')) {
        suggestedAction = { type: 'booking', label: 'Book Fitment Slot' };
      } else if (lower.includes('bullbar') || lower.includes('roof rack') || lower.includes('accessory')) {
        suggestedAction = { type: 'category', label: 'View 4x4 Accessories', payload: 'accessories' };
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action: suggestedAction,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: 'assistant',
          text: 'I had a momentary connection hiccup. Our master technicians are also available directly on WhatsApp at +254 712 345 678 or email at sjomotorsport@gmail.com for instant fitment assistance!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (action: NonNullable<ChatMessage['action']>) => {
    if (action.type === 'visualizer') {
      onOpenVisualizer();
      setIsOpen(false);
    } else if (action.type === 'booking') {
      onOpenBooking();
      setIsOpen(false);
    } else if (action.type === 'category') {
      onOpenCatalogCategory(action.payload || 'accessories');
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2.5 px-4 py-3 bg-red-600 hover:bg-red-500 text-white font-extrabold rounded-full shadow-2xl shadow-red-600/30 transition-all hover:scale-105 cursor-pointer"
            aria-label="Open AI Fitment Assistant"
          >
            <div className="relative">
              <Sparkles className="w-5 h-5 text-white" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-neutral-900" />
            </div>
            <span className="text-xs font-bold font-display hidden sm:inline">
              Ask SJO AI Specialist
            </span>
          </button>
        )}
      </div>

      {/* Chat Dialog Drawer */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-32px)] sm:w-[420px] h-[580px] max-h-[85vh] bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200 transition-colors">
          {/* Header */}
          <div className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-600/10 border border-red-600/30 flex items-center justify-center text-red-600 dark:text-red-500">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white font-display">
                    SJO AI Specialist
                  </h3>
                  <span className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Online
                  </span>
                </div>
                {/* Active Vehicle Context indicator */}
                {activeVehicle ? (
                  <div className="text-[11px] text-red-600 dark:text-red-400 flex items-center gap-1 truncate max-w-[220px]">
                    <Car className="w-3 h-3 shrink-0" />
                    <span className="truncate">
                      Fitment: {activeVehicle.year} {activeVehicle.make} {activeVehicle.model.split(' ')[0]}
                    </span>
                  </div>
                ) : (
                  <span className="text-[11px] text-neutral-500 dark:text-neutral-400">Universal Catalog Mode</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() =>
                  setMessages([
                    {
                      id: 'welcome-reset',
                      sender: 'assistant',
                      text: `Conversation reset. How can I help customize or protect your vehicle today?`,
                      timestamp: 'Just now',
                    },
                  ])
                }
                className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-white rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                title="Reset conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-white rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Prompts Carousel */}
          <div className="p-2.5 bg-neutral-100 dark:bg-neutral-900/60 border-b border-neutral-200 dark:border-neutral-800 overflow-x-auto flex items-center gap-2 text-xs no-scrollbar">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p)}
                className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 hover:border-red-500 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white text-[11px] transition-colors shrink-0 cursor-pointer"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-red-600/10 border border-red-600/30 flex items-center justify-center text-red-600 dark:text-red-500 shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 ${
                    msg.sender === 'user'
                      ? 'bg-red-600 text-white font-medium rounded-tr-none'
                      : 'bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-200 rounded-tl-none leading-relaxed'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Optional Action Chip inside Bot Message */}
                  {msg.action && (
                    <div className="mt-2.5 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                      <button
                        onClick={() => handleActionClick(msg.action!)}
                        className="w-full py-1.5 px-3 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                      >
                        <span>{msg.action.label}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  <span
                    className={`text-[9px] mt-1 block text-right ${
                      msg.sender === 'user' ? 'text-white/80' : 'text-neutral-400 dark:text-neutral-500'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 items-center text-neutral-500 dark:text-neutral-400 text-xs">
                <div className="w-7 h-7 rounded-lg bg-red-600/10 flex items-center justify-center text-red-600 dark:text-red-500 shrink-0">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div className="bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl px-4 py-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[11px] text-neutral-500 dark:text-neutral-400 ml-1">Analyzing SJO fitment database...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask about tint %, wraps, or Prado accessories..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 focus:border-red-500 focus:ring-1 focus:ring-red-500 rounded-xl px-3.5 py-2 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 outline-none"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="p-2 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold transition-colors cursor-pointer shadow-md shadow-red-600/20"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
