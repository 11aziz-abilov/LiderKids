'use client';

import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { motion } from 'framer-motion';
import {
  X,
  Clock,
  Award,
  User,
  CheckCircle2,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

export default function ParentSmsModal() {
  const {
    isSmsModalOpen,
    setIsSmsModalOpen,
    progress,
    refreshBotSyncCode,
  } = useGame();

  const [copiedCode, setCopiedCode] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!isSmsModalOpen) return null;

  const profile = progress.profile;
  const isBotLinked = Boolean(profile?.isBotLinked);
  const botCode = profile?.botSyncCode || '';

  const handleCopyCode = () => {
    if (!botCode) return;
    navigator.clipboard.writeText(botCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshBotSyncCode();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md overflow-y-auto animate-in fade-in duration-300">
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0 }}
        className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border-2 border-sky-300/80 dark:border-zinc-700 w-full max-w-xl overflow-hidden my-6 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 px-6 py-5 text-white relative">
          <button
            onClick={() => setIsSmsModalOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
            title="Yopish"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-white/30">
              🤖
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                  Ota-onalar Nazorat Markazi
                </h3>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-sky-100 border border-white/30">
                  Telegram Bot
                </span>
              </div>
              <p className="text-xs sm:text-sm text-sky-100 font-medium">
                Kunlik hisobotlar (20:00) va 24 soat kirmaganda ogohlantirish
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Connection Status Card */}
          {isBotLinked ? (
            <div className="bg-emerald-50 dark:bg-emerald-950/40 p-4 rounded-2xl border-2 border-emerald-400 dark:border-emerald-700 flex items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-2xl shadow-md shrink-0">
                  ✅
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-black text-emerald-950 dark:text-emerald-100">
                      Telegram Bot Ulangan
                    </h4>
                    <span className="bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 text-[10px] px-2 py-0.5 rounded-full font-black">
                      Faol
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                    Ota-onangiz <strong>@LiderKidsNazoratBot</strong> orqali barcha natijalaringizni kuzatib bormoqda.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 dark:bg-amber-950/40 p-4 rounded-2xl border-2 border-amber-300 dark:border-amber-800 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">⚠️</span>
                  <h4 className="text-sm font-black text-amber-950 dark:text-amber-100">
                    Bot hali ulanmagan
                  </h4>
                </div>
                <span className="bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 text-[10px] px-2 py-0.5 rounded-full font-black">
                  Ulanish kutilmoqda
                </span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Ota-ona Telegram boti orqali farzandining test natijalari va zaif mavzularini ko‘rib turishi uchun quyidagi 6 xonali kodni botga yuboring:
              </p>

              {/* 6-digit Code Box */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-white dark:bg-zinc-800 rounded-xl border border-amber-200 dark:border-zinc-700">
                <div className="flex items-center gap-1">
                  {(botCode || '------').split('').slice(0, 6).map((digit, idx) => (
                    <span
                      key={idx}
                      className="w-8 h-10 sm:w-9 sm:h-11 rounded-lg bg-sky-50 dark:bg-zinc-700 text-sky-900 dark:text-sky-100 border border-sky-300 dark:border-zinc-600 flex items-center justify-center font-mono text-xl sm:text-2xl font-black shadow-inner"
                    >
                      {digit}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    disabled={!botCode}
                    className={`px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition active:scale-95 cursor-pointer disabled:opacity-50 ${
                      copiedCode
                        ? 'bg-emerald-500 text-white shadow-md'
                        : 'bg-sky-500 hover:bg-sky-600 text-white shadow-sm'
                    }`}
                  >
                    {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedCode ? 'Nusxalandi!' : 'Nusxalash'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-zinc-600 dark:text-zinc-300 transition active:scale-90 cursor-pointer disabled:opacity-50"
                    title="Yangi kod olish (15 daqiqalik)"
                  >
                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-zinc-500">Telegram Bot:</span>
                <a
                  href="https://t.me/LiderKidsNazoratBot"
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono font-black text-sky-600 hover:underline flex items-center gap-1"
                >
                  <span>@LiderKidsNazoratBot</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* Automated Monitoring Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-zinc-50 dark:bg-zinc-800/80 rounded-2xl p-4 border border-zinc-200 dark:border-zinc-700 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-black text-zinc-900 dark:text-zinc-100">
                <Clock className="w-4 h-4 text-sky-600" />
                <span>Har kuni soat 20:00 da</span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Ota-onaga kunlik to‘g‘ri javoblar foizi, yechilgan testlar soni va zaif mavzular bo‘yicha avtomatik xulosa boradi.
              </p>
            </div>

            <div className="bg-zinc-50 dark:bg-zinc-800/80 rounded-2xl p-4 border border-zinc-200 dark:border-zinc-700 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-black text-zinc-900 dark:text-zinc-100">
                <Award className="w-4 h-4 text-orange-500" />
                <span>24 soat kirmasa eslatma</span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                O‘quvchining olovchasi (streak) o‘chmasligi va tartibli tayyorgarlik uchun bot orqali ogohlantirish yuboriladi.
              </p>
            </div>
          </div>

          {/* Child & Parent info card */}
          <div className="bg-zinc-50 dark:bg-zinc-800/60 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-700 space-y-2 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-zinc-200 dark:border-zinc-700">
              <span className="text-zinc-500 font-bold flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-500" /> O‘quvchi:
              </span>
              <span className="font-black text-zinc-800 dark:text-zinc-200">
                {profile ? `${profile.firstName} ${profile.lastName}` : progress.name} ({progress.grade}-sinf)
              </span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-zinc-500 font-bold">Ota-ona telefon raqami:</span>
              <span className="font-mono font-black text-zinc-800 dark:text-zinc-200">
                {profile?.parentPhoneNumber || profile?.phoneNumber || "Ko‘rsatilmagan"}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-zinc-50 dark:bg-zinc-800/80 px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
          <div className="flex items-center gap-1.5 font-bold">
            <span>🛡️ LiderKids Nazorat:</span>
            <span className="text-zinc-700 dark:text-zinc-300">Shaxsiy ma‘lumotlar xavfsiz saqlanadi</span>
          </div>
          <button
            onClick={() => setIsSmsModalOpen(false)}
            className="px-5 py-2 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-650 text-zinc-800 dark:text-zinc-200 font-extrabold rounded-xl transition cursor-pointer"
          >
            Yopish
          </button>
        </div>
      </motion.div>
    </div>
  );
}
