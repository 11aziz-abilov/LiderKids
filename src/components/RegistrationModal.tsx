'use client';

import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { GradeLevel } from '@/types';
import { triggerConfetti } from './ConfettiEffect';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  Phone,
  User,
  GraduationCap,
  MapPin,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Coins,
  Lock,
  X,
  HelpCircle
} from 'lucide-react';

import { UZBEKISTAN_REGIONS } from '@/data/regionsData';

export default function RegistrationModal() {
  const {
    isRegistrationModalOpen,
    setIsRegistrationModalOpen,
    registerUser,
    progress
  } = useGame();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form Fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [grade, setGrade] = useState<GradeLevel>(progress.grade || 1);
  const [region, setRegion] = useState('Toshkent shahri');
  const [district, setDistrict] = useState(UZBEKISTAN_REGIONS['Toshkent shahri'][0]);
  const [school, setSchool] = useState('');

  const [parentName, setParentName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardHolder, setCardHolder] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isRegistrationModalOpen) return null;

  // Format Card Number (XXXX XXXX XXXX XXXX)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(formatted);
    if (errors.cardNumber) setErrors((prev) => ({ ...prev, cardNumber: '' }));
  };

  // Format Expiry (MM/YY)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 2) {
      let month = parseInt(raw.slice(0, 2), 10);
      if (month > 12) month = 12;
      if (month === 0) month = 1;
      const monthStr = month < 10 ? `0${month}` : `${month}`;
      raw = `${monthStr}/${raw.slice(2)}`;
    }
    setCardExpiry(raw);
    if (errors.cardExpiry) setErrors((prev) => ({ ...prev, cardExpiry: '' }));
  };

  // Format Phone (+998 (XX) XXX-XX-XX)
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numbers = e.target.value.replace(/\D/g, '');
    let clean = numbers;
    if (clean.startsWith('998')) {
      clean = clean.slice(3);
    }
    clean = clean.slice(0, 9);

    let formatted = '+998';
    if (clean.length > 0) formatted += ` (${clean.slice(0, 2)}`;
    if (clean.length >= 2) formatted += `) ${clean.slice(2, 5)}`;
    if (clean.length >= 5) formatted += `-${clean.slice(5, 7)}`;
    if (clean.length >= 7) formatted += `-${clean.slice(7, 9)}`;

    setPhoneNumber(clean.length > 0 ? formatted : '');
    if (errors.phoneNumber) setErrors((prev) => ({ ...prev, phoneNumber: '' }));
  };

  // Detect Card Provider
  const getCardType = (digits: string) => {
    const cleaned = digits.replace(/\s/g, '');
    if (cleaned.startsWith('8600')) return { name: 'UZCARD', color: 'from-blue-600 to-indigo-800' };
    if (cleaned.startsWith('9860')) return { name: 'HUMO', color: 'from-amber-500 to-orange-600' };
    if (cleaned.startsWith('4')) return { name: 'VISA', color: 'from-cyan-600 to-blue-700' };
    if (cleaned.startsWith('5')) return { name: 'MASTERCARD', color: 'from-rose-600 to-amber-700' };
    return { name: 'LIDER CARD', color: 'from-amber-600 via-orange-600 to-yellow-600' };
  };

  const cardType = getCardType(cardNumber);

  // Validate Step 1
  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!firstName.trim()) newErrors.firstName = 'Ismingizni kiriting';
    if (!lastName.trim()) newErrors.lastName = 'Familiyangizni kiriting';
    if (!district.trim()) newErrors.district = 'Tumanni tanlang';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate Step 2
  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!parentName.trim()) newErrors.parentName = 'Ota-ona yoki vasiy ismini kiriting';
    const digits = phoneNumber.replace(/\D/g, '');
    if (digits.length < 12) newErrors.phoneNumber = 'To‘liq telefon raqamini kiriting (masalan: +998 90 123-45-67)';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate Step 3
  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    const rawCard = cardNumber.replace(/\s/g, '');
    if (rawCard.length !== 16) newErrors.cardNumber = 'Karta raqami 16 ta raqamdan iborat bo‘lishi kerak';
    if (cardExpiry.length < 5) newErrors.cardExpiry = 'Amal qilish muddatini kiriting (MM/YY)';
    if (!cardHolder.trim()) newErrors.cardHolder = 'Karta egasining ismini kiriting';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1) {
      if (validateStep1()) setStep(2);
    } else if (step === 2) {
      if (validateStep2()) setStep(3);
    } else if (step === 3) {
      if (validateStep3()) {
        // Complete Registration!
        registerUser({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          grade,
          region,
          district: district.trim(),
          school: school.trim() || undefined,
          parentName: parentName.trim(),
          phoneNumber,
          cardNumber: cardNumber.trim(),
          cardExpiry: cardExpiry.trim(),
          cardHolder: cardHolder.trim().toUpperCase(),
        });
        setStep(4);
        triggerConfetti();
      }
    }
  };

  const handleFinish = () => {
    setIsRegistrationModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto animate-in fade-in duration-300">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border-2 border-amber-300/60 dark:border-zinc-700 w-full max-w-xl overflow-hidden my-8"
      >
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-6 py-5 text-white relative">
          {step !== 4 && (
            <button
              onClick={() => setIsRegistrationModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition"
              title="Keyinroq to‘ldirish"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner">
              🦁
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
                  LiderKids Platformasi
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-yellow-200">
                  <Coins className="w-3.5 h-3.5 fill-yellow-300" />
                  +100 Tanga Bonus!
                </span>
              </div>
              <h2 className="text-2xl font-black tracking-tight mt-0.5">
                {step === 4 ? "Ro‘yxatdan o‘tdingiz! 🎉" : "O‘quvchini Ro‘yxatdan O‘tkazish"}
              </h2>
            </div>
          </div>

          {/* Stepper indicator */}
          {step !== 4 && (
            <div className="mt-4 flex items-center justify-between text-xs font-extrabold text-amber-100">
              <div className="flex items-center gap-1.5">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${step >= 1 ? 'bg-white text-orange-600' : 'bg-white/30 text-white'}`}>
                  1
                </div>
                <span>O‘quvchi</span>
              </div>
              <div className="w-8 h-0.5 bg-white/40" />
              <div className="flex items-center gap-1.5">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${step >= 2 ? 'bg-white text-orange-600' : 'bg-white/30 text-white'}`}>
                  2
                </div>
                <span>Aloqa</span>
              </div>
              <div className="w-8 h-0.5 bg-white/40" />
              <div className="flex items-center gap-1.5">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${step >= 3 ? 'bg-white text-orange-600' : 'bg-white/30 text-white'}`}>
                  3
                </div>
                <span>Karta</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Body Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {/* STEP 1: Student Details */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="bg-amber-50 dark:bg-zinc-800/60 p-3.5 rounded-2xl border border-amber-200 dark:border-zinc-700 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-amber-900 dark:text-amber-200 font-medium">
                    Prezident maktabiga tayyorlov sarguzashtiga xush kelibsiz! O‘quvchi ma‘lumotlarini kiriting va birinchi qadamni tashlang.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* First Name */}
                  <div>
                    <label className="block text-xs font-black text-zinc-700 dark:text-zinc-300 uppercase mb-1">
                      O‘quvchi Ismi <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-400" />
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => {
                          setFirstName(e.target.value);
                          if (errors.firstName) setErrors((prev) => ({ ...prev, firstName: '' }));
                        }}
                        placeholder="Masalan: Azizbek"
                        className={`w-full pl-10 pr-3 py-2.5 rounded-xl border-2 bg-zinc-50 dark:bg-zinc-800 text-sm font-bold text-zinc-800 dark:text-zinc-100 outline-none transition ${
                          errors.firstName ? 'border-red-400 bg-red-50/50' : 'border-zinc-200 dark:border-zinc-700 focus:border-amber-500'
                        }`}
                      />
                    </div>
                    {errors.firstName && <p className="text-xs text-red-500 mt-1 font-semibold">{errors.firstName}</p>}
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-xs font-black text-zinc-700 dark:text-zinc-300 uppercase mb-1">
                      O‘quvchi Familiyasi <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-400" />
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => {
                          setLastName(e.target.value);
                          if (errors.lastName) setErrors((prev) => ({ ...prev, lastName: '' }));
                        }}
                        placeholder="Masalan: Karimov"
                        className={`w-full pl-10 pr-3 py-2.5 rounded-xl border-2 bg-zinc-50 dark:bg-zinc-800 text-sm font-bold text-zinc-800 dark:text-zinc-100 outline-none transition ${
                          errors.lastName ? 'border-red-400 bg-red-50/50' : 'border-zinc-200 dark:border-zinc-700 focus:border-amber-500'
                        }`}
                      />
                    </div>
                    {errors.lastName && <p className="text-xs text-red-500 mt-1 font-semibold">{errors.lastName}</p>}
                  </div>
                </div>

                {/* Grade Selection */}
                <div>
                  <label className="block text-xs font-black text-zinc-700 dark:text-zinc-300 uppercase mb-2">
                    Sinfni tanlang <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {([1, 2, 3, 4] as GradeLevel[]).map((g) => {
                      const isSelected = grade === g;
                      return (
                        <button
                          type="button"
                          key={g}
                          onClick={() => setGrade(g)}
                          className={`py-2.5 px-3 rounded-2xl border-2 text-center transition flex flex-col items-center gap-1 ${
                            isSelected
                              ? 'border-orange-500 bg-orange-500 text-white shadow-md shadow-orange-500/20'
                              : 'border-zinc-200 dark:border-zinc-700 hover:border-amber-400 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                          }`}
                        >
                          <span className="text-base font-black">{g}-sinf</span>
                          <span className={`text-[10px] font-bold ${isSelected ? 'text-amber-100' : 'text-zinc-400'}`}>
                            {g === 1 ? '🐾 Baby' : g === 2 ? '⚡ Play' : g === 3 ? '🎯 Teen' : '👑 King'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  {/* Academic year lock explanation */}
                  <div className="mt-2.5 bg-amber-100/70 dark:bg-amber-950/50 p-2.5 rounded-xl border border-amber-300 dark:border-amber-700/60 text-[11px] font-bold text-amber-950 dark:text-amber-200 flex items-start gap-2">
                    <span className="text-base shrink-0">🔒</span>
                    <span className="leading-snug">
                      Tanlangan sinf joriy o‘quv yili davomida (25-maygacha) qat‘iy belgilanadi va boshqa sinflar ko‘rinmaydi. O‘quv yili tugagach avtomatik keyingi sinfga o‘tiladi.
                    </span>
                  </div>
                </div>

                {/* Region & District */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Viloyat */}
                  <div>
                    <label className="block text-xs font-black text-zinc-700 dark:text-zinc-300 uppercase mb-1">
                      Viloyat <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-400" />
                      <select
                        value={region}
                        onChange={(e) => {
                          const newReg = e.target.value;
                          setRegion(newReg);
                          const districts = UZBEKISTAN_REGIONS[newReg] || [];
                          setDistrict(districts[0] || '');
                        }}
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm font-bold text-zinc-800 dark:text-zinc-100 outline-none focus:border-amber-500 transition"
                      >
                        {Object.keys(UZBEKISTAN_REGIONS).map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Tuman / Shahar */}
                  <div>
                    <label className="block text-xs font-black text-zinc-700 dark:text-zinc-300 uppercase mb-1">
                      Tuman / Shahar <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 absolute left-3.5 top-3.5 text-amber-500" />
                      <select
                        value={district}
                        onChange={(e) => {
                          setDistrict(e.target.value);
                          if (errors.district) setErrors((prev) => ({ ...prev, district: '' }));
                        }}
                        className={`w-full pl-10 pr-3 py-2.5 rounded-xl border-2 bg-zinc-50 dark:bg-zinc-800 text-sm font-bold text-zinc-800 dark:text-zinc-100 outline-none transition ${
                          errors.district ? 'border-red-400 bg-red-50/50' : 'border-zinc-200 dark:border-zinc-700 focus:border-amber-500'
                        }`}
                      >
                        {(UZBEKISTAN_REGIONS[region] || []).map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.district && <p className="text-xs text-red-500 mt-1 font-semibold">{errors.district}</p>}
                  </div>
                </div>

                {/* Maktab */}
                <div>
                  <label className="block text-xs font-black text-zinc-700 dark:text-zinc-300 uppercase mb-1">
                    Maktab raqami yoki nomi (Ixtiyoriy)
                  </label>
                  <div className="relative">
                    <GraduationCap className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-400" />
                    <input
                      type="text"
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                      placeholder="Masalan: 45-maktab yoki 1-Prezident maktabi"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm font-bold text-zinc-800 dark:text-zinc-100 outline-none focus:border-amber-500 transition"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Parent & Contact Details */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="bg-sky-50 dark:bg-sky-950/40 p-3.5 rounded-2xl border border-sky-200 dark:border-sky-800 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-sky-900 dark:text-sky-200 font-medium">
                    Test natijalari, o‘quvchining yutuqlari va sertifikatlar ota-onaga SMS yoki Telegram orqali yuboriladi.
                  </p>
                </div>

                {/* Parent Name */}
                <div>
                  <label className="block text-xs font-black text-zinc-700 dark:text-zinc-300 uppercase mb-1">
                    Ota-ona yoki Vasiy Ismi <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-400" />
                    <input
                      type="text"
                      value={parentName}
                      onChange={(e) => {
                        setParentName(e.target.value);
                        if (errors.parentName) setErrors((prev) => ({ ...prev, parentName: '' }));
                      }}
                      placeholder="Masalan: Malika Karimova (onasi)"
                      className={`w-full pl-10 pr-3 py-2.5 rounded-xl border-2 bg-zinc-50 dark:bg-zinc-800 text-sm font-bold text-zinc-800 dark:text-zinc-100 outline-none transition ${
                        errors.parentName ? 'border-red-400 bg-red-50/50' : 'border-zinc-200 dark:border-zinc-700 focus:border-amber-500'
                      }`}
                    />
                  </div>
                  {errors.parentName && <p className="text-xs text-red-500 mt-1 font-semibold">{errors.parentName}</p>}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-black text-zinc-700 dark:text-zinc-300 uppercase mb-1">
                    Telefon Raqam (SMS va Natijalar uchun) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-400" />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={handlePhoneChange}
                      placeholder="+998 (90) 123-45-67"
                      className={`w-full pl-10 pr-3 py-2.5 rounded-xl border-2 bg-zinc-50 dark:bg-zinc-800 text-sm font-bold text-zinc-800 dark:text-zinc-100 outline-none transition font-mono ${
                        errors.phoneNumber ? 'border-red-400 bg-red-50/50' : 'border-zinc-200 dark:border-zinc-700 focus:border-amber-500'
                      }`}
                    />
                  </div>
                  {errors.phoneNumber && <p className="text-xs text-red-500 mt-1 font-semibold">{errors.phoneNumber}</p>}
                  <p className="text-[11px] text-zinc-400 mt-1 font-medium">
                    O‘zbekiston aloqa operatorlari raqami (+998)
                  </p>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Payment Card Details */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                {/* Live Bank Card Preview */}
                <div
                  className={`relative w-full rounded-2xl p-5 text-white shadow-xl bg-gradient-to-tr ${cardType.color} overflow-hidden transition-all duration-300 border border-white/20`}
                >
                  {/* Decorative background glow */}
                  <div className="absolute top-0 right-0 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-black/20 rounded-full blur-xl pointer-events-none" />

                  {/* Top card row */}
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black tracking-widest uppercase bg-black/25 px-2.5 py-0.5 rounded-md">
                        {cardType.name}
                      </span>
                      <span className="text-[10px] font-bold text-amber-200">LiderKids Pay</span>
                    </div>
                    <div className="flex items-center gap-1.5 opacity-80">
                      <div className="w-2.5 h-2.5 rounded-full bg-white/60" />
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-white/80" />
                    </div>
                  </div>

                  {/* Chip Icon */}
                  <div className="my-4 relative z-10 flex items-center justify-between">
                    <div className="w-10 h-7 rounded-md bg-gradient-to-br from-yellow-200 to-amber-400 border border-amber-500 shadow-inner flex items-center justify-center">
                      <div className="w-6 h-4 border border-amber-600/50 rounded-sm grid grid-cols-2 gap-0.5">
                        <div className="border-r border-amber-600/40" />
                        <div />
                      </div>
                    </div>
                    <Lock className="w-4 h-4 text-white/70" />
                  </div>

                  {/* Card Number */}
                  <div className="font-mono text-lg sm:text-xl font-black tracking-widest relative z-10">
                    {cardNumber || '•••• •••• •••• ••••'}
                  </div>

                  {/* Bottom row: Holder & Expiry */}
                  <div className="mt-3 flex items-center justify-between text-xs relative z-10 uppercase font-semibold">
                    <div>
                      <div className="text-[9px] text-white/70 tracking-wider">Karta Egasi</div>
                      <div className="font-bold tracking-wide truncate max-w-[180px]">
                        {cardHolder || (firstName ? `${firstName} ${lastName}`.toUpperCase() : 'ISMI FAMILIYASI')}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[9px] text-white/70 tracking-wider">Amal Qilish</div>
                      <div className="font-mono font-bold tracking-wider">{cardExpiry || 'MM/YY'}</div>
                    </div>
                  </div>
                </div>

                {/* Card Inputs */}
                <div className="space-y-3">
                  {/* Card Number Input */}
                  <div>
                    <label className="block text-xs font-black text-zinc-700 dark:text-zinc-300 uppercase mb-1">
                      Karta Raqami (Uzcard / Humo / Visa) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <CreditCard className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-400" />
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="8600 0000 0000 0000"
                        className={`w-full pl-10 pr-3 py-2.5 rounded-xl border-2 bg-zinc-50 dark:bg-zinc-800 text-sm font-bold text-zinc-800 dark:text-zinc-100 outline-none font-mono transition ${
                          errors.cardNumber ? 'border-red-400 bg-red-50/50' : 'border-zinc-200 dark:border-zinc-700 focus:border-amber-500'
                        }`}
                      />
                    </div>
                    {errors.cardNumber && <p className="text-xs text-red-500 mt-1 font-semibold">{errors.cardNumber}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Expiry */}
                    <div>
                      <label className="block text-xs font-black text-zinc-700 dark:text-zinc-300 uppercase mb-1">
                        Amal Qilish Muddati <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={handleExpiryChange}
                        placeholder="MM/YY (Masalan: 12/28)"
                        className={`w-full px-3.5 py-2.5 rounded-xl border-2 bg-zinc-50 dark:bg-zinc-800 text-sm font-bold text-zinc-800 dark:text-zinc-100 outline-none font-mono transition ${
                          errors.cardExpiry ? 'border-red-400 bg-red-50/50' : 'border-zinc-200 dark:border-zinc-700 focus:border-amber-500'
                        }`}
                      />
                      {errors.cardExpiry && <p className="text-xs text-red-500 mt-1 font-semibold">{errors.cardExpiry}</p>}
                    </div>

                    {/* Cardholder */}
                    <div>
                      <label className="block text-xs font-black text-zinc-700 dark:text-zinc-300 uppercase mb-1">
                        Karta Egasi <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={cardHolder}
                        onChange={(e) => {
                          setCardHolder(e.target.value.toUpperCase());
                          if (errors.cardHolder) setErrors((prev) => ({ ...prev, cardHolder: '' }));
                        }}
                        placeholder="AZIZBEK KARIMOV"
                        className={`w-full px-3.5 py-2.5 rounded-xl border-2 bg-zinc-50 dark:bg-zinc-800 text-sm font-bold text-zinc-800 dark:text-zinc-100 outline-none transition uppercase ${
                          errors.cardHolder ? 'border-red-400 bg-red-50/50' : 'border-zinc-200 dark:border-zinc-700 focus:border-amber-500'
                        }`}
                      />
                      {errors.cardHolder && <p className="text-xs text-red-500 mt-1 font-semibold">{errors.cardHolder}</p>}
                    </div>
                  </div>

                  {/* Security Note */}
                  <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 pt-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>256-bit shifrlangan xavfsiz tizim. Kurs to‘lovlari va g‘oliblik mukofotlari uchun.</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 4: Success Celebration */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-6 space-y-4"
              >
                <div className="w-24 h-24 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-3xl mx-auto flex items-center justify-center text-5xl shadow-xl animate-bounce">
                  🦁
                </div>

                <div className="space-y-1">
                  <h3 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">
                    Xush kelibsiz, {firstName}! 🌟
                  </h3>
                  <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-300 max-w-md mx-auto">
                    Siz muvaffaqiyatli ro‘yxatdan o‘tdingiz! Barcha darslar, Prezident maktabi testlari va sovrinlar siz uchun ochildi.
                  </p>
                </div>

                {/* Reward Callout */}
                <div className="bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-950/60 dark:to-orange-950/60 border-2 border-amber-300 dark:border-amber-700 p-4 rounded-2xl max-w-sm mx-auto shadow-sm">
                  <div className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider mb-1">
                    🎁 Boshlang‘ich Sovg‘a Qutisi
                  </div>
                  <div className="flex items-center justify-center gap-6">
                    <div className="flex items-center gap-1.5 font-black text-lg text-amber-900 dark:text-amber-200">
                      <span className="text-2xl">🪙</span>
                      <span>+100 Tanga</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-black text-lg text-orange-900 dark:text-orange-200">
                      <span className="text-2xl">⚡</span>
                      <span>+50 XP</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleFinish}
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-base rounded-2xl shadow-lg shadow-orange-500/30 transition-all hover:scale-105 active:scale-95"
                >
                  🚀 Sarguzashtni Boshlash!
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Modal Footer Controls */}
        {step !== 4 && (
          <div className="bg-zinc-50 dark:bg-zinc-800/80 px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Orqaga</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsRegistrationModalOpen(false)}
                className="text-xs font-extrabold text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition"
              >
                Keyinroq to‘ldirish
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md shadow-orange-500/20 hover:scale-105 active:scale-95 transition"
            >
              <span>{step === 3 ? "Tasdiqlash & Ro‘yxatdan o‘tish" : "Keyingisi"}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
