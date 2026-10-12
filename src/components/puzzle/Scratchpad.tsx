'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Edit2, Eraser, RotateCcw, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScratchpadProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Scratchpad({ isOpen, onClose }: ScratchpadProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [mode, setMode] = useState<'draw' | 'erase'>('draw');
  const [color, setColor] = useState('#f97316'); // orange default

  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions to display size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, [isOpen]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    if (mode === 'erase') {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 18;
    } else {
      ctx.strokeStyle = color;
      ctx.lineWidth = 3.5;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs"
        >
          <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-2xl border-4 border-amber-300 dark:border-zinc-700 shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b-2 border-amber-100 dark:border-zinc-800 bg-amber-50/60 dark:bg-zinc-850">
              <div className="flex items-center gap-2">
                <span className="text-xl">📝</span>
                <div>
                  <h3 className="text-lg font-black text-amber-950 dark:text-amber-200 leading-tight">
                    Qoralama Taxtasi (Chizma & Hisob)
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Boshqotirmani yechish uchun bemalol chizing va hisoblang!
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
              >
                <X className="w-5 h-5 text-zinc-600 dark:text-zinc-300" />
              </button>
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800/80 border-b border-zinc-200 dark:border-zinc-700 flex-wrap gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setMode('draw')}
                  className={`px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition ${
                    mode === 'draw'
                      ? 'bg-orange-500 text-white shadow-xs'
                      : 'bg-white dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-600'
                  }`}
                >
                  <Edit2 className="w-3.5 h-3.5" /> Qalam
                </button>
                <button
                  onClick={() => setMode('erase')}
                  className={`px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition ${
                    mode === 'erase'
                      ? 'bg-zinc-700 text-white shadow-xs'
                      : 'bg-white dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-600'
                  }`}
                >
                  <Eraser className="w-3.5 h-3.5" /> O‘chirg‘ich
                </button>

                {/* Colors */}
                {mode === 'draw' && (
                  <div className="flex items-center gap-1 ml-2">
                    {[
                      { hex: '#f97316', label: 'To‘q sariq' },
                      { hex: '#2563eb', label: 'Ko‘k' },
                      { hex: '#16a34a', label: 'Yashil' },
                      { hex: '#9333ea', label: 'Binafsha' },
                    ].map((c) => (
                      <button
                        key={c.hex}
                        onClick={() => setColor(c.hex)}
                        style={{ backgroundColor: c.hex }}
                        className={`w-6 h-6 rounded-full transition-transform ${
                          color === c.hex ? 'scale-125 ring-2 ring-zinc-400' : 'opacity-70 hover:opacity-100'
                        }`}
                        title={c.label}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={clearCanvas}
                  className="px-3 py-1.5 rounded-xl font-extrabold text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-1 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Tozalash
                </button>
              </div>
            </div>

            {/* Canvas Area */}
            <div className="flex-1 bg-white relative p-2 min-h-[350px] sm:min-h-[420px]">
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-full border border-dashed border-amber-200 rounded-2xl touch-none cursor-crosshair bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"
              />
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-850 flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-500">
                Hisoblab bo‘lgach, jumboqqa qaytishingiz mumkin
              </span>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs sm:text-sm font-black rounded-xl shadow-md hover:scale-105 transition"
              >
                Yopish va Javob berish
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
