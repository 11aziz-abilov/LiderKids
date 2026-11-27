'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Tablet, Laptop, Sparkles, Check, X, ShieldCheck } from 'lucide-react';
import { useDeviceMode } from '@/context/DeviceModeContext';
import { useGame } from '@/context/GameContext';
import { DeviceMode } from '@/types';
import { sound } from '@/utils/sound';

interface DeviceOption {
  id: DeviceMode;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: {
    border: string;
    bg: string;
    badge: string;
    gradient: string;
    glow: string;
  };
  features: string[];
}

const DEVICE_OPTIONS: DeviceOption[] = [
  {
    id: 'mobile',
    title: 'Telefon',
    subtitle: 'Smartfonlar uchun',
    description: 'Bir ustunli ixcham ko‘rinish, qulay pastki menyu va katta bosish tugmalari.',
    icon: Smartphone,
    accentColor: {
      border: 'border-orange-400 dark:border-orange-500',
      bg: 'bg-orange-50 dark:bg-orange-950/30',
      badge: 'bg-orange-500 text-white',
      gradient: 'from-orange-500 to-amber-500',
      glow: 'shadow-orange-500/20',
    },
    features: ['Pastki qulay menyu', 'Katta sensorli tugmalar', '1 ustunli toza layout'],
  },
  {
    id: 'tablet',
    title: 'Planshet',
    subtitle: 'iPad & Android planshetlar',
    description: '2 ustunli kengaytirilgan setka, darslarni o‘qish va testlarni yechish uchun a‘lo.',
    icon: Tablet,
    accentColor: {
      border: 'border-amber-400 dark:border-amber-500',
      bg: 'bg-amber-50 dark:bg-amber-950/30',
      badge: 'bg-amber-500 text-white',
      gradient: 'from-amber-500 to-yellow-500',
      glow: 'shadow-amber-500/20',
    },
    features: ['2 ustunli darslar', 'Ixcham yuqori menyu', 'Planshet uchun mos ekran'],
  },
  {
    id: 'desktop',
    title: 'Noutbuk / Kompyuter',
    subtitle: 'Katta monitorlar uchun',
    description: 'To‘liq ko‘p ustunli keng ekran, to‘liq navigatsiya va shashka / testlar maydoni.',
    icon: Laptop,
    accentColor: {
      border: 'border-blue-400 dark:border-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-950/30',
      badge: 'bg-blue-600 text-white',
      gradient: 'from-blue-600 to-indigo-600',
      glow: 'shadow-blue-500/20',
    },
    features: ['To‘liq keng ekran', 'Tezkor klaviatura boshqaruvi', 'Ko‘p ustunli reyting'],
  },
];

export default function DeviceSelectorModal() {
  const {
    deviceMode,
    setDeviceMode,
    isDeviceSelected,
    isDeviceSelectorOpen,
    closeDeviceSelector,
    suggestedMode,
  } = useDeviceMode();

  const { progress } = useGame();

  if (!isDeviceSelectorOpen) return null;

  const handleSelect = (mode: DeviceMode) => {
    if (progress?.soundEnabled) {
      sound.playClick();
    }
    setDeviceMode(mode);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0 }}
        className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border-2 border-amber-300/80 dark:border-zinc-700 w-full max-w-3xl overflow-hidden my-6 relative"
      >
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-6 sm:px-8 py-6 text-white relative">
          {/* Close / Dismiss button */}
          <button
            onClick={() => {
              if (!isDeviceSelected) handleSelect(suggestedMode || 'desktop');
              else closeDeviceSelector();
            }}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
            title="Yopish"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner shrink-0">
              🦁
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider bg-white/25 px-3 py-0.5 rounded-full text-yellow-100 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Qulaylik va Tezkorlik</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                Qurilmangizni tanlang 📱💻
              </h2>
              <p className="text-amber-100 text-xs sm:text-sm font-medium mt-0.5">
                Prezident maktabiga tayyorgarlik darslari va testlari tanlangan qurilmangizga 100% moslashadi.
              </p>
            </div>
          </div>
        </div>

        {/* 3 Clickable Device Cards */}
        <div className="p-6 sm:p-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {DEVICE_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isSuggested = opt.id === suggestedMode;
              const isCurrent = opt.id === deviceMode && isDeviceSelected;

              return (
                <motion.div
                  key={opt.id}
                  whileHover={{ scale: 1.025, y: -4 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleSelect(opt.id)}
                  className={`relative rounded-3xl p-5 border-2 transition-all cursor-pointer flex flex-col justify-between text-left group ${
                    isCurrent
                      ? `${opt.accentColor.border} ${opt.accentColor.bg} shadow-lg ${opt.accentColor.glow} ring-2 ring-amber-400`
                      : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/60 hover:border-amber-300 dark:hover:border-zinc-700 hover:shadow-md'
                  }`}
                >
                  {/* Recommended Badge */}
                  {isSuggested && (
                    <div className="absolute -top-3 left-4 bg-emerald-500 text-white text-[10px] sm:text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1">
                      <Sparkles className="w-3 h-3 fill-white" />
                      <span>Tavsiya etiladi</span>
                    </div>
                  )}

                  {/* Top: Icon & Selected Check */}
                  <div>
                    <div className="flex items-center justify-between mb-4 mt-1">
                      <div
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${opt.accentColor.gradient} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}
                      >
                        <Icon className="w-7 h-7" />
                      </div>

                      {isCurrent && (
                        <div className="w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center font-black shadow-sm">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    <h3 className="text-lg sm:text-xl font-black text-zinc-900 dark:text-zinc-100">
                      {opt.title}
                    </h3>
                    <span className="text-[11px] font-extrabold text-amber-600 dark:text-amber-400 block mt-0.5">
                      {opt.subtitle}
                    </span>

                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 font-medium leading-relaxed">
                      {opt.description}
                    </p>
                  </div>

                  {/* Features list */}
                  <div className="mt-5 pt-3 border-t border-zinc-100 dark:border-zinc-700/60 space-y-1.5">
                    {opt.features.map((feat, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-600 dark:text-zinc-400"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}

                    <div className="pt-3">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelect(opt.id);
                        }}
                        className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          isCurrent
                            ? 'bg-amber-500 text-white shadow-md'
                            : 'bg-zinc-100 hover:bg-amber-500 hover:text-white dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200'
                        }`}
                      >
                        <span>{isCurrent ? 'Tanlangan ✓' : 'Shuni tanlash'}</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Footer note */}
          <div className="bg-amber-50 dark:bg-zinc-800/80 rounded-2xl p-3.5 border border-amber-200 dark:border-zinc-700 flex items-center justify-between gap-3 text-xs text-zinc-600 dark:text-zinc-400 font-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Keyinchalik qurilmani <strong>Profil</strong> yoki <strong>Header</strong> orqali istalgan paytda o‘zgartirishingiz mumkin.
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                if (!isDeviceSelected) handleSelect(suggestedMode || 'desktop');
                else closeDeviceSelector();
              }}
              className="text-xs font-black text-amber-600 dark:text-amber-400 hover:underline shrink-0 cursor-pointer"
            >
              {isDeviceSelected ? 'Yopish' : 'Tavsiya etilgan bilan davom etish →'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
