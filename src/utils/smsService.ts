// SMS Service for LiderKids Educational Platform
// Handles automated SMS notifications to parents for:
// 1. 1-day inactivity alert (Student hasn't opened app for 24+ hours)
// 2. Quiz results and level/progress updates (Scores, coins, lion stage, grade)
// Supports Eskiz.uz API integration, Native Device SMS, and simulated SMS logs.

import { GradeLevel, SmsMessage, SmsType } from '@/types';

const SMS_STORAGE_KEY = 'liderkids_sms_history_v1';
const SMS_SETTINGS_KEY = 'liderkids_sms_settings_v1';

export interface SmsProviderConfig {
  provider: 'eskiz' | 'simulation';
  eskizEmail?: string;
  eskizToken?: string;
  senderName?: string;
  autoSendInactivitySms: boolean;
  autoSendQuizSms: boolean;
}

const DEFAULT_CONFIG: SmsProviderConfig = {
  provider: 'simulation',
  senderName: 'LiderKids',
  autoSendInactivitySms: true,
  autoSendQuizSms: true,
};

export class SmsService {
  // Get provider settings
  getConfig(): SmsProviderConfig {
    if (typeof window === 'undefined') return DEFAULT_CONFIG;
    try {
      const saved = localStorage.getItem(SMS_SETTINGS_KEY);
      return saved ? { ...DEFAULT_CONFIG, ...JSON.parse(saved) } : DEFAULT_CONFIG;
    } catch {
      return DEFAULT_CONFIG;
    }
  }

  // Save provider settings
  saveConfig(config: Partial<SmsProviderConfig>) {
    if (typeof window === 'undefined') return;
    try {
      const current = this.getConfig();
      const updated = { ...current, ...config };
      localStorage.setItem(SMS_SETTINGS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save SMS config:', e);
    }
  }

  // Get SMS history
  getHistory(): SmsMessage[] {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(SMS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  // Save SMS message to history
  private saveToHistory(message: SmsMessage) {
    if (typeof window === 'undefined') return;
    try {
      const current = this.getHistory();
      const updated = [message, ...current.slice(0, 99)]; // Keep latest 100
      localStorage.setItem(SMS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save SMS history:', e);
    }
  }

  // Clear SMS history
  clearHistory() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(SMS_STORAGE_KEY);
    } catch {}
  }

  // Normalize phone number to digits only (e.g. 998901234567)
  normalizePhone(phone: string): string {
    const digits = phone.replace(/\D/g, '');
    if (digits.startsWith('998')) return digits;
    if (digits.length === 9) return `998${digits}`;
    return digits;
  }

  // Open native mobile SMS application with prefilled message
  openDeviceSms(phone: string, text: string) {
    if (typeof window === 'undefined') return;
    const cleanPhone = this.normalizePhone(phone);
    const encodedText = encodeURIComponent(text);
    // Standard mobile sms URI scheme
    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const smsUrl = isIos
      ? `sms:${cleanPhone}&body=${encodedText}`
      : `sms:${cleanPhone}?body=${encodedText}`;
    window.open(smsUrl, '_blank');
  }

  // Log in to Eskiz.uz and acquire Bearer token automatically
  async loginToEskiz(email: string, password: string): Promise<{ success: boolean; token?: string; error?: string }> {
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);

      const res = await fetch('https://notify.eskiz.uz/api/auth/login', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data?.data?.token) {
        this.saveConfig({
          provider: 'eskiz',
          eskizEmail: email,
          eskizToken: data.data.token,
        });
        return { success: true, token: data.data.token };
      } else {
        return { success: false, error: data?.message || 'Login yoki parol noto‘g‘ri' };
      }
    } catch (e: any) {
      return { success: false, error: e?.message || 'Tarmoq xatosi' };
    }
  }

