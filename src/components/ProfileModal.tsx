'use client';

import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { GradeLevel } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  CreditCard,
  Phone,
  MapPin,
  GraduationCap,
  ShieldCheck,
  Edit2,
  Check,
  X,
  Coins,
  Flame,
  Trophy,
  Sparkles,
  LogOut,
  Calendar
} from 'lucide-react';

import { UZBEKISTAN_REGIONS } from '@/data/regionsData';

export default function ProfileModal() {
  const {
    isProfileModalOpen,
    setIsProfileModalOpen,
    setIsRegistrationModalOpen,
    progress,
    updateProfile,
    advanceAcademicYearManually,
    resetProgress,
    lionStage
  } = useGame();

  const [isEditing, setIsEditing] = useState(false);
  const profile = progress.profile;

  // Editable fields
  const [firstName, setFirstName] = useState(profile?.firstName || '');
  const [lastName, setLastName] = useState(profile?.lastName || '');
  const [grade, setGrade] = useState<GradeLevel>(profile?.grade || progress.grade || 1);
  const [phoneNumber, setPhoneNumber] = useState(profile?.phoneNumber || '');
  const [parentName, setParentName] = useState(profile?.parentName || '');
  const [region, setRegion] = useState(profile?.region || 'Toshkent shahri');
  const [district, setDistrict] = useState(profile?.district || (UZBEKISTAN_REGIONS['Toshkent shahri']?.[0] || ''));
  const [cardNumber, setCardNumber] = useState(profile?.cardNumber || '');
  const [cardExpiry, setCardExpiry] = useState(profile?.cardExpiry || '');
  const [cardHolder, setCardHolder] = useState(profile?.cardHolder || '');

  if (!isProfileModalOpen) return null;

  const handleSave = () => {
    updateProfile({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      grade,
      phoneNumber,
      parentName: parentName.trim(),
      region,
      district: district.trim(),
      cardNumber: cardNumber.trim(),
      cardExpiry: cardExpiry.trim(),
      cardHolder: cardHolder.trim().toUpperCase(),
    });
    setIsEditing(false);
  };

  const handleReset = () => {
    if (confirm("Haqiqatan ham qaytadan ro‘yxatdan o‘tishni xohlaysizmi?")) {
      resetProgress();
      setIsProfileModalOpen(false);
      setIsRegistrationModalOpen(true);
    }
  };

  const getMaskedCard = (cardNum?: string) => {
    if (!cardNum) return 'Karta bog‘lanmagan';
    const clean = cardNum.replace(/\s/g, '');
    if (clean.length < 16) return cardNum;
    return `${clean.slice(0, 4)} •••• •••• ${clean.slice(12)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto animate-in fade-in duration-300">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border-2 border-amber-300/60 dark:border-zinc-700 w-full max-w-lg overflow-hidden my-8"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-6 py-6 text-white relative">
          <button
            onClick={() => setIsProfileModalOpen(false)}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-4xl shadow-inner border border-white/30">
              🦁
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-0.5 rounded-full text-xs font-black uppercase">
                <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
                <span>{lionStage.badge}</span>
              </div>
              <h2 className="text-2xl font-black tracking-tight mt-1">
                {profile ? `${profile.firstName} ${profile.lastName}` : progress.name}
              </h2>
              <p className="text-xs text-amber-100 font-semibold">
                {profile?.region || 'O‘zbekiston'} • {progress.grade}-sinf o‘quvchisi
              </p>
            </div>
          </div>

          {/* Quick stats row */}
          <div className="grid grid-cols-3 gap-2 mt-5">
            <div className="bg-white/15 backdrop-blur-md rounded-xl p-2.5 text-center border border-white/20">
              <div className="text-xs font-bold text-amber-100 flex items-center justify-center gap-1">
                <Coins className="w-3.5 h-3.5" /> Tangalar
              </div>
              <div className="text-lg font-black">{progress.coins} ta</div>
            </div>
            <div className="bg-white/15 backdrop-blur-md rounded-xl p-2.5 text-center border border-white/20">
              <div className="text-xs font-bold text-amber-100 flex items-center justify-center gap-1">
                <Flame className="w-3.5 h-3.5" /> Olovchalar
              </div>
              <div className="text-lg font-black">{progress.streaks} ta</div>
            </div>
            <div className="bg-white/15 backdrop-blur-md rounded-xl p-2.5 text-center border border-white/20">
              <div className="text-xs font-bold text-amber-100 flex items-center justify-center gap-1">
                <Trophy className="w-3.5 h-3.5" /> Tajriba
              </div>
              <div className="text-lg font-black">{progress.xp} XP</div>
            </div>
          </div>
        </div>

        {/* Body content */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <User className="w-5 h-5 text-amber-500" />
              <span>O‘quvchi va Oila Ma‘lumotlari</span>
            </h3>
            {!isEditing ? (
              <button
                onClick={() => {
                  setFirstName(profile?.firstName || '');
                  setLastName(profile?.lastName || '');
                  setGrade(profile?.grade || progress.grade || 1);
                  setPhoneNumber(profile?.phoneNumber || '');
                  setParentName(profile?.parentName || '');
                  setRegion(profile?.region || 'Toshkent shahri');
                  setCardNumber(profile?.cardNumber || '');
                  setCardExpiry(profile?.cardExpiry || '');
                  setCardHolder(profile?.cardHolder || '');
                  setIsEditing(true);
                }}
                className="flex items-center gap-1.5 text-xs font-extrabold text-orange-600 dark:text-orange-400 hover:underline"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Tahrirlash</span>
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500 text-white rounded-lg text-xs font-extrabold hover:bg-emerald-600 transition"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Saqlash</span>
              </button>
            )}
          </div>

          {/* Details list / Edit form */}
          <div className="bg-zinc-50 dark:bg-zinc-800/60 rounded-2xl p-4 border border-zinc-200 dark:border-zinc-700/80 space-y-3">
            {isEditing ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-black uppercase text-zinc-500">Ism</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full p-2 text-xs font-bold rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-zinc-500">Familiya</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full p-2 text-xs font-bold rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-zinc-500">Telefon raqam</label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full p-2 text-xs font-bold rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-zinc-500">Ota-ona ismi</label>
                  <input
                    type="text"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    className="w-full p-2 text-xs font-bold rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-black uppercase text-zinc-500">Viloyat</label>
                    <select
                      value={region}
                      onChange={(e) => {
                        const newR = e.target.value;
                        setRegion(newR);
                        const dists = UZBEKISTAN_REGIONS[newR] || [];
                        setDistrict(dists[0] || '');
                      }}
                      className="w-full p-2 text-xs font-bold rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 outline-none"
                    >
                      {Object.keys(UZBEKISTAN_REGIONS).map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-zinc-500">Tuman / Shahar</label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full p-2 text-xs font-bold rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 outline-none"
                    >
                      {(UZBEKISTAN_REGIONS[region] || []).map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-zinc-500">Karta raqami</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full p-2 text-xs font-bold rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 outline-none font-mono"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2.5 text-xs sm:text-sm">
                <div className="flex items-center justify-between py-1 border-b border-zinc-200 dark:border-zinc-700">
                  <span className="text-zinc-500 dark:text-zinc-400 font-bold flex items-center gap-1.5">
                    <User className="w-4 h-4 text-amber-500" /> O‘quvchi:
                  </span>
                  <span className="font-black text-zinc-800 dark:text-zinc-200">
                    {profile ? `${profile.firstName} ${profile.lastName}` : progress.name}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-zinc-200 dark:border-zinc-700">
                  <span className="text-zinc-500 dark:text-zinc-400 font-bold flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-orange-500" /> Sinf:
                  </span>
                  <span className="font-black text-zinc-800 dark:text-zinc-200">
                    {progress.grade}-sinf ({profile?.academicYear || "2025-2026"} o‘quv yili)
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-zinc-200 dark:border-zinc-700">
                  <span className="text-zinc-500 dark:text-zinc-400 font-bold flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-emerald-500" /> Telefon:
                  </span>
                  <span className="font-black font-mono text-zinc-800 dark:text-zinc-200">
                    {profile?.phoneNumber || "Ko‘rsatilmagan"}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-zinc-200 dark:border-zinc-700">
                  <span className="text-zinc-500 dark:text-zinc-400 font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-sky-500" /> Ota-ona / Vasiy:
                  </span>
                  <span className="font-black text-zinc-800 dark:text-zinc-200">
                    {profile?.parentName || "Ko‘rsatilmagan"}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-zinc-200 dark:border-zinc-700">
                  <span className="text-zinc-500 dark:text-zinc-400 font-bold flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-rose-500" /> Hudud:
                  </span>
                  <span className="font-black text-zinc-800 dark:text-zinc-200 text-right">
                    {profile?.region || "Toshkent shahri"}
                    {profile?.district ? `, ${profile.district}` : ''}
                  </span>
                </div>

                {profile?.school && (
                  <div className="flex items-center justify-between py-1 border-b border-zinc-200 dark:border-zinc-700">
                    <span className="text-zinc-500 dark:text-zinc-400 font-bold flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-amber-500" /> Maktab:
                    </span>
                    <span className="font-black text-zinc-800 dark:text-zinc-200">
                      {profile.school}
                    </span>
                  </div>
                )}

                {profile?.registeredAt && (
                  <div className="flex items-center justify-between py-1">
                    <span className="text-zinc-500 dark:text-zinc-400 font-bold flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-indigo-500" /> A‘zolik sanasi:
                    </span>
                    <span className="font-semibold text-zinc-600 dark:text-zinc-400 text-xs">
                      {new Date(profile.registeredAt).toLocaleDateString('uz-UZ')}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* O'quv yili va Avtomatik sinf yangilanishi kartasi */}
          <div className="bg-amber-100/60 dark:bg-amber-950/40 p-4 rounded-2xl border border-amber-300 dark:border-amber-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-black text-amber-950 dark:text-amber-200">
              <span className="flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-orange-500" />
                <span>O‘quv yili: {profile?.academicYear || "2025-2026"}</span>
              </span>
              <span className="bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100 px-2 py-0.5 rounded-full text-[10px]">
                Yakun: 25-may
              </span>
            </div>
            <p className="text-[11px] text-zinc-600 dark:text-zinc-400 font-medium">
              O‘quv yili 25-mayda yakunlangach, tizim avtomatik ravishda keyingi sinfga o‘tkazadi va boshqa sinflar ko‘rinmaydi.
            </p>
            {progress.grade < 4 ? (
              <button
                onClick={() => {
                  advanceAcademicYearManually();
                  setIsProfileModalOpen(false);
                }}
                className="w-full mt-1 py-2 px-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
                title="O'quv yili yakunlanganda keyingi sinfga o'tishni sinab ko'rish"
              >
                <span>🎓 O‘quv yilini yakunlash (Keyingi sinfga o‘tishni sinash)</span>
              </button>
            ) : (
              <div className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 text-center py-1">
                👑 Siz 4-sinf — Prezident maktabi nomzodisiz!
              </div>
            )}
          </div>

          {/* Linked Bank Card Section */}
          <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 dark:from-amber-950/40 dark:to-orange-950/40 p-4 rounded-2xl border border-amber-300 dark:border-amber-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                  <span>Bog‘langan Karta</span>
                  <span className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-bold">
                    Faol
                  </span>
                </div>
                <div className="text-xs font-mono font-bold text-zinc-600 dark:text-zinc-400 mt-0.5">
                  {getMaskedCard(profile?.cardNumber)}
                </div>
              </div>
            </div>
            {profile?.cardExpiry && (
              <div className="text-right text-xs font-mono font-bold text-zinc-500">
                {profile.cardExpiry}
              </div>
            )}
          </div>

          {/* Bottom Actions */}
          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-700 transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Qaytadan ro‘yxatdan o‘tish</span>
            </button>

            <button
              onClick={() => setIsProfileModalOpen(false)}
              className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-black shadow transition"
            >
              Yopish
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
