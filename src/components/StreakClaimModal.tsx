'use client';

import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { StreakPrize } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { triggerConfetti } from './ConfettiEffect';
import { X, Gift, CheckCircle2, Truck, MapPin, Phone, User, Sparkles, ShieldCheck } from 'lucide-react';

interface Props {
  prize: StreakPrize | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function StreakClaimModal({ prize, isOpen, onClose }: Props) {
  const { progress, claimStreakPrize } = useGame();

  const [studentName, setStudentName] = useState(
    progress.profile?.firstName
      ? `${progress.profile.firstName} ${progress.profile.lastName}`.trim()
      : progress.name || 'Yosh Lider'
  );
  const [parentPhone, setParentPhone] = useState(
    progress.profile?.parentPhoneNumber || progress.profile?.phoneNumber || '+998 (90) 123-45-67'
  );
  const [deliveryRegion, setDeliveryRegion] = useState(
    progress.profile?.region || 'Toshkent shahri'
  );
  const [deliveryAddress, setDeliveryAddress] = useState(
    progress.profile?.district ? `${progress.profile.district}, Markaziy ko‘cha` : ''
  );
  const [sizeOrVariant, setSizeOrVariant] = useState('Standart (Sinfga mos)');
  const [isSuccess, setIsSuccess] = useState(false);
  const [trackingCode, setTrackingCode] = useState('');

  if (!isOpen || !prize) return null;

  const currentClaim = progress.streakClaims?.[prize.id];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliveryAddress.trim()) {
      alert('Iltimos, yetkazib berish manzilini (ko‘cha va uy raqami) kiriting!');
      return;
    }

    const success = claimStreakPrize(prize.id, {
      studentName,
      parentPhone,
      deliveryRegion,
      deliveryAddress,
      sizeOrVariant,
    });

