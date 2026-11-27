'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Crown, CheckCircle2, BookOpen, Flame, User, Swords, Smartphone } from 'lucide-react';
import { useDeviceMode } from '@/context/DeviceModeContext';
import { useGame } from '@/context/GameContext';
import { sound } from '@/utils/sound';

export default function BottomNavigationBar() {
  const pathname = usePathname();
  const { deviceMode, openDeviceSelector } = useDeviceMode();
  const { progress, setIsProfileModalOpen, setIsRegistrationModalOpen } = useGame();

  // Show bottom navigation in mobile mode OR on small viewports (<640px)
  // But if explicitly in desktop mode on large screen, keep desktop layout
  if (deviceMode !== 'mobile') {
    return null;
  }

  const navItems = [
    { href: '/', label: 'Bosh sahifa', icon: Crown },
    { href: '/quiz', label: 'Testlar', icon: CheckCircle2 },
    { href: '/lessons', label: 'Darslar', icon: BookOpen },
    { href: '/tournament', label: 'Shashka', icon: Swords },
    { href: '/leaderboard', label: 'Reyting', icon: Flame },
  ];

  const handleProfileClick = () => {
    if (progress.soundEnabled) sound.playClick();
    if (progress.profile?.isRegistered) {
      setIsProfileModalOpen(true);
    } else {
      setIsRegistrationModalOpen(true);
    }
  };

  return (
    <nav
      aria-label="Mobil navigatsiya"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border-t-2 border-amber-200 dark:border-zinc-800 shadow-[0_-8px_24px_rgba(245,158,11,0.08)] py-1.5 px-2 pb-safe"
    >
      <div className="max-w-md mx-auto flex items-center justify-around gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => {
                if (progress.soundEnabled) sound.playClick();
              }}
              className={`relative flex flex-col items-center justify-center min-w-[56px] min-h-[48px] px-2 py-1 rounded-2xl transition-all cursor-pointer ${
                isActive
                  ? 'text-amber-600 dark:text-amber-400 font-black'
                  : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 font-bold'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabBadge"
                  className="absolute inset-0 bg-amber-100/90 dark:bg-amber-950/60 rounded-2xl -z-10 border border-amber-300 dark:border-amber-800 shadow-sm"
                  transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                />
              )}
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5] scale-110' : 'stroke-[2]'}`} />
                {item.href === '/leaderboard' && progress.streaks > 0 && (
                  <span className="absolute -top-1 -right-2 bg-orange-500 text-white text-[9px] font-black px-1 rounded-full shadow-sm">
                    {progress.streaks}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 leading-none">
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* Profile / Register Tab */}
        <button
          type="button"
          onClick={handleProfileClick}
          className="flex flex-col items-center justify-center min-w-[56px] min-h-[48px] px-2 py-1 rounded-2xl text-zinc-500 hover:text-amber-600 dark:text-zinc-400 dark:hover:text-amber-400 font-bold transition-all cursor-pointer"
        >
          <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-white text-[11px] font-black shadow-sm">
            {progress.profile?.isRegistered ? (
              (progress.profile.firstName?.[0] || '🦁').toUpperCase()
            ) : progress.profile?.isGuest ? (
              '👤'
            ) : (
              <User className="w-3.5 h-3.5 text-white" />
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-0.5 leading-none">
            {progress.profile?.isRegistered ? 'Profil' : progress.profile?.isGuest ? 'Mehmon' : 'Kirish'}
          </span>
        </button>
      </div>
    </nav>
  );
}