  // Core Send SMS function
  async sendSms({
    type,
    recipientPhone,
    recipientName,
    studentName,
    message,
    metadata,
  }: {
    type: SmsType;
    recipientPhone: string;
    recipientName: string;
    studentName: string;
    message: string;
    metadata?: SmsMessage['metadata'];
  }): Promise<SmsMessage> {
    const config = this.getConfig();
    const cleanPhone = this.normalizePhone(recipientPhone);
    let status: SmsMessage['status'] = 'simulated';

    // If Eskiz token is provided, try sending via Eskiz.uz API
    if (config.provider === 'eskiz' && config.eskizToken) {
      try {
        const formData = new FormData();
        formData.append('mobile_phone', cleanPhone);
        formData.append('message', message);
        formData.append('from', config.senderName || '4546');

        const response = await fetch('https://notify.eskiz.uz/api/message/sms/send', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${config.eskizToken}`,
          },
          body: formData,
        });

        if (response.ok) {
          status = 'sent';
        } else {
          const errData = await response.json().catch(() => ({}));
          console.warn('Eskiz SMS API returned non-OK status:', errData);
          status = 'failed';
        }
      } catch (err) {
        console.warn('Eskiz SMS error:', err);
        status = 'failed';
      }
    } else {
      // Simulation mode
      status = 'simulated';
    }

    const smsRecord: SmsMessage = {
      id: `sms_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      type,
      recipientPhone: recipientPhone || '+998 (90) 123-45-67',
      recipientName: recipientName || 'Ota-ona',
      studentName: studentName || 'O‘quvchi',
      message,
      sentAt: new Date().toISOString(),
      status,
      metadata,
    };

    this.saveToHistory(smsRecord);
    return smsRecord;
  }

  // 1. Send Inactivity SMS (Student hasn't used app for 1 day)
  async sendInactivityAlert({
    parentPhone,
    parentName,
    studentName,
    streaks,
    daysInactive = 1,
  }: {
    parentPhone: string;
    parentName: string;
    studentName: string;
    streaks: number;
    daysInactive?: number;
  }): Promise<SmsMessage> {
    const message = `Hurmatli ${parentName || 'Ota-ona'}! Farzandingiz ${studentName} ${daysInactive} kundan beri LiderKids ilovasiga kirmadi va darslarni qoldirdi. ${streaks} kunlik olovcha (streak) va Prezident maktabiga tayyorgarlik sur'ati susaymasligi uchun ilovaga kirib dars va testlarni bajarishini nazorat qiling! 🦁🔥`;

    return this.sendSms({
      type: 'inactivity_1day',
      recipientPhone: parentPhone,
      recipientName: parentName,
      studentName,
      message,
      metadata: {
        daysInactive,
        streaks,
      },
    });
  }

  // 2. Send Quiz Progress & Level SMS
  async sendQuizProgressReport({
    parentPhone,
    parentName,
    studentName,
    score,
    totalQuestions,
    earnedCoins,
    grade,
    lionStageTitle,
    streaks,
    subjectTitle,
  }: {
    parentPhone: string;
    parentName: string;
    studentName: string;
    score: number;
    totalQuestions: number;
    earnedCoins: number;
    grade: GradeLevel;
    lionStageTitle: string;
    streaks: number;
    subjectTitle?: string;
  }): Promise<SmsMessage> {
    const accuracy = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 100;
    const fanText = subjectTitle ? `${subjectTitle} fanidan ` : '';

    const message = `LiderKids: Farzandingiz ${studentName} ${fanText}testni yakunladi! 🎯 Natija: ${score}/${totalQuestions} (${accuracy}%), Qo‘lga kiritilgan tanga: +${earnedCoins} 🪙, Joriy darajasi: ${lionStageTitle} (${grade}-sinf), Olovcha: ${streaks} kun. Bilimlar o‘sishda davom etmoqda! 🦁👏`;

    return this.sendSms({
      type: 'quiz_progress',
      recipientPhone: parentPhone,
      recipientName: parentName,
      studentName,
      message,
      metadata: {
        score,
        totalQuestions,
        accuracy,
        grade,
        earnedCoins,
        lionStageTitle,
        streaks,
        subjectTitle,
      },
    });
  }
}

export const smsService = new SmsService();
