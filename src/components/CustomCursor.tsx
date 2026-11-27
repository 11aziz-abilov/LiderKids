'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface TrailPoint {
  x: number;
  y: number;
  time: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  createdAt: number;
  maxAge: number;
  isSparkle: boolean;
}

const TRAIL_DURATION = 400; // ms
const SPARKLE_COLORS = ['#F59E0B', '#FBBF24', '#FCD34D', '#F97316', '#FEF08A'];

export default function CustomCursor() {
  const [isPointerFine, setIsPointerFine] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  // Instantaneous mouse coordinates
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const cursorOpacity = useMotionValue(0);

  // Outer ring follows with smooth spring physics
  // Requirement: stiffness: 150, damping: 18, mass: 0.5
  const springConfig = { stiffness: 150, damping: 18, mass: 0.5 };
  const ringX = useSpring(mouseX, springConfig);
  const ringY = useSpring(mouseY, springConfig);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointsRef = useRef<TrailPoint[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const lastMousePos = useRef<{ x: number; y: number }>({ x: -100, y: -100 });
  const animFrameId = useRef<number | null>(null);
  const isRunningRef = useRef(false);

  useEffect(() => {
    // Only activate for devices that have a mouse / trackpad (pointer: fine)
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(pointer: fine)');
    if (!mediaQuery.matches) {
      return;
    }

    setIsPointerFine(true);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high-DPI retina rendering
    const handleResize = () => {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Animation Render Loop
    const render = () => {
      const now = performance.now();
      const width = window.innerWidth;
      const height = window.innerHeight;

      ctx.clearRect(0, 0, width, height);

      // 1. Remove expired trail points (> 400ms)
      pointsRef.current = pointsRef.current.filter((p) => now - p.time <= TRAIL_DURATION);
      const points = pointsRef.current;

      // 2. Draw Tapering Fluid Ribbon Trail
      if (points.length >= 2) {
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        for (let i = 0; i < points.length - 1; i++) {
          const p1 = points[i];
          const p2 = points[i + 1];
          const progress = Math.max(0, Math.min(1, 1 - (now - p1.time) / TRAIL_DURATION));

          // Width tapers smoothly from ~6px down to ~0.5px
          const lineWidth = Math.max(0.6, progress * 6);
          const alpha = Math.max(0, Math.min(0.65, progress * 0.7));

          // Outer glowing amber ribbon
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(245, 158, 11, ${alpha})`;
          ctx.lineWidth = lineWidth;
          ctx.stroke();

          // Inner gold core highlight
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(254, 240, 138, ${alpha * 0.9})`;
          ctx.lineWidth = Math.max(0.4, lineWidth * 0.35);
          ctx.stroke();
        }
        ctx.restore();
      }

      // 3. Update & Draw Sparkling Particles (Gold / Orange stardust)
      particlesRef.current = particlesRef.current.filter((p) => {
        const age = now - p.createdAt;
        return age <= p.maxAge;
      });

      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.95;
        p.vy *= 0.95;

        const age = now - p.createdAt;
        const life = Math.max(0, 1 - age / p.maxAge);

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, life * 0.85));
        ctx.fillStyle = p.color;

        if (p.isSparkle) {
          // 4-pointed diamond sparkle
          const s = p.size * life * 1.2;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y - s);
          ctx.quadraticCurveTo(p.x, p.y, p.x + s, p.y);
          ctx.quadraticCurveTo(p.x, p.y, p.x + s, p.y);
          ctx.quadraticCurveTo(p.x, p.y, p.x, p.y + s);
          ctx.quadraticCurveTo(p.x, p.y, p.x - s, p.y);
          ctx.quadraticCurveTo(p.x, p.y, p.x, p.y - s);
          ctx.fill();
        } else {
          // Glowing circular particle
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(0.2, p.size * life), 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // Keep RAF running as long as there is an active trail or particles
      if (points.length > 0 || particles.length > 0) {
        animFrameId.current = requestAnimationFrame(render);
      } else {
        isRunningRef.current = false;
        animFrameId.current = null;
      }
    };

    const startAnimation = () => {
      if (!isRunningRef.current) {
        isRunningRef.current = true;
        animFrameId.current = requestAnimationFrame(render);
      }
    };

    // Spawn Particles
    const spawnParticles = (x: number, y: number, count = 1, isBurst = false) => {
      const now = performance.now();
      for (let i = 0; i < count; i++) {
        const speed = isBurst ? Math.random() * 2.8 + 0.6 : Math.random() * 0.9 + 0.2;
        const angle = Math.random() * Math.PI * 2;
        const color = SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)];

        particlesRef.current.push({
          x: x + (Math.random() - 0.5) * 4,
          y: y + (Math.random() - 0.5) * 4,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - (isBurst ? 0.35 : 0.1),
          size: isBurst ? Math.random() * 3 + 1.5 : Math.random() * 2.2 + 1,
          color,
          createdAt: now,
          maxAge: (isBurst ? 450 : 350) + Math.random() * 100,
          isSparkle: Math.random() > 0.45,
        });
      }
      startAnimation();
    };

    // Mouse Move Listener
    const onMouseMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;
      mouseX.set(x);
      mouseY.set(y);
      cursorOpacity.set(1);

      const dx = x - lastMousePos.current.x;
      const dy = y - lastMousePos.current.y;
      const dist = Math.hypot(dx, dy);

      // Add point to trail
      const now = performance.now();
      pointsRef.current.push({ x, y, time: now });

      // Spawn stardust particles when cursor moves
      if (dist > 4) {
        spawnParticles(x, y, dist > 25 ? 2 : 1, false);
      }

      lastMousePos.current = { x, y };
      startAnimation();

      // Check if hovering over interactive clickable elements
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = Boolean(
          target.closest(
            'button, a, [role="button"], input, select, textarea, [data-cursor="pointer"], .cursor-pointer, summary'
          )
        );
        setIsHovered((prev) => (prev !== isInteractive ? isInteractive : prev));
      }
    };

    // Mouse Down / Up Listeners (Click feedback)
    const onMouseDown = (e: MouseEvent) => {
      setIsClicked(true);
      spawnParticles(e.clientX, e.clientY, 5, true);
    };

    const onMouseUp = () => {
      setIsClicked(false);
    };

    // Window Leave / Enter
    const onMouseLeave = () => {
      cursorOpacity.set(0);
    };

    const onMouseEnter = () => {
      cursorOpacity.set(1);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);

      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [mouseX, mouseY, cursorOpacity]);

  return (
    <div
      id="custom-cursor-root"
      style={{ display: isPointerFine ? 'block' : 'none' }}
      className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden"
    >
      {/* 1. Motion Trail Canvas (Smooth fluid ribbon and stardust embers) */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-[99999] w-full h-full block"
        style={{ willChange: 'transform' }}
      />

      {/* 2. Outer Ring (32px circular ring with spring physics, hover scaling, warm radial glow) */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[99999] rounded-full border border-amber-500/40"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          width: 32,
          height: 32,
          opacity: cursorOpacity,
          boxShadow: isHovered
            ? '0 0 22px rgba(245, 158, 11, 0.5)'
            : '0 0 12px rgba(245, 158, 11, 0.2)',
        }}
        animate={{
          scale: isClicked ? 0.85 : isHovered ? 1.6 : 1,
          backgroundColor: isHovered ? 'rgba(251, 191, 36, 0.15)' : 'rgba(245, 158, 11, 0)',
          borderColor: isHovered ? 'rgba(245, 158, 11, 0.85)' : 'rgba(245, 158, 11, 0.4)',
        }}
        transition={{
          scale: { type: 'spring', stiffness: 320, damping: 22 },
          backgroundColor: { duration: 0.18 },
          borderColor: { duration: 0.18 },
        }}
      />

      {/* 3. Inner Core (Crisp 6px solid amber/gold dot tracking exact coordinates instantaneously) */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[99999] w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.9)]"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: cursorOpacity,
        }}
        animate={{
          scale: isClicked ? 0.7 : isHovered ? 1.25 : 1,
        }}
        transition={{
          scale: { type: 'spring', stiffness: 400, damping: 25 },
        }}
      />
    </div>
  );
}
