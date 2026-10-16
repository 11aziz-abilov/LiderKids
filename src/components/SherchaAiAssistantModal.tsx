'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/context/GameContext';
import {
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  RotateCcw,
  BookOpen,
  HelpCircle,
  Brain,
  Flame,
  Award,
  Crown,
  ChevronRight,
  Lightbulb,
} from 'lucide-react';
import FullBodyLionCharacter, { LionAction } from './FullBodyLionCharacter';
import { sound } from '@/utils/sound';
import { askSherchaAi, generateOfflineKidResponse, convertNumbersToUzbekWords, latinUzbekToCyrillic } from '@/utils/aiKidTutor';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  source?: 'gemini' | 'offline-smart';
}

export default function SherchaAiAssistantModal() {
  const {
    progress,
    isAiAssistantOpen,
    setIsAiAssistantOpen,
    aiAssistantContext,
    closeAiAssistant,
  } = useGame();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: `Salom, mening sevimli chempionim! 🦁✨ Men sening sodiq do'sting Sherchaman!
Qaysi dars yoki masalani tushunmading? Menga yoz yoki mikrofonni bosib gapir — birgalikda oson va quvnoq qilib o'rganamiz! 👑`,
      timestamp: 'Hozir',
      source: 'offline-smart',
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [currentAction, setCurrentAction] = useState<LionAction>('wave');
  const [hasContextSent, setHasContextSent] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isAiAssistantOpen) {
      scrollToBottom();
      // Auto focus input on desktop
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isAiAssistantOpen, messages]);

  // Handle incoming context from Quiz, Lessons, or Daily Puzzle
  useEffect(() => {
    if (isAiAssistantOpen && aiAssistantContext?.question && !hasContextSent) {
      setHasContextSent(true);
      setCurrentAction('study');

      const contextPrompt = `Salom, Shercha! Menga mana bu savolni tushunishga yordam ber: "${aiAssistantContext.question}"`;

      // Auto-send context explanation inquiry
      handleSendMessage(contextPrompt, true);
    }
  }, [isAiAssistantOpen, aiAssistantContext]);

  // Reset context sent flag when modal closes
  useEffect(() => {
    if (!isAiAssistantOpen) {
      setHasContextSent(false);
      stopSpeaking();
      stopListening();
    }
  }, [isAiAssistantOpen]);

  // Escape tugmasi orqali yopish
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAiAssistantOpen) {
        closeAiAssistant();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAiAssistantOpen, closeAiAssistant]);

  // Brauzer ovozlarini oldindan yuklab olish
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const loadVoices = () => {
        const v = window.speechSynthesis.getVoices();
        if (v && v.length > 0) setAvailableVoices(v);
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Setup Web Speech API for voice recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'uz-UZ';

        recognition.onstart = () => {
          setIsListening(true);
          setCurrentAction('study');
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            setInputValue(transcript);
            handleSendMessage(transcript);
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error:', event.error);
          setIsListening(false);
          setCurrentAction('idle');
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      stopSpeaking();
      stopListening();
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Kechirasiz, brauzeringiz ovoz bilan kiritishni qo'llab-quvvatlamaydi. Iltimos, Chrome yoki zamonaviy brauzerdan foydalaning.");
      return;
    }

    if (isListening) {
      stopListening();
    } else {
      try {
        if (progress.soundEnabled) sound.playClick();
        recognitionRef.current.start();
      } catch (err) {
        console.warn('Speech recognition start failed:', err);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        // Ignore
      }
      setIsListening(false);
    }
  };

  // Text to Speech (100% O'zbek tilida gapirish)
  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    // 1. Avval barcha sonlarni va arifmetik amallarni sof o'zbekcha so'zlarga aylantiramiz
    // (Masalan: "2 + 17 - 11 = 8" -> "ikki qo'shilgan o'n yetti ayrilgan o'n bir teng sakkiz")
    const wordsConverted = convertNumbersToUzbekWords(text);

    // 2. Belgilardan va ortiqcha emojilardan tozalash
    let cleanText = wordsConverted
      .replace(/[*_#`~>•]/g, '')
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
      .replace(/\s+/g, ' ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'uz-UZ';
    utterance.rate = 0.92;
    utterance.pitch = 1.05;

    const voices = availableVoices.length > 0 ? availableVoices : window.speechSynthesis.getVoices();

    // Ovoz tanlash strategiyasi:
    // 1. Tizimda o'rnatilgan rasmiy O'zbekcha ovoz (Edge/Windows da Madina/Sardor)
    const uzVoice = voices.find(
      (v) => v.lang.toLowerCase().includes('uz') || v.name.toLowerCase().includes('uzbek')
    );

    // 2. Turkcha ovoz (Lotin alifbosi fonetikasi o'zbek tiliga deyarli 100% mos keladi)
    const trVoice = voices.find((v) => v.lang.toLowerCase().startsWith('tr'));

    // 3. Ozarbayjoncha / Qozoqcha ovoz
    const azVoice = voices.find(
      (v) => v.lang.toLowerCase().startsWith('az') || v.lang.toLowerCase().startsWith('kk')
    );

    // 4. Ruscha ovoz (O'zbekistondagi Windows kompyuterlarda doim bo'ladi)
    const ruVoice = voices.find((v) => v.lang.toLowerCase().startsWith('ru'));

    if (uzVoice) {
      utterance.voice = uzVoice;
      utterance.lang = uzVoice.lang;
    } else if (trVoice) {
      utterance.voice = trVoice;
      utterance.lang = trVoice.lang;
    } else if (azVoice) {
      utterance.voice = azVoice;
      utterance.lang = azVoice.lang;
    } else if (ruVoice) {
      // Ruscha ovoz lotincha o'qisa buzilishi mumkin, shuning uchun kirillcha o'zbekchaga o'girib beramiz
      // Natijada ruscha sintezator xuddi mahalliy o'zbek spikeri kabi o'qiydi!
      utterance.voice = ruVoice;
      utterance.lang = ruVoice.lang;
      utterance.text = latinUzbekToCyrillic(cleanText);
    } else {
      // Agar faqat boshqa ovoz bo'lsa, inglizcha son aytmasligi uchun barcha sonlar o'zbekcha so'zlarga aylantirilgan
      utterance.lang = 'uz-UZ';
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setCurrentAction('dance');
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentAction('idle');
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setCurrentAction('idle');
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleSendMessage = async (textToSend?: string, isAutomatedContext = false) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    if (progress.soundEnabled) {
      sound.playClick();
    }

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);
    setCurrentAction('study');

    try {
      // askSherchaAi: static export (Vercel va Capacitor) da ham, har qanday brauzerda ham 100% ishlaydi!
      const data = await askSherchaAi({
        userText: text,
        history: newMessages.map((m) => ({
          sender: m.sender,
          text: m.text,
        })),
        context: aiAssistantContext || undefined,
        studentName: progress.name || 'Yosh Lider',
        grade: progress.grade || 1,
      });

      const replyText =
        data.reply ||
        generateOfflineKidResponse(text, aiAssistantContext || undefined);

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: data.source,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setCurrentAction('wave');

      // Auto speak if enabled and not an automated long prompt
      if (ttsEnabled && !isAutomatedContext) {
        speakText(replyText);
      }
    } catch (error) {
      console.error('AI chat error:', error);
      const fallbackReply = generateOfflineKidResponse(text, aiAssistantContext || undefined);
      const fallbackMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: fallbackReply,
        timestamp: 'Hozir',
        source: 'offline-smart',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      setCurrentAction('wave');
      if (ttsEnabled && !isAutomatedContext) {
        speakText(fallbackReply);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (quickText: string) => {
    handleSendMessage(quickText);
  };

  const handleClearHistory = () => {
    stopSpeaking();
    setMessages([
      {
        id: 'welcome-fresh',
        sender: 'assistant',
        text: `Salom yana bir bor, chempion! 🦁 Suhbat tozalindi. Yangi mavzu yoki qiziq savollaringni kutaman! 🚀`,
        timestamp: 'Hozir',
        source: 'offline-smart',
      },
    ]);
  };

  if (!isAiAssistantOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm cursor-pointer"
        onClick={closeAiAssistant}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl h-[92vh] sm:h-[85vh] max-h-[760px] bg-gradient-to-b from-amber-50/95 via-white to-amber-50/80 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-950 rounded-3xl sm:rounded-3xl shadow-2xl border-4 border-amber-300 dark:border-amber-500/30 flex flex-col overflow-hidden cursor-default"
        >
          {/* TOP HEADER */}
          <div className="relative px-4 sm:px-6 py-3.5 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-amber-950 flex items-center justify-between border-b-2 border-amber-300 shadow-md">
            <div className="flex items-center gap-3">
              {/* Lion Avatar */}
              <div className="relative w-12 h-12 rounded-2xl bg-white/30 backdrop-blur-md border border-white/40 flex items-center justify-center shadow-inner overflow-hidden cursor-pointer">
                <FullBodyLionCharacter
                  grade={progress.grade}
                  gender={progress.profile?.gender || 'boy'}
                  equipped={progress.equippedItems}
                  action={currentAction}
                  size="sm"
                  className="scale-90"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full animate-pulse" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-base sm:text-lg font-black text-amber-950 flex items-center gap-1">
                    <span>Shercha AI</span>
                    <Sparkles className="w-4 h-4 fill-amber-300 text-amber-800" />
                  </h3>
                  <span className="bg-amber-900/15 text-amber-950 font-black text-[10px] px-2 py-0.5 rounded-full">
                    Aqlli Ustoz
                  </span>
                </div>
                <p className="text-xs font-bold text-amber-900/80 flex items-center gap-1">
                  <span>Prezident Maktabiga Tayyorgarlik Do‘sti</span>
                  <span>•</span>
                  <span>{progress.grade}-sinf</span>
                </p>
              </div>
            </div>

            {/* Header controls */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Voice toggle */}
              <button
                type="button"
                onClick={() => {
                  if (isSpeaking) stopSpeaking();
                  setTtsEnabled(!ttsEnabled);
                }}
                className={`p-2 rounded-xl transition ${
                  ttsEnabled
                    ? 'bg-amber-900/20 text-amber-950 hover:bg-amber-900/30'
                    : 'bg-black/10 text-amber-900/50 line-through'
                }`}
                title={ttsEnabled ? "Ovozli o'qish yoqilgan" : "Ovozli o'qish o'chirilgan"}
              >
                {ttsEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>

              {/* Clear chat */}
              <button
                type="button"
                onClick={handleClearHistory}
                className="p-2 rounded-xl bg-amber-900/20 text-amber-950 hover:bg-amber-900/30 transition"
                title="Suhbatni tozalash"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              {/* Katta va aniq Yopish tugmasi */}
              <button
                type="button"
                onClick={closeAiAssistant}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-500 hover:bg-red-600 active:scale-95 text-white font-extrabold text-xs sm:text-sm shadow-md transition ml-1 cursor-pointer"
                title="Oynani yopish (Esc)"
              >
                <X className="w-4 h-4 stroke-[3]" />
                <span>Yopish</span>
              </button>
            </div>
          </div>

          {/* ACTIVE CONTEXT BANNER IF OPENED FROM QUIZ/LESSON */}
          {aiAssistantContext?.question && (
            <div className="bg-amber-100/90 dark:bg-zinc-800/90 px-4 py-2 border-b border-amber-200 dark:border-zinc-700 flex items-center justify-between text-xs font-bold text-amber-900 dark:text-amber-200">
              <div className="flex items-center gap-2 truncate pr-2">
                <Lightbulb className="w-4 h-4 text-orange-500 shrink-0" />
                <span className="truncate">
                  {aiAssistantContext.subject ? `[${aiAssistantContext.subject}] ` : ''}
                  Savol: "{aiAssistantContext.question}"
                </span>
              </div>
            </div>
          )}

          {/* MESSAGES LIST AREA */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {messages.map((msg) => {
              const isAssistant = msg.sender === 'assistant';
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${isAssistant ? 'justify-start' : 'justify-end'}`}
                >
                  {isAssistant && (
                    <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-lg shadow-md shrink-0 self-end mb-1">
                      🦁
                    </div>
                  )}

                  <div className={`max-w-[85%] sm:max-w-[78%] flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}>
                    <div
                      className={`p-3.5 sm:p-4 rounded-3xl text-sm sm:text-base leading-relaxed shadow-sm ${
                        isAssistant
                          ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-bl-xs border-2 border-amber-200/70 dark:border-zinc-700'
                          : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-br-xs shadow-amber-500/20'
                      }`}
                    >
                      <div className="whitespace-pre-line">{msg.text}</div>
                    </div>

                    <div className="flex items-center gap-2 mt-1 px-1 text-[11px] font-semibold text-zinc-400">
                      <span>{msg.timestamp}</span>
                      {isAssistant && (
                        <>
                          <span>•</span>
                          <button
                            onClick={() => speakText(msg.text)}
                            className="hover:text-amber-600 transition flex items-center gap-0.5"
                            title="Ovoz chiqarib o'qish"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Tinglash</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {!isAssistant && (
                    <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-600 flex items-center justify-center text-sm font-black text-white shadow-md shrink-0 self-end mb-1">
                      {progress.name?.charAt(0) || 'L'}
                    </div>
                  )}
                </motion.div>
              );
            })}

            {/* LOADING THINKING INDICATOR */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 text-amber-600 dark:text-amber-400"
              >
                <div className="w-9 h-9 rounded-2xl bg-amber-200 dark:bg-zinc-800 flex items-center justify-center text-lg animate-spin-slow">
                  🦁
                </div>
                <div className="bg-white dark:bg-zinc-800 px-4 py-3 rounded-2xl border-2 border-amber-200 dark:border-zinc-700 flex items-center gap-2 shadow-sm">
                  <span className="text-xs sm:text-sm font-extrabold">Shercha fikrlamoqda...</span>
                  <span className="flex gap-1">
                    <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" />
                  </span>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* QUICK SUGGESTION CHIPS FOR KIDS */}
          <div className="px-3 sm:px-4 py-2 border-t border-amber-100 dark:border-zinc-800 bg-amber-50/60 dark:bg-zinc-900/60 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-xs font-black text-amber-700 dark:text-amber-400 shrink-0 hidden sm:inline">
              Tezkor:
            </span>
            <button
              onClick={() => handleQuickQuestion("Menga qiziq bir jumboq ayt-chi, topishga harakat qilaman! 🧩")}
              className="px-3 py-1.5 rounded-full bg-white dark:bg-zinc-800 border border-amber-300 dark:border-zinc-700 text-xs font-bold text-zinc-700 dark:text-zinc-200 hover:border-amber-500 shrink-0 transition shadow-xs hover:bg-amber-50 dark:hover:bg-zinc-750 flex items-center gap-1"
            >
              <span>🧩</span>
              <span>Jumboq ber</span>
            </button>
            <button
              onClick={() => handleQuickQuestion("Javobini ayt-chi, sirini och! 💡")}
              className="px-3 py-1.5 rounded-full bg-amber-100 dark:bg-amber-950/60 border border-amber-400 dark:border-amber-700 text-xs font-black text-amber-900 dark:text-amber-200 hover:border-amber-600 shrink-0 transition shadow-xs hover:bg-amber-200 flex items-center gap-1"
            >
              <span>💡</span>
              <span>Javobini ayt</span>
            </button>
            <button
              onClick={() => handleQuickQuestion("Tez hisoblash sirini o'rgat, karra jadvali va qo'shish qanday oson bo'ladi? ➕")}
              className="px-3 py-1.5 rounded-full bg-white dark:bg-zinc-800 border border-amber-300 dark:border-zinc-700 text-xs font-bold text-zinc-700 dark:text-zinc-200 hover:border-amber-500 shrink-0 transition shadow-xs hover:bg-amber-50 dark:hover:bg-zinc-750 flex items-center gap-1"
            >
              <span>⚡</span>
              <span>Tez hisoblash</span>
            </button>
            <button
              onClick={() => handleQuickQuestion("Prezident maktabiga kirish uchun eng muhim 3 ta qoida nima? 👑")}
              className="px-3 py-1.5 rounded-full bg-white dark:bg-zinc-800 border border-amber-300 dark:border-zinc-700 text-xs font-bold text-zinc-700 dark:text-zinc-200 hover:border-amber-500 shrink-0 transition shadow-xs hover:bg-amber-50 dark:hover:bg-zinc-750 flex items-center gap-1"
            >
              <span>👑</span>
              <span>PM sirlari</span>
            </button>
            <button
              onClick={() => handleQuickQuestion("Menga kuchli motivatsiya ber, xato qilishdan qo'rqmay chempion bo'lishni xohlayman! 🔥")}
              className="px-3 py-1.5 rounded-full bg-white dark:bg-zinc-800 border border-amber-300 dark:border-zinc-700 text-xs font-bold text-zinc-700 dark:text-zinc-200 hover:border-amber-500 shrink-0 transition shadow-xs hover:bg-amber-50 dark:hover:bg-zinc-750 flex items-center gap-1"
            >
              <span>🔥</span>
              <span>Motivatsiya</span>
            </button>
          </div>

          {/* INPUT BAR WITH VOICE MICROPHONE */}
          <div className="p-3 sm:p-4 bg-white dark:bg-zinc-900 border-t-2 border-amber-200 dark:border-zinc-800">
            {isListening && (
              <div className="mb-2 px-3 py-1.5 bg-red-500/10 border border-red-400 text-red-600 dark:text-red-400 rounded-xl text-xs font-black flex items-center justify-between animate-pulse">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                  Shercha sening ovozingni tinglamoqda... Gapiring! 🎤
                </span>
                <button
                  onClick={stopListening}
                  className="underline hover:text-red-700 font-extrabold"
                >
                  To‘xtatish
                </button>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              {/* Microphone voice input button */}
              <button
                type="button"
                onClick={toggleListening}
                className={`p-3 rounded-2xl flex items-center justify-center transition shadow-md ${
                  isListening
                    ? 'bg-red-500 text-white animate-bounce ring-4 ring-red-400/50'
                    : 'bg-amber-100 hover:bg-amber-200 text-amber-900 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-amber-300'
                }`}
                title={isListening ? "Tinglashni to'xtatish" : "Ovoz orqali gapirish"}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              {/* Text Input */}
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Savolingni yoz yoki mikrofonni bosib gapir..."
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-amber-50/50 dark:bg-zinc-800/80 border-2 border-amber-200 dark:border-zinc-700 rounded-2xl text-sm sm:text-base font-semibold focus:outline-none focus:border-amber-500 focus:bg-white dark:focus:bg-zinc-800 transition"
              />

              {/* Send Button */}
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className={`p-3 rounded-2xl flex items-center justify-center transition shadow-md ${
                  inputValue.trim() && !isLoading
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white hover:scale-105 active:scale-95'
                    : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
                }`}
                title="Yuborish"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
