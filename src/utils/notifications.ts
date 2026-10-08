// Unified Notification & Background Reminder Manager
// Supports Web Notifications API, Service Worker, and Capacitor Local Notifications

import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

export interface ReminderNotificationData {
  title: string;
  body: string;
  streaks: number;
  url?: string;
}

class NotificationManager {
  private serviceWorkerRegistration: ServiceWorkerRegistration | null = null;
  private isInitialized = false;

  // Initialize service worker
  async init() {
    if (typeof window === 'undefined' || this.isInitialized) return;
    this.isInitialized = true;

    // Register Service Worker in browser
    if ('serviceWorker' in navigator && !Capacitor.isNativePlatform()) {
      try {
        this.serviceWorkerRegistration = await navigator.serviceWorker.register('/sw.js');
      } catch (err) {
        console.warn('Service worker registration failed:', err);
      }
    }
  }

  // Check if notifications are supported
  isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return Capacitor.isNativePlatform() || 'Notification' in window;
  }

  // Request user permission
  async requestPermission(): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    // 1. Native Mobile App (Capacitor)
    if (Capacitor.isNativePlatform()) {
      try {
        const res = await LocalNotifications.requestPermissions();
        return res.display === 'granted';
      } catch (err) {
        console.warn('Capacitor notification permission error:', err);
        return false;
      }
    }

    // 2. Web Browser
    if ('Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        return perm === 'granted';
      } catch (err) {
        console.warn('Web notification permission error:', err);
        return false;
      }
    }

    return false;
  }

  // Check if currently granted
  async hasPermission(): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    if (Capacitor.isNativePlatform()) {
      try {
        const res = await LocalNotifications.checkPermissions();
        return res.display === 'granted';
      } catch {
        return false;
      }
    }

    if ('Notification' in window) {
      return Notification.permission === 'granted';
    }

    return false;
  }

  // Trigger immediate notification
  async showNotification(data: ReminderNotificationData) {
    const hasPerm = await this.hasPermission();
    if (!hasPerm) return;

    // 1. Native Mobile
    if (Capacitor.isNativePlatform()) {
      try {
        await LocalNotifications.schedule({
          notifications: [
            {
              id: Date.now() % 100000,
              title: data.title,
              body: data.body,
              schedule: { at: new Date(Date.now() + 500) },
              sound: 'beep.wav',
              extra: { url: data.url || '/lessons' },
            },
          ],
        });
        return;
      } catch (e) {
        console.warn('Native notification failed:', e);
      }
    }

    // 2. Web Service Worker or Notification API
    try {
      if (this.serviceWorkerRegistration) {
        await this.serviceWorkerRegistration.showNotification(data.title, {
          body: data.body,
          icon: '/icon.svg',
          badge: '/icon.svg',
          vibrate: [200, 100, 200],
          data: { url: data.url || '/lessons' },
        } as any);
      } else if ('Notification' in window && Notification.permission === 'granted') {
        const notif = new Notification(data.title, {
          body: data.body,
          icon: '/icon.svg',
        });
        notif.onclick = () => {
          window.focus();
          window.location.href = data.url || '/lessons';
        };
      }
    } catch (e) {
      console.warn('Web notification failed:', e);
    }
  }

  // Schedule notification when user leaves the app or closes the page
  async scheduleExitReminder(streaks: number, isGirl: boolean = false) {
    const hasPerm = await this.hasPermission();
    if (!hasPerm) return;

    const title = `🔥 ${streaks} — Darsni boshla!`;
    const body = isGirl
      ? 'Shercha qizcha kutmoqda! Olovchang o‘chib qolmasligi uchun bugun 1 ta dars yeching! 💪🌸'
      : 'Sherchang kutmoqda! Olovchang o‘chib qolmasligi uchun bugungi darsni yeching! 💪🔥';

    // In Native Capacitor
    if (Capacitor.isNativePlatform()) {
      try {
        // Schedule in 10 seconds (immediate reminder after minimizing)
        // and also tomorrow morning
        await LocalNotifications.schedule({
          notifications: [
            {
              id: 101,
              title,
              body,
              schedule: { at: new Date(Date.now() + 10 * 1000) },
              extra: { url: '/lessons' },
            },
            {
              id: 102,
              title: `🔥 ${streaks} — Kunlik eslatma!`,
              body: 'Prezident maktabiga tayyorgarlik vaqti bo‘ldi! 10 daqiqa test yeching! 🎯',
              schedule: { at: new Date(Date.now() + 3 * 3600 * 1000) },
              extra: { url: '/quiz' },
            },
          ],
        });
      } catch (e) {
        console.warn('Failed to schedule native exit reminder:', e);
      }
    } else {
      // In Web, show notification when user switches away to another app/tab
      setTimeout(() => {
        if (document.visibilityState === 'hidden') {
          this.showNotification({
            title,
            body,
            streaks,
            url: '/lessons',
          });
        }
      }, 5000);
    }
  }
}

export const notifications = new NotificationManager();
