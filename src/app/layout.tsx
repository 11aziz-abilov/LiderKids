import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { GameProvider } from '@/context/GameContext';
import Header from '@/components/Header';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'LiderKids | Prezident Maktabiga Tayyorlov Platformasi',
  description:
    '1-4 sinf o‘quvchilari uchun gamifikatsiyalashgan ta‘lim platformasi: Matematika, Muammoli masalalar va Tanqidiy fikrlash sirlari.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="uz"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-amber-50/30 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-amber-400 selection:text-amber-950 font-sans">
        <GameProvider>
          <Header />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
            {children}
          </main>
          <footer className="mt-auto border-t-2 border-amber-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/60 py-6 text-center text-xs sm:text-sm font-semibold text-zinc-500 dark:text-zinc-400">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span>🦁</span>
                <span className="font-extrabold text-amber-600 dark:text-amber-400">
                  LiderKids Ta‘lim Platformasi
                </span>
                <span>— Bo‘lajak Prezident maktabi liderlari uchun!</span>
              </div>
              <div className="flex items-center gap-4 text-xs font-bold">
                <span>🪙 Tangalar yig‘ing</span>
                <span>•</span>
                <span>🔥 Olovchalarni oshiring</span>
                <span>•</span>
                <span>👑 Qirol Sherga aylaning!</span>
              </div>
            </div>
          </footer>
        </GameProvider>
      </body>
    </html>
  );
}
