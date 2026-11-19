'use client';

import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { GradeLevel } from '@/types';
import { triggerConfetti } from './ConfettiEffect';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone,
  User,
  GraduationCap,
  MapPin,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  X,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { UZBEKISTAN_REGIONS } from '@/data/regionsData';

export default function RegistrationModal() {
  const {
    isRegistrationModalOpen,
    setIsRegistrationModalOpen,
    registerUser,
    loginUserByPhone,
    progress,
  } = useGame();

  const isRegistered = Boolean(progress.profile?.isRegistered);

  const [authMode, setAuthMode] = useState<'register' | 'login'>('register');
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form Fields for Registration
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [grade, setGrade] = useState<GradeLevel>(progress.grade || 1);
  const [gender, setGender] = useState<'boy' | 'girl'>('boy');
  const [region, setRegion] = useState('Toshkent shahri');
  const [district, setDistrict] = useState(UZBEKISTAN_REGIONS['Toshkent shahri'][0]);
  const [school, setSchool] = useState('');

  const [parentName, setParentName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Login Form
  const [loginPhone, setLoginPhone] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isRegistrationModalOpen) return null;

  // Format Phone (+998 (XX) XXX-XX-XX)
  const formatUzbekPhone = (val: string) => {
    const numbers = val.replace(/\D/g, '');
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

    return clean.length > 0 ? formatted : '';
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatUzbekPhone(e.target.value);
    setPhoneNumber(formatted);
    if (errors.phoneNumber) setErrors((prev) => ({ ...prev, phoneNumber: '' }));
  };

  const handleLoginPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatUzbekPhone(e.target.value);
    setLoginPhone(formatted);
    if (loginError) setLoginError('');
  };

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

  const handleNext = async () => {
    if (step === 1) {
      if (validateStep1()) setStep(2);
    } else if (step === 2) {
      if (validateStep2()) {
        setIsSubmitting(true);
        try {
          await registerUser({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            grade,
            gender,
            region,
            district: district.trim(),
            school: school.trim() || undefined,
            parentName: parentName.trim(),
            phoneNumber,
            parentPhoneNumber: phoneNumber,
            smsNotificationsEnabled: true,
            lastActiveDate: new Date().toISOString(),
          });
          setStep(3);
          triggerConfetti();
        } finally {
          setIsSubmitting(false);
        }
      }
    }
  };

  const handleLoginSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const digits = loginPhone.replace(/\D/g, '');
    if (digits.length < 12) {
      setLoginError('Iltimos, to‘liq telefon raqamini kiriting (masalan: +998 90 123-45-67)');
      return;
    }

    setIsLoggingIn(true);
    setLoginError('');
    try {
      const res = await loginUserByPhone(loginPhone);
      if (res.success) {
        triggerConfetti();
        setIsRegistrationModalOpen(false);
      } else {
        setLoginError(res.error || 'O‘quvchi topilmadi');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleFinish = () => {
    setIsRegistrationModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto animate-in fade-in duration-300">
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0 }}
        className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border-2 border-amber-300/60 dark:border-zinc-700 w-full max-w-xl overflow-hidden my-6"
      >
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-6 py-5 text-white relative">
          {isRegistered && step !== 3 && (
            <button
              onClick={() => setIsRegistrationModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
              title="Yopish"
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
                <span className="text-xs font-bold text-yellow-200">
                  Prezident Maktabiga Tayyorlov
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-0.5">
                {step === 3
                  ? "Ro‘yxatdan o‘tdingiz! 🎉"
                  : authMode === 'login'
                  ? "Tizimga Kirish"
                  : "O‘quvchini Ro‘yxatdan O‘tkazish"}
              </h2>
            </div>
          </div>

          {/* Stepper indicator (only for registration flow) */}
          {authMode === 'register' && step !== 3 && (
            <div className="mt-4 flex items-center justify-start gap-4 text-xs font-extrabold text-amber-100">
              <div className="flex items-center gap-1.5">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                    step >= 1 ? 'bg-white text-orange-600' : 'bg-white/30 text-white'
                  }`}
                >
                  1
                </div>
                <span>1-qadam: O‘quvchi</span>
              </div>
              <div className="w-10 h-0.5 bg-white/40" />
              <div className="flex items-center gap-1.5">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                    step >= 2 ? 'bg-white text-orange-600' : 'bg-white/30 text-white'
                  }`}
                >
                  2
                </div>
                <span>2-qadam: Ota-ona aloqasi</span>
              </div>
            </div>
          )}
        </div>

        {/* Tab Switcher: Ro'yxatdan o'tish vs Kirish */}
        {step !== 3 && (
          <div className="flex border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100/80 dark:bg-zinc-800/60 p-1.5 gap-1.5">
            <button
              type="button"
              onClick={() => {
                setAuthMode('register');
                setLoginError('');
              }}
              className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer flex items-center justify-center gap-2 ${
                authMode === 'register'
                  ? 'bg-white dark:bg-zinc-700 text-orange-600 dark:text-orange-400 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Yangi o‘quvchi (Ro‘yxatdan o‘tish)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setErrors({});
              }}
              className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer flex items-center justify-center gap-2 ${
                authMode === 'login'
                  ? 'bg-white dark:bg-zinc-700 text-orange-600 dark:text-orange-400 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Mening profilim bor (Kirish)</span>
            </button>
          </div>
        )}

        {/* Modal Body Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {/* LOGIN MODE */}
            {authMode === 'login' && (
              <motion.div
                key="login-mode"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                className="space-y-4"
              >
                <div className="bg-amber-50 dark:bg-zinc-800/60 p-3.5 rounded-2xl border border-amber-200 dark:border-zinc-700 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-amber-900 dark:text-amber-200 font-medium">
                    Avval ro‘yxatdan o‘tgan ota-ona telefon raqamini kiriting. Barcha tangalar, streak va yutuqlaringiz saqlangan holda ochiladi.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-black text-zinc-700 dark:text-zinc-300 uppercase mb-1">
                    Ota-ona telefon raqami <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-400" />
                    <input
                      type="tel"
                      value={loginPhone}
                      onChange={handleLoginPhoneChange}
                      placeholder="+998 (90) 123-45-67"
                      className={`w-full pl-10 pr-3 py-2.5 rounded-xl border-2 bg-zinc-50 dark:bg-zinc-800 text-sm font-bold text-zinc-800 dark:text-zinc-100 outline-none transition font-mono ${
                        loginError
                          ? 'border-red-400 bg-red-50/50'
                          : 'border-zinc-200 dark:border-zinc-700 focus:border-amber-500'
                      }`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleLoginSubmit();
                        }
                      }}
                    />
                  </div>
                  {loginError && (
                    <p className="text-xs text-red-500 mt-2 font-semibold bg-red-50 dark:bg-red-950/40 p-2.5 rounded-xl border border-red-200 dark:border-red-800">
                      ⚠️ {loginError}
                    </p>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    disabled={isLoggingIn}
                    onClick={() => handleLoginSubmit()}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-sm font-black bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-orange-500/25 hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer disabled:opacity-60"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>{isLoggingIn ? 'Tekshirilmoqda...' : 'Tizimga Kirish'}</span>
                  </button>
                </div>

                <div className="text-center pt-2">
                  <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
                    Hali ro‘yxatdan o‘tmaganmisiz?{' '}
                    <button
                      type="button"
                      onClick={() => setAuthMode('register')}
                      className="text-orange-500 hover:text-orange-600 underline font-black cursor-pointer"
                    >
                      Ro‘yxatdan o‘tish
                    </button>
                  </p>
                </div>
              </motion.div>
            )}

            {/* REGISTER STEP 1: Student Details */}
            {authMode === 'register' && step === 1 && (
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
                    Prezident maktabiga tayyorlov platformasiga xush kelibsiz! O‘quvchi ma‘lumotlarini kiriting va yangi bilimlarni boshlang.
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

                {/* Gender Selection */}
                <div>
                  <label className="block text-xs font-black text-zinc-700 dark:text-zinc-300 uppercase mb-1.5">
                    O‘quvchi jinsi <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setGender('boy')}
                      className={`py-2.5 px-3 rounded-2xl border-2 flex items-center justify-center gap-2 transition font-black text-xs sm:text-sm cursor-pointer ${
                        gender === 'boy'
                          ? 'border-blue-500 bg-blue-500 text-white shadow-md shadow-blue-500/20 scale-[1.01]'
                          : 'border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-blue-300'
                      }`}
                    >
                      <span className="text-lg">👦</span>
                      <span>O‘g‘il bola (Sher)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender('girl')}
                      className={`py-2.5 px-3 rounded-2xl border-2 flex items-center justify-center gap-2 transition font-black text-xs sm:text-sm cursor-pointer ${
                        gender === 'girl'
                          ? 'border-pink-500 bg-pink-500 text-white shadow-md shadow-pink-500/20 scale-[1.01]'
                          : 'border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-pink-300'
                      }`}
                    >
                      <span className="text-lg">👧</span>
                      <span>Qiz bola (Shercha)</span>
                    </button>
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
                          className={`py-2.5 px-2 rounded-2xl border-2 text-center transition flex flex-col items-center gap-0.5 cursor-pointer ${
                            isSelected
                              ? 'border-orange-500 bg-orange-500 text-white shadow-md shadow-orange-500/20'
                              : 'border-zinc-200 dark:border-zinc-700 hover:border-amber-400 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                          }`}
                        >
                          <span className="text-base font-black">{g}-sinf</span>
                          <span className={`text-[10px] font-bold ${isSelected ? 'text-amber-100' : 'text-zinc-400'}`}>
                            {g === 1 ? '🐾 1-sinf' : g === 2 ? '⚡ 2-sinf' : g === 3 ? '🎯 3-sinf' : '👑 4-sinf'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Region & District */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                {/* School */}
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

            {/* REGISTER STEP 2: Parent & Contact Details */}
            {authMode === 'register' && step === 2 && (
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
                    Test natijalari, o‘quvchining yutuqlari va haftalik hisobotlar Telegram bot orqali ota-onaga yuboriladi.
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
                    Telefon Raqam (Kirish va Telegram Bot uchun) <span className="text-red-500">*</span>
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
                    O‘zbekiston aloqa operatorlari raqami (+998). Natijalar xavfsiz saqlanadi.
                  </p>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Success Celebration */}
            {step === 3 && (
              <motion.div
                key="step3"
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

                <div className="bg-amber-50 dark:bg-zinc-800 border-2 border-amber-300 dark:border-zinc-700 p-4 rounded-2xl max-w-sm mx-auto shadow-sm">
                  <div className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider mb-1">
                    🌟 Boshlang‘ich Balans
                  </div>
                  <div className="flex items-center justify-center gap-6">
                    <div className="flex items-center gap-1.5 font-black text-base text-amber-900 dark:text-amber-200">
                      <span>🪙</span>
                      <span>0 Tanga</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-black text-base text-orange-900 dark:text-orange-200">
                      <span>🔥</span>
                      <span>0 Olovcha</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-black text-base text-amber-900 dark:text-amber-200">
                      <span>⭐</span>
                      <span>0 XP</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleFinish}
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-base rounded-2xl shadow-lg shadow-orange-500/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  🚀 Sarguzashtni Boshlash!
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Modal Footer Controls (Register Flow) */}
        {authMode === 'register' && step !== 3 && (
          <div className="bg-zinc-50 dark:bg-zinc-800/80 px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => (s - 1) as 1 | 2)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Orqaga</span>
              </button>
            ) : isRegistered ? (
              <button
                type="button"
                onClick={() => setIsRegistrationModalOpen(false)}
                className="text-xs font-extrabold text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition cursor-pointer"
              >
                Bekor qilish
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="text-xs font-extrabold text-orange-500 hover:text-orange-600 transition cursor-pointer"
              >
                Mening hisobim bor (Kirish)
              </button>
            )}

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md shadow-orange-500/20 hover:scale-105 active:scale-95 transition cursor-pointer disabled:opacity-60"
            >
              <span>{isSubmitting ? 'Saqlanmoqda...' : step === 2 ? "Ro‘yxatdan o‘tish" : "Keyingisi"}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