    if (success) {
      triggerConfetti();
      setIsSuccess(true);
      const code = `LK-${prize.daysRequired}-${Math.floor(10000 + Math.random() * 90000)}`;
      setTrackingCode(code);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border-4 border-amber-400 dark:border-amber-600 overflow-hidden"
        >
          {/* Header Banner */}
          <div className={`p-6 bg-gradient-to-r ${prize.color} text-white relative`}>
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <span className="text-4xl filter drop-shadow">{prize.emoji}</span>
              <div>
                <span className="inline-block px-2.5 py-0.5 bg-white/20 rounded-full text-xs font-black uppercase tracking-wider mb-1">
                  {prize.badge}
                </span>
                <h2 className="text-xl sm:text-2xl font-black">{prize.name}</h2>
              </div>
            </div>
            <p className="text-white/90 text-xs sm:text-sm mt-2 font-medium">
              {prize.periodLabel} uzluksiz dars natijasi uchun taqdim etiladigan rasmiy LiderKids sovg‘asi!
            </p>
          </div>

          {/* Body */}
          <div className="p-6 max-h-[75vh] overflow-y-auto">
            {isSuccess || currentClaim ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6 space-y-4"
              >
                <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/60 border-4 border-emerald-400 flex items-center justify-center text-4xl shadow-lg">
                  🎁
                </div>

                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                    Buyurtma muvaffaqiyatli qabul qilindi! 🎉
                  </h3>
                  <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
                    Hurmatli <span className="font-bold text-zinc-900 dark:text-white">{studentName}</span>, sizning <b>{prize.name}</b> sovg‘angiz LiderKids markaziy omboridan pochta orqali yo‘lga chiqarilmoqda.
                  </p>
                </div>

                <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-300 dark:border-amber-700 text-left space-y-2 text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-amber-200 dark:border-amber-800">
                    <span className="font-bold text-zinc-500">Kuzatuv kodi (Tracking ID):</span>
                    <span className="font-mono font-black text-amber-700 dark:text-amber-300">
                      {currentClaim?.trackingCode || trackingCode || 'LK-7-78921'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-zinc-500">Yetkazib berish holati:</span>
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5" /> Kuryerga topshirilmoqda (Bepul)
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-zinc-500">Yetkazish muddati:</span>
                    <span className="font-bold text-zinc-700 dark:text-zinc-300">
                      2-3 ish kuni
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 p-2.5 rounded-xl">
                  <Phone className="w-4 h-4" />
                  <span>Kuryer kelishidan oldin {parentPhone} raqamiga qo‘ng‘iroq qiladi</span>
                </div>

                <button
                  onClick={handleClose}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-black text-sm shadow-lg hover:brightness-110 active:scale-98 transition"
                >
                  Ajoyib, tushundim! 🚀
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/20 flex items-center justify-center text-xl shrink-0">
                    🚚
                  </div>
                  <div className="text-xs">
                    <p className="font-black text-amber-900 dark:text-amber-200">
                      Sovg‘ani bepul yetkazib berish
                    </p>
                    <p className="text-zinc-600 dark:text-zinc-400">
                      Sovg‘a o‘quvchining yashash manziliga mutlaqo bepul eltib beriladi.
                    </p>
                  </div>
                </div>

                {/* Form fields */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-black text-zinc-700 dark:text-zinc-300 mb-1 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-amber-500" />
                      <span>O‘quvchi ismi va familiyasi</span>
                    </label>
                    <input
                      type="text"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold text-sm focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-zinc-700 dark:text-zinc-300 mb-1 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-amber-500" />
                      <span>Ota-ona telefon raqami (Kuryer bog‘lanishi uchun)</span>
                    </label>
                    <input
                      type="text"
                      value={parentPhone}
                      onChange={(e) => setParentPhone(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold text-sm focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-black text-zinc-700 dark:text-zinc-300 mb-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-500" />
                        <span>Viloyat / Shahar</span>
                      </label>
                      <input
                        type="text"
                        value={deliveryRegion}
                        onChange={(e) => setDeliveryRegion(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold text-sm focus:border-amber-500 outline-none"
                      />
                    </div>

                    {(prize.category === 'tshirt' || prize.category === 'cap') && (
                      <div>
                        <label className="block text-xs font-black text-zinc-700 dark:text-zinc-300 mb-1">
                          {prize.category === 'tshirt' ? "O‘lchami (Sinf/Bo‘y)" : "Bosh kiyimi o‘lchami"}
                        </label>
                        <select
                          value={sizeOrVariant}
                          onChange={(e) => setSizeOrVariant(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold text-sm focus:border-amber-500 outline-none"
                        >
                          {prize.category === 'tshirt' ? (
                            <>
                              <option value="1-2 sinf (30-32 o‘lcham)">1-2 sinf (30-32 o‘lcham)</option>
                              <option value="3-4 sinf (34-36 o‘lcham)">3-4 sinf (34-36 o‘lcham)</option>
                              <option value="5-sinf (38 o‘lcham)">5-sinf (38 o‘lcham)</option>
                            </>
                          ) : (
                            <>
                              <option value="Standart bolalar o‘lchami (moslanuvchan)">Standart (Moslanuvchan)</option>
                              <option value="Kichikroq (1-2 sinf)">Kichikroq (1-2 sinf)</option>
                              <option value="Kattaroq (3-4 sinf)">Kattaroq (3-4 sinf)</option>
                            </>
                          )}
                        </select>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-black text-zinc-700 dark:text-zinc-300 mb-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-500" />
                      <span>Yetkazib berish aniq manzili (Tuman, ko‘cha, uy raqami)</span>
                    </label>
                    <textarea
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      required
                      placeholder="Masalan: Yunusobod tumani, Amir Temur ko‘chasi, 45-uy"
                      rows={2}
                      className="w-full px-3.5 py-2.5 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold text-sm focus:border-amber-500 outline-none resize-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className={`w-full py-3.5 bg-gradient-to-r ${prize.color} text-white rounded-2xl font-black text-sm shadow-xl hover:brightness-110 active:scale-98 transition flex items-center justify-center gap-2`}
                  >
                    <Gift className="w-4 h-4" />
                    <span>Sovg‘ani Rasmiylashtirish & Yuborish</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
