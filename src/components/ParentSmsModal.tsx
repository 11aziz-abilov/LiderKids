'use client';

import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Smartphone,
  Send,
  X,
  CheckCircle2,
  AlertTriangle,
  Clock,
  History,
  Settings,
  Flame,
  Award,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Check,
  User,
  Phone,
  RefreshCw,
  BellRing
} from 'lucide-react';
import { smsService, SmsProviderConfig } from '@/utils/smsService';

export default function ParentSmsModal() {
  const {
    isSmsModalOpen,
    setIsSmsModalOpen,
    progress,
    updateProfile,
    sendInactivitySmsAlert,
    sendQuizReportSms,
    smsHistory,
    refreshSmsHistory,
    lionStage
  } = useGame();

  const [activeTab, setActiveTab] = useState<'history' | 'settings'>('history');
  const [parentPhone, setParentPhone] = useState(
    progress.profile?.parentPhoneNumber || progress.profile?.phoneNumber || '+998 (90) 123-45-67'
  );
  const [parentName, setParentName] = useState(progress.profile?.parentName || 'Ota-ona');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Provider config state
  const [providerConfig, setProviderConfig] = useState<SmsProviderConfig>(() => smsService.getConfig());
  const [eskizToken, setEskizToken] = useState(providerConfig.eskizToken || '');
  const [eskizEmail, setEskizEmail] = useState(providerConfig.eskizEmail || '');
  const [eskizPassword, setEskizPassword] = useState('');
  const [isLoggingInEskiz, setIsLoggingInEskiz] = useState(false);
  const [senderName, setSenderName] = useState(providerConfig.senderName || 'LiderKids');

  if (!isSmsModalOpen) return null;

  const smsEnabled = progress.profile?.smsNotificationsEnabled !== false;

  const handleToggleSms = () => {
    updateProfile({
      smsNotificationsEnabled: !smsEnabled,
    });
    setActionFeedback(!smsEnabled ? 'SMS xabarnomalar yoqildi' : 'SMS xabarnomalar o‘chirildi');
    setTimeout(() => setActionFeedback(null), 3000);
  };

  const handleSavePhone = () => {
    updateProfile({
      parentPhoneNumber: parentPhone,
      parentName: parentName,
    });
    setActionFeedback('Ota-ona ma‘lumotlari saqlandi! ✅');
    setTimeout(() => setActionFeedback(null), 3000);
  };

  const handleSaveProviderConfig = () => {
    smsService.saveConfig({
      provider: eskizToken.trim() ? 'eskiz' : 'simulation',
      eskizEmail: eskizEmail.trim(),
      eskizToken: eskizToken.trim(),
      senderName: senderName.trim() || 'LiderKids',
    });
    setProviderConfig(smsService.getConfig());
    setActionFeedback('SMS provayder sozlamalari saqlandi! ✅');
    setTimeout(() => setActionFeedback(null), 3000);
  };

  const handleEskizLogin = async () => {
    if (!eskizEmail || !eskizPassword) {
      setActionFeedback('Eskiz email va parolini kiriting!');
      setTimeout(() => setActionFeedback(null), 3000);
      return;
    }
    setIsLoggingInEskiz(true);
    const res = await smsService.loginToEskiz(eskizEmail.trim(), eskizPassword.trim());
    setIsLoggingInEskiz(false);
    if (res.success && res.token) {
      setEskizToken(res.token);
      setProviderConfig(smsService.getConfig());
      setActionFeedback('Eskiz.uz ulandi! Real SMS xizmati faol ✅');
    } else {
      setActionFeedback(`Eskiz xatosi: ${res.error || 'Ulanib bo‘lmadi'}`);
    }
    setTimeout(() => setActionFeedback(null), 4000);
  };

  const handleTestInactivitySms = async () => {
    setIsSendingTest(true);
    try {
      await sendInactivitySmsAlert(true);
      setActionFeedback('1 kun kirmaganlik haqida SMS jo‘natildi! 📱');
      refreshSmsHistory();
    } catch {
      setActionFeedback('Xatolik yuz berdi!');
    } finally {
      setIsSendingTest(false);
      setTimeout(() => setActionFeedback(null), 4000);
    }
  };

  // Test Quiz report SMS right now
  const handleTestQuizReportSms = async () => {
    setIsSendingTest(true);
    try {
      await sendQuizReportSms({
        score: 5,
        totalQuestions: 5,
        earnedCoins: 250,
        subjectTitle: 'Matematika va Mantiq',
      });
      setActionFeedback('Test natijasi va darajalar bo‘yicha SMS jo‘natildi! 🎯');
      refreshSmsHistory();
    } catch {
      setActionFeedback('Xatolik yuz berdi!');
    } finally {
      setIsSendingTest(false);
      setTimeout(() => setActionFeedback(null), 4000);
    }
  };

  const handleClearHistory = () => {
    if (confirm('Barcha SMSlar tarixini tozalashni xohlaysizmi?')) {
      smsService.clearHistory();
      refreshSmsHistory();
      setActionFeedback('SMSlar tarixi tozalandi');
      setTimeout(() => setActionFeedback(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md overflow-y-auto animate-in fade-in duration-300">
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0 }}
        className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border-2 border-blue-300/80 dark:border-zinc-700 w-full max-w-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 px-6 py-5 text-white relative">
          <button
            onClick={() => setIsSmsModalOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
            title="Yopish"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-white/30">
              📱
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                  Ota-onalar SMS Markazi
                </h3>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-blue-100 border border-white/30">
                  LiderKids Alert
                </span>
              </div>
              <p className="text-xs sm:text-sm text-blue-100 font-medium">
                1 kun kirmaganda ogohlantirish & test natijalari va o‘sish darajalari hisoboti
              </p>
            </div>
          </div>

          {/* Feedback banner */}
          <AnimatePresence>
            {actionFeedback && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-3 py-1.5 px-3 rounded-xl bg-white/25 border border-white/40 text-xs font-black text-white flex items-center gap-2 shadow-sm"
              >
                <span>🔔</span>
                <span>{actionFeedback}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-850 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-2xl font-black text-xs sm:text-sm transition-all border-b-2 ${
              activeTab === 'history'
                ? 'bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 border-blue-600 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 border-transparent'
            }`}
          >
            <History className="w-4 h-4" />
            <span>SMS Tarixi ({smsHistory.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-2xl font-black text-xs sm:text-sm transition-all border-b-2 ${
              activeTab === 'settings'
                ? 'bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 border-blue-600 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 border-transparent'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Sozlamalar & Provayder</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'history' ? (
            <div className="space-y-5">
              {/* Status Overview Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Inactivity Status Card */}
                <div className="bg-amber-50 dark:bg-zinc-800/90 rounded-2xl p-4 border-2 border-amber-200 dark:border-amber-900/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-amber-600" />
                      1 Kun Kirmasa SMS
                    </span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-200/80 dark:bg-amber-950 text-amber-900 dark:text-amber-300">
                      Avtomatlashtirilgan
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300">
                    O‘quvchi 24 soat kirmasa, ota-onasiga uzluksiz olovcha (streak) susaymasligi uchun SMS ketadi.
                  </p>
                  <button
                    disabled={isSendingTest}
                    onClick={handleTestInactivitySms}
                    className="w-full mt-1 py-1.5 px-3 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-1.5"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Sinov SMS yuborish (1 kun kirmadi)</span>
                  </button>
                </div>

                {/* Quiz Result Status Card */}
                <div className="bg-blue-50 dark:bg-zinc-800/90 rounded-2xl p-4 border-2 border-blue-200 dark:border-blue-900/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-blue-600" />
                      Test & Darajalar SMS
                    </span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-200/80 dark:bg-blue-950 text-blue-900 dark:text-blue-300">
                      Faol
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300">
                    Test yakunida to‘g‘ri javoblar, tangalar va o‘sish darajasi ota-ona raqamiga yuboriladi.
                  </p>
                  <button
                    disabled={isSendingTest}
                    onClick={handleTestQuizReportSms}
                    className="w-full mt-1 py-1.5 px-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Sinov SMS yuborish (Test hisoboti)</span>
                  </button>
                </div>
              </div>

              {/* SMS List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
                    <span>Yuborilgan SMS Xabarlar Ro‘yxati</span>
                    <span className="text-xs text-zinc-500 font-normal">
                      ({smsHistory.length} ta)
                    </span>
                  </h4>
                  {smsHistory.length > 0 && (
                    <button
                      onClick={handleClearHistory}
                      className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 font-bold"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Tozalash</span>
                    </button>
                  )}
                </div>

                {smsHistory.length === 0 ? (
                  <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-8 text-center space-y-2 border-2 border-dashed border-zinc-200 dark:border-zinc-700">
                    <span className="text-3xl">📭</span>
                    <p className="text-sm font-bold text-zinc-600 dark:text-zinc-400">
                      Hozircha SMS yuborilmagan
                    </p>
                    <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                      Test ishlaganda yoki 1 kun kirmaganda SMS xabarlar shu yerda aks etadi. Yuqoridagi tugmalar orqali sinab ko‘rishingiz mumkin!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {smsHistory.map((sms) => {
                      const isInactive = sms.type === 'inactivity_1day';
                      const formattedDate = new Date(sms.sentAt).toLocaleString('uz-UZ', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      });

                      return (
                        <div
                          key={sms.id}
                          className="bg-white dark:bg-zinc-850 rounded-2xl p-4 border-2 border-zinc-200 dark:border-zinc-700/80 hover:border-blue-300 dark:hover:border-blue-800 transition-colors shadow-sm space-y-2"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-xs font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                                  isInactive
                                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                    : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                                }`}
                              >
                                {isInactive ? '⏰ 1 Kun Kirmadi' : '🎯 Test & Darajalar'}
                              </span>
                              <span className="text-xs font-extrabold text-zinc-700 dark:text-zinc-300">
                                📞 {sms.recipientPhone}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-zinc-400">
                              <span>{formattedDate}</span>
                              <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                                ✓ Yetkazildi
                              </span>
                            </div>
                          </div>

                          <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-200 leading-relaxed bg-zinc-50 dark:bg-zinc-900 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
                            {sms.message}
                          </p>

                          <div className="flex items-center justify-between pt-1">
                            <span className="text-[11px] text-zinc-400">
                              O‘quvchi: <strong className="text-zinc-600 dark:text-zinc-300">{sms.studentName}</strong> | Qabul qiluvchi: <strong className="text-zinc-600 dark:text-zinc-300">{sms.recipientName}</strong>
                            </span>
                            <button
                              onClick={() => smsService.openDeviceSms(sms.recipientPhone, sms.message)}
                              className="text-xs font-extrabold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                            >
                              <Smartphone className="w-3.5 h-3.5" />
                              <span>Qurilma SMSida ochish</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Settings & Configuration Tab */
            <div className="space-y-6">
              {/* Ota-ona kontakt ma'lumotlari */}
              <div className="bg-zinc-50 dark:bg-zinc-850 p-4 sm:p-5 rounded-2xl border-2 border-zinc-200 dark:border-zinc-700 space-y-4">
                <h4 className="text-sm font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  <span>Ota-ona kontakt ma‘lumotlari</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                      Ota-ona ismi / F.I.Sh
                    </label>
                    <input
                      type="text"
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      placeholder="Masalan: Nodira Karimova"
                      className="w-full px-3.5 py-2.5 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm font-semibold focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                      Ota-ona telefon raqami (SMS qabul qiluvchi)
                    </label>
                    <input
                      type="tel"
                      value={parentPhone}
                      onChange={(e) => setParentPhone(e.target.value)}
                      placeholder="+998 (90) 123-45-67"
                      className="w-full px-3.5 py-2.5 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm font-semibold focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="enableSmsCheck"
                      checked={smsEnabled}
                      onChange={handleToggleSms}
                      className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                    />
                    <label htmlFor="enableSmsCheck" className="text-xs font-bold text-zinc-700 dark:text-zinc-300 cursor-pointer">
                      SMS xabarnomalar xizmatini yoqish
                    </label>
                  </div>
                  <button
                    onClick={handleSavePhone}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition"
                  >
                    Saqlash
                  </button>
                </div>
              </div>

              {/* Eskiz.uz API integratsiyasi */}
              <div className="bg-zinc-50 dark:bg-zinc-850 p-4 sm:p-5 rounded-2xl border-2 border-zinc-200 dark:border-zinc-700 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Eskiz.uz SMS Provayder Integratsiyasi</span>
                  </h4>
                  {eskizToken ? (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300">
                      🟢 Real SMS Faol
                    </span>
                  ) : (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300">
                      🟡 Simulyatsiya Rejimi
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Eskiz.uz orqali to‘g‘ridan-to‘g‘ri O‘zbekiston uyali aloqa operatorlariga (Ucell, Beeline, Mobiuz, Uztelecom) rasmiy SMS jo‘natiladi. Agar Eskiz ulanmagan bo‘lsa, tizim <strong>«Qurilma SMSida ochish»</strong> va <strong>«Simulyatsiya jurnali»</strong> rejimida ishlaydi.
                </p>

                {/* Tezkor login bloki */}
                <div className="bg-white dark:bg-zinc-900 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 space-y-2.5">
                  <span className="text-xs font-black text-zinc-800 dark:text-zinc-200">
                    1. Eskiz.uz Login & Parol orqali ulash:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="email"
                      value={eskizEmail}
                      onChange={(e) => setEskizEmail(e.target.value)}
                      placeholder="Eskiz email / login"
                      className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs font-semibold outline-none focus:border-blue-500"
                    />
                    <input
                      type="password"
                      value={eskizPassword}
                      onChange={(e) => setEskizPassword(e.target.value)}
                      placeholder="Eskiz paroli"
                      className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs font-semibold outline-none focus:border-blue-500"
                    />
                  </div>
                  <button
                    type="button"
                    disabled={isLoggingInEskiz}
                    onClick={handleEskizLogin}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs rounded-lg shadow-sm transition flex items-center justify-center gap-1.5"
                  >
                    <span>{isLoggingInEskiz ? 'Ulanmoqda...' : '⚡ Eskiz hisobiga kirish va Real SMSni yoqish'}</span>
                  </button>
                </div>

                <div className="space-y-3 pt-2 border-t border-zinc-200 dark:border-zinc-700">
                  <span className="text-xs font-black text-zinc-800 dark:text-zinc-200">
                    2. Yoki mavjud Bearer Tokenni qo‘lda kiritish:
                  </span>
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-500 mb-1">
                      Eskiz Bearer Token (API Kalit)
                    </label>
                    <input
                      type="password"
                      value={eskizToken}
                      onChange={(e) => setEskizToken(e.target.value)}
                      placeholder="eyJ0eXAiOiJKV1QiLC..."
                      className="w-full px-3.5 py-2 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-mono font-semibold focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-500 mb-1">
                      Sender ID / Yuboruvchi nomi (Default: 4546)
                    </label>
                    <input
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="4546 yoki LiderKids"
                      className="w-full px-3.5 py-2 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-semibold focus:border-blue-500 outline-none"
                    />
                  </div>

                  <button
                    onClick={handleSaveProviderConfig}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md transition"
                  >
                    Sozlamalarni Saqlash
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-zinc-50 dark:bg-zinc-850 px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
          <div className="flex items-center gap-1.5 font-bold">
            <span>🛡️ Ota-onalar xavfsizligi:</span>
            <span className="text-zinc-700 dark:text-zinc-300">Barcha SMSlar shifrlangan</span>
          </div>
          <button
            onClick={() => setIsSmsModalOpen(false)}
            className="px-5 py-2 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-650 text-zinc-800 dark:text-zinc-200 font-extrabold rounded-xl transition"
          >
            Yopish
          </button>
        </div>
      </motion.div>
    </div>
  );
}
