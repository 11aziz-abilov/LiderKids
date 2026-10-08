'use client';

import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { MARKET_ITEMS } from '@/data/marketData';
import { MarketCategory, MarketItem } from '@/types';
import { triggerConfetti } from '@/components/ConfettiEffect';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import FullBodyLionCharacter, { LionAction } from '@/components/FullBodyLionCharacter';
import {
  ShoppingBag,
  Coins,
  Check,
  Sparkles,
  ArrowRight,
  Shirt,
  Luggage,
  Crown,
  Glasses,
  Lock,
  RotateCcw,
  Hand,
  Music,
  Heart
} from 'lucide-react';

const CATEGORY_TABS: { id: MarketCategory | 'all'; label: string; icon: React.ElementType }[] = [
  { id: 'all', label: 'Barchasi', icon: ShoppingBag },
  { id: 'outfit', label: 'Kiyimlar', icon: Shirt },
  { id: 'backpack', label: 'Sumkalar', icon: Luggage },
  { id: 'hat', label: 'Bosh kiyimlari', icon: Crown },
  { id: 'accessory', label: 'Aksessuarlar', icon: Glasses },
];

export default function MarketPage() {
  const {
    progress,
    buyMarketItem,
    equipMarketItem,
    unequipMarketItem,
    lionStage
  } = useGame();

  const [activeCategory, setActiveCategory] = useState<MarketCategory | 'all'>('all');
  const [characterAction, setCharacterAction] = useState<LionAction>('idle');
  const [purchaseNotification, setPurchaseNotification] = useState<string | null>(null);

  const inventory = progress.inventory || [];
  const equipped = progress.equippedItems || {};
  const userGender = progress.profile?.gender || 'boy';
  const isGirl = userGender === 'girl';

  // Filter items by active category AND user gender (girl sees girl & unisex; boy sees boy & unisex)
  const filteredItems = MARKET_ITEMS.filter((item) => {
    // Gender check
    const matchesGender = !item.gender || item.gender === 'all' || item.gender === userGender;
    if (!matchesGender) return false;

    // Category check
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  const handleBuy = (item: MarketItem) => {
    const success = buyMarketItem(item);
    if (success) {
      triggerConfetti();
      setCharacterAction('dance');
      setPurchaseNotification(`🎉 Ajoyib! "${item.name}" sotib olindi va kiyildi!`);
      setTimeout(() => {
        setPurchaseNotification(null);
        setCharacterAction('idle');
      }, 3500);
    }
  };

  const handleEquip = (category: MarketCategory, itemId: string) => {
    equipMarketItem(category, itemId);
    setCharacterAction('wave');
    setTimeout(() => setCharacterAction('idle'), 2000);
  };

  const getEquippedName = (category: MarketCategory) => {
    const itemId = equipped[category];
    if (!itemId) return 'Kiyilmagan';
    const item = MARKET_ITEMS.find((i) => i.id === itemId);
    return item ? `${item.emoji} ${item.name}` : 'Kiyilmagan';
  };

  return (
    <div className="space-y-8 sm:space-y-10 pb-20">
      {/* Top Hero Banner */}
      <section className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-48 h-48 bg-yellow-300/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider">
              <ShoppingBag className="w-4 h-4 text-yellow-200" />
              <span>{isGirl ? '👧 Malika Shercha Do‘koni' : '👦 Shercha Do‘koni'}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
              Shercha Marketi 🛍️
            </h1>
            <p className="text-amber-100 text-sm sm:text-base font-medium">
              {isGirl
                ? 'Malika sherchangiz uchun eng nafis ko‘ylaklar, malika tiaralari, pushti sumkalar va taqinchoqlarni tanlang!'
                : 'Sherchangiz uchun Prezident maktabi liboslari, shohona mantiya, ryukzaklar va tojlarni tanlang!'}
            </p>
          </div>

          {/* Current Coins Balance Box */}
          <div className="bg-white/15 backdrop-blur-md p-5 rounded-3xl border-2 border-white/25 shadow-inner flex flex-col items-center text-center min-w-[200px]">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-100">
              Sizning Balansingiz
            </span>
            <div className="flex items-center gap-2 text-3xl sm:text-4xl font-black my-1 text-white">
              <Coins className="w-8 h-8 text-yellow-300 fill-yellow-300 animate-spin-slow" />
              <span>{progress.coins}</span>
            </div>
            <span className="text-[11px] font-bold text-amber-200">
              Oltin Tanga
            </span>
          </div>
        </div>
      </section>

      {/* Purchase Notification */}
      <AnimatePresence>
        {purchaseNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="bg-emerald-500 text-white p-4 rounded-2xl shadow-lg flex items-center justify-between font-black text-sm sm:text-base"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              {purchaseNotification}
            </span>
            <button
              onClick={() => setPurchaseNotification(null)}
              className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-xl text-xs"
            >
              Yopish
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Shercha Live Fitting Room (Jonli Garderob & To'liq Tana) */}
      <section className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border-2 border-amber-200 dark:border-zinc-800 shadow-md">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left: Full Body Mascot Character Visual with Live Equipment */}
          <div className="flex flex-col items-center">
            <div className="relative w-60 h-72 sm:w-64 sm:h-80 bg-gradient-to-tr from-amber-100/70 via-orange-50/50 to-amber-100/70 dark:from-zinc-800 dark:to-zinc-800/60 rounded-3xl flex items-center justify-center border-4 border-amber-300 dark:border-zinc-700 shadow-inner overflow-hidden p-2">
              {/* Floating Glow */}
              <div className="absolute inset-0 bg-amber-400/15 rounded-3xl blur-xl pointer-events-none" />

              {/* LIVE FULL-BODY CHARACTER */}
              <FullBodyLionCharacter
                grade={progress.grade}
                gender={userGender}
                equipped={equipped}
                action={characterAction}
                size="md"
              />
            </div>

            {/* Fitting room mini-controls */}
            <div className="mt-3 flex items-center gap-1">
              <button
                onClick={() => setCharacterAction('wave')}
                className="px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-800 transition flex items-center gap-1"
                title="Salom berish"
              >
                <Hand className="w-3 h-3" /> Salom
              </button>
              <button
                onClick={() => setCharacterAction('dance')}
                className="px-2.5 py-1 text-xs font-bold rounded-lg bg-pink-100 hover:bg-pink-200 text-pink-800 transition flex items-center gap-1"
                title="Raqsga tushish"
              >
                <Music className="w-3 h-3" /> Raqs
              </button>
              <button
                onClick={() => setCharacterAction('idle')}
                className="px-2.5 py-1 text-xs font-bold rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition"
              >
                Normal
              </button>
            </div>

            <span className="mt-2 text-xs font-black text-amber-900 dark:text-amber-200">
              {progress.name}ning {isGirl ? 'Malika Sherchasi' : 'Sherchasi'}
            </span>
          </div>

          {/* Right: Currently Worn Items List */}
          <div className="flex-1 w-full space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-zinc-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>Hozir kiyilgan buyumlar</span>
              </h3>
              <span className="text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 px-2.5 py-1 rounded-full">
                {isGirl ? '👧 Qizlar kolleksiyasi' : '👦 O‘g‘il bolalar kolleksiyasi'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Outfit slot */}
              <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-black uppercase text-zinc-400">Kiyim (Tana ustida)</div>
                  <div className="text-xs sm:text-sm font-extrabold text-zinc-800 dark:text-zinc-200 truncate max-w-[150px]">
                    {getEquippedName('outfit')}
                  </div>
                </div>
                {equipped.outfit && (
                  <button
                    onClick={() => unequipMarketItem('outfit')}
                    className="p-1.5 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg font-bold"
                    title="Yechish"
                  >
                    Yechish
                  </button>
                )}
              </div>

              {/* Backpack slot */}
              <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-black uppercase text-zinc-400">Sumka / Ryukzak</div>
                  <div className="text-xs sm:text-sm font-extrabold text-zinc-800 dark:text-zinc-200 truncate max-w-[150px]">
                    {getEquippedName('backpack')}
                  </div>
                </div>
                {equipped.backpack && (
                  <button
                    onClick={() => unequipMarketItem('backpack')}
                    className="p-1.5 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg font-bold"
                    title="Yechish"
                  >
                    Yechish
                  </button>
                )}
              </div>

              {/* Hat slot */}
              <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-black uppercase text-zinc-400">Bosh kiyimi</div>
                  <div className="text-xs sm:text-sm font-extrabold text-zinc-800 dark:text-zinc-200 truncate max-w-[150px]">
                    {getEquippedName('hat')}
                  </div>
                </div>
                {equipped.hat && (
                  <button
                    onClick={() => unequipMarketItem('hat')}
                    className="p-1.5 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg font-bold"
                    title="Yechish"
                  >
                    Yechish
                  </button>
                )}
              </div>

              {/* Accessory slot */}
              <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-black uppercase text-zinc-400">Aksessuar</div>
                  <div className="text-xs sm:text-sm font-extrabold text-zinc-800 dark:text-zinc-200 truncate max-w-[150px]">
                    {getEquippedName('accessory')}
                  </div>
                </div>
                {equipped.accessory && (
                  <button
                    onClick={() => unequipMarketItem('accessory')}
                    className="p-1.5 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg font-bold"
                    title="Yechish"
                  >
                    Yechish
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORY_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-orange-500/20 scale-105'
                    : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-amber-50 border border-zinc-200 dark:border-zinc-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Market Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => {
            const isOwned = inventory.includes(item.id);
            const isEquipped = equipped[item.category] === item.id;
            const canAfford = progress.coins >= item.price;

            return (
              <motion.div
                key={item.id}
                whileHover={{ y: -4 }}
                className={`bg-white dark:bg-zinc-900 rounded-3xl p-5 border-2 transition-all flex flex-col justify-between shadow-sm relative overflow-hidden ${
                  isEquipped
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                    : isOwned
                    ? 'border-amber-300 dark:border-zinc-700'
                    : 'border-zinc-200 dark:border-zinc-800'
                }`}
              >
                {/* Item Top row */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 px-3 py-1 rounded-full">
                      {item.badge}
                    </span>

                    {/* Price or Owned status */}
                    {isOwned ? (
                      <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full">
                        <Check className="w-3.5 h-3.5" />
                        <span>Sotib olingan</span>
                      </span>
                    ) : (
                      <div className="flex items-center gap-1 font-black text-amber-900 dark:text-amber-200 bg-amber-100 dark:bg-amber-950/60 px-3 py-1 rounded-full text-sm">
                        <Coins className="w-4 h-4 fill-amber-400 text-amber-500" />
                        <span>{item.price}</span>
                      </div>
                    )}
                  </div>

                  {/* Icon Card Preview */}
                  <div className="my-4 w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-100 to-orange-100 dark:from-zinc-800 dark:to-zinc-700 mx-auto flex items-center justify-center text-5xl shadow-inner border border-amber-200/60 dark:border-zinc-600">
                    {item.emoji}
                  </div>

                  {/* Details */}
                  <h4 className="text-base sm:text-lg font-black text-zinc-900 dark:text-white text-center">
                    {item.name}
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Action Button */}
                <div className="pt-5">
                  {isEquipped ? (
                    <button
                      onClick={() => unequipMarketItem(item.category)}
                      className="w-full py-2.5 px-4 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-black text-xs sm:text-sm border-2 border-emerald-300 hover:bg-emerald-200 transition"
                    >
                      ✅ Kiyilgan (Yechish)
                    </button>
                  ) : isOwned ? (
                    <button
                      onClick={() => handleEquip(item.category, item.id)}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs sm:text-sm shadow-md transition hover:scale-[1.02] active:scale-95"
                    >
                      ✨ Kiyintirish
                    </button>
                  ) : canAfford ? (
                    <button
                      onClick={() => handleBuy(item)}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs sm:text-sm shadow-md transition hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-1.5"
                    >
                      <Coins className="w-4 h-4 fill-white" />
                      <span>{item.price} tangaga sotib olish</span>
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full py-2.5 px-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 font-bold text-xs flex items-center justify-center gap-1.5 cursor-not-allowed"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>{item.price - progress.coins} ta tanga yetishmayapti</span>
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Earn More Coins Prompt */}
      <section className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-yellow-500/10 border-2 border-dashed border-amber-400 dark:border-zinc-700 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base sm:text-lg font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <span>🪙 Yana ko‘proq tanga yig‘ishni xohlaysizmi?</span>
          </h3>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Testlarni to‘g‘ri yeching va har bir to‘g‘ri javob uchun +50 tangaga ega bo‘ling!
          </p>
        </div>
        <Link
          href="/quiz"
          className="shrink-0 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-2xl font-black text-sm shadow-md transition flex items-center gap-2 hover:scale-105 active:scale-95"
        >
          <span>Testlar Yechish</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}
