'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('LiderKids ErrorBoundary caught an error:', error, errorInfo);
  }

  public handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-amber-50/50 dark:bg-zinc-950 font-sans">
          <div className="bg-white dark:bg-zinc-900 border-2 border-amber-300 dark:border-zinc-700 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-xl">
            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-950/50 text-amber-500 rounded-2xl mx-auto flex items-center justify-center text-3xl mb-4">
              🦁
            </div>
            <h2 className="text-xl font-black text-zinc-900 dark:text-white mb-2">
              Kutilmagan xatolik yuz berdi
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6 font-medium">
              Shercha bilan bog‘lanishda kichik nosozlik bo‘ldi. Sahifani qayta yuklab ko‘ring!
            </p>
            <button
              onClick={this.handleReload}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-sm rounded-2xl shadow-lg shadow-orange-500/25 transition cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Sahifani qayta yuklash</span>
            </button>
            {this.state.error?.message && (
              <pre className="mt-4 p-3 bg-zinc-100 dark:bg-zinc-800 text-[11px] text-zinc-600 dark:text-zinc-400 rounded-xl overflow-x-auto text-left font-mono">
                {this.state.error.message}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
