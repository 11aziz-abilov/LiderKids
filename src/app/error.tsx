'use client';

import React, { useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('LiderKids page error:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 border-2 border-amber-300 dark:border-zinc-700 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-xl">
        <div className="w-16 h-16 bg-amber-100 dark:bg-amber-950/50 text-amber-500 rounded-2xl mx-auto flex items-center justify-center text-3xl mb-4">
          🦁
        </div>
        <h2 className="text-xl font-black text-zinc-900 dark:text-white mb-2">
          Kutilmagan nosozlik yuz berdi
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6 font-medium">
          Shercha bilan bog‘lanishda kichik xatolik bo‘ldi. Qaytadan urinib ko‘ring!
        </p>
        <button
          onClick={() => reset()}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-sm rounded-2xl shadow-lg shadow-orange-500/25 transition cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Qayta urinish</span>
        </button>
      </div>
    </div>
  );
}
