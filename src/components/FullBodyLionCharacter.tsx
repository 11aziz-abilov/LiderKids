'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GradeLevel, EquippedItems } from '@/types';

export type LionAction = 'idle' | 'wave' | 'dance' | 'jump' | 'roar' | 'flex' | 'study';

interface FullBodyLionCharacterProps {
  grade?: GradeLevel;
  gender?: 'boy' | 'girl';
  equipped?: EquippedItems;
  action?: LionAction;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function FullBodyLionCharacter({
  grade = 1,
  gender = 'boy',
  equipped = {},
  action = 'idle',
  size = 'md',
  className = '',
}: FullBodyLionCharacterProps) {
  const isGirl = gender === 'girl';

  // Sizing map
  const sizeClasses = {
    sm: 'w-36 h-44',
    md: 'w-52 h-64',
    lg: 'w-64 h-80',
    xl: 'w-80 h-96',
  };

  // Base colors
  const skinColor = isGirl ? '#FBBF24' : '#F59E0B'; // Soft honey vs golden amber
  const bellyColor = '#FEF3C7'; // Light cream
  const pawPadColor = isGirl ? '#FDA4AF' : '#FDBA74'; // Pink vs peach
  const innerEarColor = isGirl ? '#FECDD3' : '#FED7AA';
  const boyManeColor = grade === 4 ? '#92400E' : grade === 3 ? '#B45309' : '#D97706';

  // Dynamic animation variants based on action
  const bodyVariants = {
    idle: {
      y: [0, -6, 0],
      transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' as const },
    },
    wave: {
      rotate: [0, -3, 3, 0],
      y: [0, -4, 0],
      transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' as const },
    },
    dance: {
      rotate: [-6, 6, -6],
      x: [-5, 5, -5],
      y: [0, -8, 0],
      transition: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' as const },
    },
    jump: {
      y: [0, -28, 4, 0],
      scaleY: [1, 1.12, 0.94, 1],
      scaleX: [1, 0.94, 1.05, 1],
      transition: { duration: 0.7, repeat: Infinity, ease: 'easeInOut' as const },
    },
    roar: {
      scale: [1, 1.1, 1.05, 1],
      rotate: [0, -2, 2, 0],
      transition: { duration: 1, repeat: Infinity, ease: 'easeInOut' as const },
    },
    flex: {
      scale: [1, 1.06, 1],
      y: [0, -4, 0],
      transition: { duration: 1, repeat: Infinity, ease: 'easeInOut' as const },
    },
    study: {
      y: [0, -3, 0],
      rotate: [-1, 1, -1],
      transition: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' as const },
    },
  };

  const rightArmVariants = {
    idle: { rotate: [0, 4, 0], transition: { duration: 2.5, repeat: Infinity } },
    wave: {
      rotate: [-35, 25, -35],
      y: [-6, -10, -6],
      transition: { duration: 0.6, repeat: Infinity, ease: 'easeInOut' as const },
    },
    dance: {
      rotate: [-25, 30, -25],
      transition: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' as const },
    },
    jump: {
      rotate: [-40, -40],
      y: -8,
      transition: { duration: 0.7, repeat: Infinity },
    },
    roar: {
      rotate: [20, 35, 20],
      x: [0, 5, 0],
      transition: { duration: 1, repeat: Infinity },
    },
    flex: {
      rotate: [-110, -125, -110],
      y: [-10, -14, -10],
      x: [-8, -10, -8],
      scale: [1, 1.1, 1],
      transition: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' as const },
    },
    study: {
      rotate: [-35, -40, -35],
      x: [-12, -12, -12],
      y: [-10, -10, -10],
      transition: { duration: 2, repeat: Infinity },
    },
  };

  const leftArmVariants = {
    idle: { rotate: [0, -4, 0], transition: { duration: 2.5, repeat: Infinity } },
    wave: { rotate: [0, 5, 0], transition: { duration: 1.2, repeat: Infinity } },
    dance: {
      rotate: [30, -25, 30],
      transition: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' as const },
    },
    jump: {
      rotate: [40, 40],
      y: -8,
      transition: { duration: 0.7, repeat: Infinity },
    },
    roar: {
      rotate: [-20, -35, -20],
      x: [0, -5, 0],
      transition: { duration: 1, repeat: Infinity },
    },
    flex: {
      rotate: [110, 125, 110],
      y: [-10, -14, -10],
      x: [8, 10, 8],
      scale: [1, 1.1, 1],
      transition: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' as const },
    },
    study: {
      rotate: [35, 40, 35],
      x: [12, 12, 12],
      y: [-10, -10, -10],
      transition: { duration: 2, repeat: Infinity },
    },
  };

  const tailVariants = {
    idle: {
      rotate: [-6, 12, -6],
      transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' as const },
    },
    wave: {
      rotate: [-12, 16, -12],
      transition: { duration: 1, repeat: Infinity, ease: 'easeInOut' as const },
    },
    dance: {
      rotate: [-20, 20, -20],
      transition: { duration: 0.6, repeat: Infinity, ease: 'easeInOut' as const },
    },
    jump: {
      rotate: [0, 25, 0],
      transition: { duration: 0.7, repeat: Infinity, ease: 'easeInOut' as const },
    },
    roar: {
      rotate: [15, 25, 15],
      transition: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' as const },
    },
    flex: {
      rotate: [15, 30, 15],
      transition: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' as const },
    },
    study: {
      rotate: [-6, 6, -6],
      transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' as const },
    },
  };

  return (
    <motion.div
      variants={bodyVariants}
      animate={action}
      className={`relative select-none flex items-center justify-center ${sizeClasses[size]} ${className}`}
    >
      <svg
        viewBox="0 0 280 340"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-2xl overflow-visible"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="bodyGradBoy" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          <linearGradient id="bodyGradGirl" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="70%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
          <linearGradient id="goldManeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#92400E" />
          </linearGradient>
          <linearGradient id="princessSkirtGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F472B6" />
            <stop offset="100%" stopColor="#DB2777" />
          </linearGradient>
          <linearGradient id="capeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DC2626" />
            <stop offset="100%" stopColor="#991B1B" />
          </linearGradient>
          <linearGradient id="pmSuitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E3A8A" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
          <linearGradient id="heroSuitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
          <linearGradient id="spaceSuitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F8FAFC" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </linearGradient>
          <linearGradient id="crownGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#CA8A04" />
          </linearGradient>
          <radialGradient id="sparkleGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FEF08A" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ======================================================== */}
        {/* LAYER 1: BACKPACK (BEHIND BODY) */}
        {/* ======================================================== */}
        {equipped.backpack && (
          <g id="layer-backpack-behind">
            {/* Red school backpack */}
            {equipped.backpack === 'backpack_red' && (
              <g>
                <rect x="52" y="165" width="46" height="60" rx="14" fill="#EF4444" stroke="#B91C1C" strokeWidth="3" />
                <rect x="58" y="180" width="34" height="28" rx="8" fill="#DC2626" />
                <path d="M 64 165 L 64 150 Q 75 145 86 150 L 86 165" stroke="#991B1B" strokeWidth="4" fill="none" strokeLinecap="round" />
                <circle cx="75" cy="194" r="5" fill="#FDE047" />
              </g>
            )}

            {/* Pink star backpack (Girl) */}
            {equipped.backpack === 'backpack_pink_girl' && (
              <g>
                <rect x="50" y="165" width="48" height="60" rx="16" fill="#F472B6" stroke="#DB2777" strokeWidth="3" />
                <rect x="56" y="182" width="36" height="26" rx="8" fill="#EC4899" />
                <path d="M 64 165 L 64 150 Q 74 144 84 150 L 84 165" stroke="#BE185D" strokeWidth="4" fill="none" />
                {/* Yellow star badge */}
                <polygon points="74,188 76,193 81,193 77,196 79,201 74,198 69,201 71,196 67,193 72,193" fill="#FDE047" />
              </g>
            )}

            {/* Unicorn backpack (Girl) */}
            {equipped.backpack === 'backpack_unicorn_girl' && (
              <g>
                <rect x="50" y="165" width="48" height="60" rx="16" fill="#E879F9" stroke="#A855F7" strokeWidth="3" />
                {/* Unicorn horn & ears */}
                <polygon points="56,156 62,136 68,156" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" />
                <circle cx="52" cy="162" r="6" fill="#F472B6" />
                <circle cx="72" cy="162" r="6" fill="#F472B6" />
                <rect x="56" y="184" width="36" height="24" rx="8" fill="#C084FC" />
              </g>
            )}

            {/* Rocket backpack (Boy) */}
            {equipped.backpack === 'backpack_rocket_boy' && (
              <g>
                <rect x="48" y="165" width="44" height="65" rx="16" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="3" />
                {/* Rocket fins & nose */}
                <polygon points="70,140 54,165 86,165" fill="#EF4444" />
                <circle cx="70" cy="180" r="10" fill="#93C5FD" stroke="#1E40AF" strokeWidth="2" />
                {/* Rocket flame */}
                <polygon points="62,230 70,250 78,230" fill="#F97316" />
                <polygon points="66,230 70,242 74,230" fill="#FDE047" />
              </g>
            )}

            {/* Briefcase (Boy) */}
            {equipped.backpack === 'briefcase_leather_boy' && (
              <g>
                <rect x="42" y="220" width="55" height="42" rx="6" fill="#78350F" stroke="#451A03" strokeWidth="3" />
                <rect x="58" y="212" width="24" height="10" rx="3" fill="none" stroke="#451A03" strokeWidth="3" />
                <rect x="65" y="234" width="10" height="7" rx="1" fill="#FACC15" />
                <line x1="42" y1="230" x2="97" y2="230" stroke="#92400E" strokeWidth="2" />
              </g>
            )}

            {/* Neon Cyber Backpack */}
            {equipped.backpack === 'backpack_neon' && (
              <g>
                <rect x="50" y="165" width="48" height="62" rx="14" fill="#0F172A" stroke="#10B981" strokeWidth="3.5" />
                <line x1="56" y1="180" x2="92" y2="180" stroke="#06B6D4" strokeWidth="3" />
                <line x1="56" y1="195" x2="92" y2="195" stroke="#10B981" strokeWidth="3" />
                <polygon points="74,182 78,190 74,198 70,190" fill="#22C55E" />
              </g>
            )}

            {/* Gold Champion Backpack */}
            {equipped.backpack === 'backpack_gold' && (
              <g>
                <rect x="48" y="165" width="50" height="62" rx="16" fill="url(#crownGrad)" stroke="#B45309" strokeWidth="3" />
                <circle cx="73" cy="192" r="12" fill="#FEF08A" stroke="#CA8A04" strokeWidth="2" />
                <text x="73" y="197" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#B45309">★</text>
              </g>
            )}
          </g>
        )}

        {/* ======================================================== */}
        {/* LAYER 2: TAIL (ANIMATED) */}
        {/* ======================================================== */}
        <motion.g
          variants={tailVariants}
          animate={action}
          style={{ originX: '95px', originY: '240px' }}
        >
          {/* Tail body */}
          <path
            d="M 95 240 C 65 245 42 215 48 185 C 50 175 60 170 65 178"
            stroke={skinColor}
            strokeWidth="11"
            strokeLinecap="round"
            fill="none"
          />
          {/* Fluffy tail tuft */}
          <ellipse
            cx="64"
            cy="176"
            rx="12"
            ry="14"
            fill={isGirl ? '#F472B6' : boyManeColor}
            transform="rotate(-20 64 176)"
          />
          {/* Cute ribbon on tail tip for girl */}
          {isGirl && (
            <path
              d="M 64 186 C 58 192 56 195 54 200 M 64 186 C 68 193 72 195 74 200"
              stroke="#FB7185"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          )}
        </motion.g>

        {/* ======================================================== */}
        {/* LAYER 3: LEGS & PAWS (FEET) */}
        {/* ======================================================== */}
        {/* Left Foot */}
        <g id="left-foot">
          <ellipse cx="112" cy="284" rx="22" ry="15" fill={skinColor} stroke="#B45309" strokeWidth="2.5" />
          {/* Toe cushions */}
          <circle cx="102" cy="287" r="5" fill={pawPadColor} />
          <circle cx="112" cy="289" r="5.5" fill={pawPadColor} />
          <circle cx="122" cy="287" r="5" fill={pawPadColor} />
          <ellipse cx="112" cy="279" rx="8" ry="6" fill={pawPadColor} />
        </g>

        {/* Right Foot */}
        <g id="right-foot">
          <ellipse cx="168" cy="284" rx="22" ry="15" fill={skinColor} stroke="#B45309" strokeWidth="2.5" />
          {/* Toe cushions */}
          <circle cx="158" cy="287" r="5" fill={pawPadColor} />
          <circle cx="168" cy="289" r="5.5" fill={pawPadColor} />
          <circle cx="178" cy="287" r="5" fill={pawPadColor} />
          <ellipse cx="168" cy="279" rx="8" ry="6" fill={pawPadColor} />
        </g>

        {/* ======================================================== */}
        {/* LAYER 4: TORSO & BELLY */}
        {/* ======================================================== */}
        <g id="torso">
          {/* Main chubby body pear shape */}
          <path
            d="M 100 170 C 85 200 86 260 110 276 C 125 284 155 284 170 276 C 194 260 195 200 180 170 C 168 152 112 152 100 170 Z"
            fill={isGirl ? 'url(#bodyGradGirl)' : 'url(#bodyGradBoy)'}
            stroke="#B45309"
            strokeWidth="3"
          />

          {/* Natural belly cream patch */}
          <ellipse cx="140" cy="226" rx="34" ry="40" fill={bellyColor} />
        </g>

        {/* ======================================================== */}
        {/* LAYER 5: OUTFITS (CLOTHING WORN ON BODY!) */}
        {/* ======================================================== */}
        {equipped.outfit && (
          <g id="layer-outfit-clothing">
            {/* 1. PRESIDENT SCHOOL BOY SUIT */}
            {equipped.outfit === 'uniform_pm_boy' && (
              <g>
                {/* Dark Navy Blazer */}
                <path
                  d="M 98 174 C 90 205 92 245 106 270 C 118 274 162 274 174 270 C 188 245 190 205 182 174 C 170 162 110 162 98 174 Z"
                  fill="url(#pmSuitGrad)"
                  stroke="#0A0F1D"
                  strokeWidth="2.5"
                />
                {/* White Shirt Collar V-shape */}
                <polygon points="122,165 140,210 158,165" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
                {/* Red Silk Necktie */}
                <polygon points="137,178 143,178 145,215 140,224 135,215" fill="#DC2626" />
                <circle cx="140" cy="180" r="3.5" fill="#B91C1C" />
                {/* Gold Blazer Buttons */}
                <circle cx="140" cy="235" r="3" fill="#FACC15" />
                <circle cx="140" cy="250" r="3" fill="#FACC15" />
                {/* Gold PM Crest on chest */}
                <circle cx="162" cy="202" r="5" fill="#FACC15" stroke="#CA8A04" strokeWidth="1" />
                <text x="162" y="205" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#1E3A8A">PM</text>
              </g>
            )}

            {/* 2. ROYAL VELVET CAPE */}
            {equipped.outfit === 'royal_cape_boy' && (
              <g>
                {/* Draped crimson cape with folds */}
                <path
                  d="M 94 170 C 80 205 78 250 84 278 C 104 282 176 282 196 278 C 202 250 200 205 186 170 C 170 162 110 162 94 170 Z"
                  fill="url(#capeGrad)"
                  stroke="#7F1D1D"
                  strokeWidth="3"
                />
                {/* Golden Fur/Trim Hem */}
                <path
                  d="M 84 274 Q 140 286 196 274 Q 140 280 84 274 Z"
                  fill="#FDE047"
                  stroke="#CA8A04"
                  strokeWidth="2"
                />
                {/* White Ermine Dots on Trim */}
                <circle cx="110" cy="276" r="2" fill="#78350F" />
                <circle cx="140" cy="279" r="2" fill="#78350F" />
                <circle cx="170" cy="276" r="2" fill="#78350F" />
                {/* Golden Neck Collar & Chain */}
                <path d="M 112 172 Q 140 188 168 172" stroke="#FACC15" strokeWidth="4" fill="none" />
                <circle cx="140" cy="186" r="6" fill="#DC2626" stroke="#FACC15" strokeWidth="2" />
              </g>
            )}

            {/* 3. SUPERHERO SUIT (BOY) */}
            {equipped.outfit === 'superhero_suit_boy' && (
              <g>
                {/* Bright Blue Body Suit */}
                <path
                  d="M 98 172 C 88 202 89 250 106 272 C 120 278 160 278 174 272 C 191 250 192 202 182 172 Z"
                  fill="url(#heroSuitGrad)"
                  stroke="#1E40AF"
                  strokeWidth="2.5"
                />
                {/* Red Superhero Chest Shield */}
                <polygon points="140,185 158,198 152,224 140,234 128,224 122,198" fill="#DC2626" stroke="#FEF08A" strokeWidth="2" />
                {/* Yellow Lightning Bolt Logo inside Shield */}
                <polygon points="142,192 133,208 140,208 137,225 147,204 141,204" fill="#FDE047" />
                {/* Yellow Belt */}
                <rect x="108" y="254" width="64" height="10" rx="3" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" />
                <circle cx="140" cy="259" r="6" fill="#EF4444" stroke="#FACC15" strokeWidth="1.5" />
              </g>
            )}

            {/* 4. KARATE GI (BOY) */}
            {equipped.outfit === 'karate_gi_boy' && (
              <g>
                {/* Crisp White Kimono Jacket */}
                <path
                  d="M 96 172 C 86 205 88 250 106 272 C 120 278 160 278 174 272 C 192 250 194 205 184 172 Z"
                  fill="#F8FAFC"
                  stroke="#94A3B8"
                  strokeWidth="2.5"
                />
                {/* Wrap front left flap */}
                <path d="M 106 172 L 152 248 L 126 248 Z" fill="#E2E8F0" />
                {/* Black Champion Belt */}
                <rect x="104" y="244" width="72" height="12" rx="2" fill="#09090B" />
                {/* Belt tied knot & dangling ends */}
                <rect x="135" y="242" width="10" height="16" rx="2" fill="#18181B" />
                <polygon points="134,256 130,278 138,276 138,256" fill="#09090B" />
                <polygon points="142,256 142,276 150,278 146,256" fill="#09090B" />
              </g>
            )}

            {/* 5. ASTRONAUT SPACE SUIT (BOY) */}
            {equipped.outfit === 'space_suit_boy' && (
              <g>
                <path
                  d="M 96 172 C 86 205 88 250 106 272 C 120 278 160 278 174 272 C 192 250 194 205 184 172 Z"
                  fill="url(#spaceSuitGrad)"
                  stroke="#64748B"
                  strokeWidth="3"
                />
                {/* High Tech Chest Panel */}
                <rect x="122" y="196" width="36" height="34" rx="6" fill="#0F172A" stroke="#06B6D4" strokeWidth="2" />
                {/* Cyan Glowing Indicators */}
                <circle cx="130" cy="206" r="3" fill="#22C55E" />
                <circle cx="140" cy="206" r="3" fill="#06B6D4" />
                <circle cx="150" cy="206" r="3" fill="#EF4444" />
                <rect x="128" y="216" width="24" height="6" rx="2" fill="#0284C7" />
                {/* Uzbekistan Flag Patch */}
                <rect x="104" y="192" width="14" height="9" rx="1" fill="#0284C7" stroke="#CBD5E1" strokeWidth="0.5" />
              </g>
            )}

            {/* 6. COZY HOODIE (BOY) */}
            {equipped.outfit === 'cozy_hoodie_boy' && (
              <g>
                <path
                  d="M 96 172 C 86 205 88 250 106 272 C 120 278 160 278 174 272 C 192 250 194 205 184 172 Z"
                  fill="#D97706"
                  stroke="#92400E"
                  strokeWidth="2.5"
                />
                {/* Kangaroo Pocket */}
                <path d="M 118 238 L 162 238 L 166 262 L 114 262 Z" fill="#B45309" stroke="#78350F" strokeWidth="1.5" />
                {/* White Strings */}
                <line x1="134" y1="172" x2="134" y2="198" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="146" y1="172" x2="146" y2="198" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
              </g>
            )}

            {/* 7. PRINCESS GOWN (GIRL) */}
            {equipped.outfit === 'princess_dress_girl' && (
              <g>
                {/* Bodice with sweetheart neckline */}
                <path
                  d="M 106 172 C 100 195 102 225 116 238 C 126 244 154 244 164 238 C 178 225 180 195 174 172 Z"
                  fill="url(#princessSkirtGrad)"
                  stroke="#BE185D"
                  strokeWidth="2"
                />
                {/* Flared Ballerina/Princess Skirt */}
                <path
                  d="M 114 236 C 80 252 74 278 80 286 C 105 292 175 292 200 286 C 206 278 200 252 166 236 Z"
                  fill="#F472B6"
                  stroke="#DB2777"
                  strokeWidth="2.5"
                />
                {/* Sparkle lace layer */}
                <path
                  d="M 118 244 Q 140 258 162 244 Q 185 275 194 284 Q 140 289 86 284 Z"
                  fill="#FDF2F8"
                  opacity="0.65"
                />
                {/* Gold Tiara Belt Waist with gem */}
                <ellipse cx="140" cy="237" rx="26" ry="5" fill="#FDE047" stroke="#CA8A04" strokeWidth="1.5" />
                <circle cx="140" cy="237" r="4.5" fill="#EC4899" stroke="#FDE047" strokeWidth="1.5" />
                {/* Shoulder Puff Sleeves */}
                <circle cx="98" cy="176" r="12" fill="#F472B6" stroke="#DB2777" strokeWidth="1.5" />
                <circle cx="182" cy="176" r="12" fill="#F472B6" stroke="#DB2777" strokeWidth="1.5" />
              </g>
            )}

            {/* 8. SCHOOL APRON UNIFORM (GIRL) */}
            {equipped.outfit === 'school_apron_girl' && (
              <g>
                {/* Navy Blue School Dress Base */}
                <path
                  d="M 98 174 C 88 205 90 248 106 272 C 120 278 160 278 174 272 C 190 248 192 205 182 174 Z"
                  fill="#1E293B"
                  stroke="#0F172A"
                  strokeWidth="2.5"
                />
                {/* Pristine White Ruffled Lace Apron (Oq Fartuk) */}
                <path
                  d="M 120 174 L 126 234 L 154 234 L 160 174 Z"
                  fill="#FFFFFF"
                  stroke="#E2E8F0"
                  strokeWidth="2"
                />
                {/* Flared ruffled apron skirt */}
                <path
                  d="M 112 234 C 95 248 90 270 96 280 C 115 284 165 284 184 280 C 190 270 185 248 168 234 Z"
                  fill="#FFFFFF"
                  stroke="#CBD5E1"
                  strokeWidth="2"
                />
                {/* Ruffled Shoulder Straps */}
                <path d="M 116 172 Q 106 195 120 234" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round" />
                <path d="M 164 172 Q 174 195 160 234" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round" />
                {/* White Satin Ribbon at waist */}
                <rect x="122" y="232" width="36" height="6" rx="2" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1" />
                <circle cx="140" cy="235" r="4" fill="#F43F5E" />
              </g>
            )}

            {/* 9. BALLERINA TUTU SUIT (GIRL) */}
            {equipped.outfit === 'ballerina_suit_girl' && (
              <g>
                {/* Pastel Pink Bodice */}
                <path
                  d="M 108 172 C 102 195 104 225 116 236 C 126 242 154 242 164 236 C 176 225 178 195 172 172 Z"
                  fill="#F472B6"
                  stroke="#DB2777"
                  strokeWidth="2"
                />
                {/* Puffy Tutu Skirt Layers */}
                <ellipse cx="140" cy="245" rx="55" ry="16" fill="#FDF2F8" stroke="#F472B6" strokeWidth="2" />
                <ellipse cx="140" cy="243" rx="46" ry="13" fill="#FCE7F3" stroke="#EC4899" strokeWidth="1.5" />
                <ellipse cx="140" cy="240" rx="38" ry="10" fill="#FBCFE8" />
                {/* Satin ribbon bow at waist */}
                <circle cx="140" cy="236" r="4" fill="#DB2777" />
                <path d="M 136 236 C 130 240 126 246 124 250" stroke="#DB2777" strokeWidth="2" />
                <path d="M 144 236 C 150 240 154 246 156 250" stroke="#DB2777" strokeWidth="2" />
              </g>
            )}

            {/* 10. SUPERHERO GIRL DRESS */}
            {equipped.outfit === 'superhero_dress_girl' && (
              <g>
                {/* Purple Suit Top */}
                <path
                  d="M 102 172 C 92 202 94 240 112 254 C 122 260 158 260 168 254 C 186 240 188 202 178 172 Z"
                  fill="#7C3AED"
                  stroke="#5B21B6"
                  strokeWidth="2.5"
                />
                {/* Flared Pink Hero Skirt */}
                <path
                  d="M 112 252 C 92 262 88 278 94 284 C 114 288 166 288 186 284 C 192 278 188 262 168 252 Z"
                  fill="#EC4899"
                  stroke="#BE185D"
                  strokeWidth="2"
                />
                {/* Glowing Yellow Star Chest Emblem */}
                <polygon
                  points="140,190 144,202 156,202 146,210 150,222 140,214 130,222 134,210 124,202 136,202"
                  fill="#FDE047"
                  stroke="#CA8A04"
                  strokeWidth="1.5"
                />
              </g>
            )}

            {/* 11. SPRING FLORAL DRESS (GIRL) */}
            {equipped.outfit === 'spring_dress_girl' && (
              <g>
                {/* Mint Green Dress */}
                <path
                  d="M 102 172 C 90 205 92 248 106 272 C 120 278 160 278 174 272 C 188 248 190 205 178 172 Z"
                  fill="#6EE7B7"
                  stroke="#059669"
                  strokeWidth="2.5"
                />
                {/* Flared dress skirt */}
                <path
                  d="M 110 238 C 88 254 84 276 90 284 C 112 288 168 288 190 284 C 196 276 192 254 170 238 Z"
                  fill="#A7F3D0"
                  stroke="#059669"
                  strokeWidth="2"
                />
                {/* Cute daisy flowers on dress */}
                <circle cx="125" cy="215" r="4" fill="#FFFFFF" /><circle cx="125" cy="215" r="2" fill="#FACC15" />
                <circle cx="155" cy="225" r="4" fill="#FFFFFF" /><circle cx="155" cy="225" r="2" fill="#FACC15" />
                <circle cx="138" cy="256" r="4" fill="#FFFFFF" /><circle cx="138" cy="256" r="2" fill="#FACC15" />
                <circle cx="116" cy="268" r="4" fill="#FFFFFF" /><circle cx="116" cy="268" r="2" fill="#FACC15" />
                <circle cx="164" cy="268" r="4" fill="#FFFFFF" /><circle cx="164" cy="268" r="2" fill="#FACC15" />
              </g>
            )}

            {/* 12. COZY HOODIE (GIRL) */}
            {equipped.outfit === 'cozy_hoodie_girl' && (
              <g>
                <path
                  d="M 98 172 C 88 205 90 250 106 272 C 120 278 160 278 174 272 C 190 250 192 205 182 172 Z"
                  fill="#C084FC"
                  stroke="#7E22CE"
                  strokeWidth="2.5"
                />
                {/* Front pouch pocket with little heart */}
                <path d="M 120 238 L 160 238 L 164 262 L 116 262 Z" fill="#A855F7" stroke="#6B21A8" strokeWidth="1.5" />
                <circle cx="137" cy="249" r="3" fill="#F43F5E" />
                <circle cx="143" cy="249" r="3" fill="#F43F5E" />
                <polygon points="134,250 146,250 140,257" fill="#F43F5E" />
              </g>
            )}
          </g>
        )}

        {/* ======================================================== */}
        {/* LAYER 6: ARMS & PAWS (ANIMATED BY ACTION) */}
        {/* ======================================================== */}
        {/* Left Arm */}
        <motion.g
          variants={leftArmVariants}
          animate={action}
          style={{ originX: '100px', originY: '175px' }}
        >
          <path
            d="M 100 175 C 80 185 70 215 84 235 C 92 245 106 242 108 230 C 110 215 110 185 100 175 Z"
            fill={skinColor}
            stroke="#B45309"
            strokeWidth="2.5"
          />
          {/* Paw pad cushions */}
          <circle cx="92" cy="234" r="5" fill={pawPadColor} />
          <circle cx="84" cy="228" r="3.5" fill={pawPadColor} />
          <circle cx="90" cy="224" r="3.5" fill={pawPadColor} />
          <circle cx="98" cy="226" r="3.5" fill={pawPadColor} />
        </motion.g>

        {/* Right Arm (Waving or holding wand) */}
        <motion.g
          variants={rightArmVariants}
          animate={action}
          style={{ originX: '180px', originY: '175px' }}
        >
          <path
            d="M 180 175 C 200 185 210 215 196 235 C 188 245 174 242 172 230 C 170 215 170 185 180 175 Z"
            fill={skinColor}
            stroke="#B45309"
            strokeWidth="2.5"
          />
          {/* Paw pad cushions */}
          <circle cx="188" cy="234" r="5" fill={pawPadColor} />
          <circle cx="196" cy="228" r="3.5" fill={pawPadColor} />
          <circle cx="190" cy="224" r="3.5" fill={pawPadColor} />
          <circle cx="182" cy="226" r="3.5" fill={pawPadColor} />

          {/* Magic Wand in paw if equipped */}
          {equipped.accessory === 'magic_wand' && (
            <g id="magic-wand-item">
              <line x1="188" y1="230" x2="225" y2="185" stroke="#FDE047" strokeWidth="4.5" strokeLinecap="round" />
              {/* Star on Wand Tip */}
              <polygon
                points="225,180 228,187 236,188 230,193 232,201 225,196 218,201 220,193 214,188 222,187"
                fill="#FDE047"
                stroke="#CA8A04"
                strokeWidth="1.5"
              />
              {/* Sparkle sparkles */}
              <circle cx="238" cy="180" r="2" fill="#FEF08A" />
              <circle cx="216" cy="176" r="2" fill="#FEF08A" />
              <circle cx="230" cy="208" r="2" fill="#FEF08A" />
            </g>
          )}
        </motion.g>

        {/* ======================================================== */}
        {/* LAYER 7: HEAD & EARS (BOY VS GIRL DIFFERENCES!) */}
        {/* ======================================================== */}
        <g id="head-group">
          {/* --- BOY LION MANE (GRADE BASED) --- */}
          {!isGirl && (
            <g id="boy-mane">
              {/* Grade 1 Mane (Cute Baby Tufts) */}
              {grade === 1 && (
                <g>
                  <circle cx="92" cy="72" r="16" fill="#D97706" />
                  <circle cx="140" cy="52" r="18" fill="#D97706" />
                  <circle cx="188" cy="72" r="16" fill="#D97706" />
                </g>
              )}
              {/* Grade 2 Mane (Playful Growing Mane) */}
              {grade === 2 && (
                <g>
                  <circle cx="86" cy="68" r="22" fill="#C2410C" />
                  <circle cx="140" cy="46" r="24" fill="#C2410C" />
                  <circle cx="194" cy="68" r="22" fill="#C2410C" />
                  <circle cx="76" cy="115" r="20" fill="#C2410C" />
                  <circle cx="204" cy="115" r="20" fill="#C2410C" />
                </g>
              )}
              {/* Grade 3 Mane (Teen Big Mane) */}
              {grade === 3 && (
                <g>
                  <circle cx="82" cy="65" r="28" fill="#B45309" />
                  <circle cx="140" cy="42" r="30" fill="#B45309" />
                  <circle cx="198" cy="65" r="28" fill="#B45309" />
                  <circle cx="68" cy="108" r="26" fill="#B45309" />
                  <circle cx="212" cy="108" r="26" fill="#B45309" />
                  <circle cx="80" cy="150" r="24" fill="#B45309" />
                  <circle cx="200" cy="150" r="24" fill="#B45309" />
                </g>
              )}
              {/* Grade 4 Mane (Magnificent King Mane) */}
              {grade === 4 && (
                <g>
                  <circle cx="78" cy="64" r="32" fill="url(#goldManeGrad)" />
                  <circle cx="140" cy="36" r="34" fill="url(#goldManeGrad)" />
                  <circle cx="202" cy="64" r="32" fill="url(#goldManeGrad)" />
                  <circle cx="64" cy="108" r="30" fill="url(#goldManeGrad)" />
                  <circle cx="216" cy="108" r="30" fill="url(#goldManeGrad)" />
                  <circle cx="76" cy="155" r="28" fill="url(#goldManeGrad)" />
                  <circle cx="204" cy="155" r="28" fill="url(#goldManeGrad)" />
                </g>
              )}
            </g>
          )}

          {/* --- GIRL LIONESS SOFT CURLS / TUFTS --- */}
          {isGirl && (
            <g id="girl-curls">
              <circle cx="106" cy="60" r="14" fill="#F59E0B" />
              <circle cx="140" cy="52" r="16" fill="#F59E0B" />
              <circle cx="174" cy="60" r="14" fill="#F59E0B" />
            </g>
          )}

          {/* EARS */}
          {/* Left Ear */}
          <circle cx="88" cy="74" r="24" fill={skinColor} stroke="#B45309" strokeWidth="2.5" />
          <circle cx="88" cy="74" r="14" fill={innerEarColor} />

          {/* Right Ear */}
          <circle cx="192" cy="74" r="24" fill={skinColor} stroke="#B45309" strokeWidth="2.5" />
          <circle cx="192" cy="74" r="14" fill={innerEarColor} />

          {/* GIRL: Pretty Ear Flower or Ear Bow by default */}
          {isGirl && (
            <g id="girl-ear-flower">
              {/* Cute Pink Blossom behind ear */}
              <circle cx="98" cy="58" r="7" fill="#F472B6" />
              <circle cx="106" cy="64" r="7" fill="#F472B6" />
              <circle cx="94" cy="68" r="7" fill="#F472B6" />
              <circle cx="104" cy="72" r="7" fill="#F472B6" />
              <circle cx="100" cy="65" r="5" fill="#FDE047" />
              {/* Green Leaf */}
              <ellipse cx="88" cy="58" rx="6" ry="3" fill="#10B981" transform="rotate(-30 88 58)" />
            </g>
          )}

          {/* MAIN HEAD CIRCLE */}
          <circle cx="140" cy="112" r="54" fill={skinColor} stroke="#B45309" strokeWidth="3" />

          {/* CHEEKS BLUSH */}
          <ellipse cx="104" cy="126" rx={isGirl ? "13" : "10"} ry={isGirl ? "9" : "7"} fill={isGirl ? "#FB7185" : "#FCA5A5"} opacity={isGirl ? 0.75 : 0.55} />
          <ellipse cx="176" cy="126" rx={isGirl ? "13" : "10"} ry={isGirl ? "9" : "7"} fill={isGirl ? "#FB7185" : "#FCA5A5"} opacity={isGirl ? 0.75 : 0.55} />

          {/* MUZZLE (Cream snout) */}
          <ellipse cx="140" cy="128" rx="24" ry="17" fill="#FEF3C7" stroke="#FDE68A" strokeWidth="1" />

          {/* NOSE */}
          <polygon
            points="140,118 132,126 148,126"
            fill={isGirl ? "#E11D48" : "#92400E"}
            rx="2"
          />

          {/* MOUTH & EXPRESSION (Depends on action) */}
          {action === 'roar' ? (
            /* Open roaring mouth with little fangs! */
            <g>
              <ellipse cx="140" cy="136" rx="14" ry="12" fill="#991B1B" />
              <path d="M 132 138 Q 140 148 148 138 Z" fill="#DC2626" />
              {/* Cute top fangs */}
              <polygon points="134,126 137,131 131,131" fill="#FFFFFF" />
              <polygon points="146,126 149,131 143,131" fill="#FFFFFF" />
            </g>
          ) : (
            /* Sweet smile */
            <g>
              <path
                d="M 132 126 Q 140 138 148 126"
                stroke={isGirl ? "#BE185D" : "#78350F"}
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
              <path d="M 134 130 Q 140 138 146 130" fill="#EF4444" />
            </g>
          )}

          {/* WHISKERS */}
          <line x1="124" y1="126" x2="102" y2="124" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="124" y1="130" x2="104" y2="132" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="156" y1="126" x2="178" y2="124" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="156" y1="130" x2="176" y2="132" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />

          {/* --- EYES --- */}
          {/* GIRL EYES: Big sparkling eyes with 3 fluttery eyelashes! */}
          {isGirl ? (
            <g id="girl-eyes">
              {/* Left Eye */}
              <ellipse cx="118" cy="104" rx="10" ry="13" fill="#18181B" />
              <circle cx="122" cy="100" r="4.5" fill="#FFFFFF" />
              <circle cx="115" cy="108" r="2.5" fill="#FFFFFF" />
              {/* Eyelashes Left */}
              <path d="M 110 97 C 104 94 98 96 95 98" stroke="#18181B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M 112 94 C 108 89 104 88 100 89" stroke="#18181B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M 116 92 C 114 86 112 84 108 84" stroke="#18181B" strokeWidth="2.5" strokeLinecap="round" fill="none" />

              {/* Right Eye */}
              {action === 'wave' || grade === 2 ? (
                /* Playful winking right eye */
                <path d="M 152 104 Q 163 94 174 104" stroke="#18181B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              ) : (
                /* Big open sparkly eye */
                <g>
                  <ellipse cx="162" cy="104" rx="10" ry="13" fill="#18181B" />
                  <circle cx="166" cy="100" r="4.5" fill="#FFFFFF" />
                  <circle cx="159" cy="108" r="2.5" fill="#FFFFFF" />
                  {/* Eyelashes Right */}
                  <path d="M 170 97 C 176 94 182 96 185 98" stroke="#18181B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  <path d="M 168 94 C 172 89 176 88 180 89" stroke="#18181B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  <path d="M 164 92 C 166 86 168 84 172 84" stroke="#18181B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                </g>
              )}
            </g>
          ) : (
            /* BOY EYES */
            <g id="boy-eyes">
              {/* Left Eye */}
              <ellipse cx="118" cy="104" rx="9" ry="12" fill="#18181B" />
              <circle cx="121" cy="101" r="4" fill="#FFFFFF" />
              <circle cx="116" cy="108" r="2" fill="#FFFFFF" />
              {/* Left Eyebrow */}
              <path d="M 108 88 L 126 90" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />

              {/* Right Eye */}
              {grade === 2 || action === 'wave' ? (
                /* Winking eye */
                <path d="M 152 104 Q 162 94 172 104" stroke="#18181B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              ) : (
                <g>
                  <ellipse cx="162" cy="104" rx="9" ry="12" fill="#18181B" />
                  <circle cx="165" cy="101" r="4" fill="#FFFFFF" />
                  <circle cx="160" cy="108" r="2" fill="#FFFFFF" />
                  {/* Right Eyebrow */}
                  <path d="M 172 88 L 154 90" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
                </g>
              )}
            </g>
          )}

          {/* ROAR SOUND WAVES & SPARKLES */}
          {action === 'roar' && (
            <g id="roar-waves">
              <path d="M 80 120 Q 60 130 80 140" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d="M 68 112 Q 44 130 68 148" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d="M 200 120 Q 220 130 200 140" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d="M 212 112 Q 236 130 212 148" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" fill="none" />
            </g>
          )}

          {/* DANCE MUSIC NOTES */}
          {action === 'dance' && (
            <g id="dance-notes">
              <text x="60" y="80" fontSize="24" fill="#EC4899" className="animate-bounce">🎵</text>
              <text x="210" y="70" fontSize="24" fill="#8B5CF6" className="animate-bounce">🎶</text>
            </g>
          )}

          {/* JUMP STARS */}
          {action === 'jump' && (
            <g id="jump-stars">
              <text x="70" y="60" fontSize="20" fill="#FACC15">⭐</text>
              <text x="200" y="55" fontSize="20" fill="#FACC15">✨</text>
              <text x="135" y="30" fontSize="22" fill="#F59E0B">🌟</text>
            </g>
          )}

          {/* FLEX WORKOUT HEADBAND & SWEAT DROPS (DUOLINGO WIDGET STYLE) */}
          {action === 'flex' && (
            <g id="flex-workout-decorations">
              {/* Athletic Workout Headband */}
              <path
                d="M 94 76 Q 140 68 186 76"
                stroke={isGirl ? '#EC4899' : '#10B981'}
                strokeWidth="10"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 98 76 Q 140 69 182 76"
                stroke={isGirl ? '#F472B6' : '#34D399'}
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
              {/* Forehead sweat drops */}
              <motion.path
                animate={{ y: [0, 5, 0], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                d="M 90 88 C 90 84 95 78 95 78 C 95 78 100 84 100 88 C 100 91.5 97.8 94 95 94 C 92.2 94 90 91.5 90 88 Z"
                fill="#38BDF8"
              />
              <motion.path
                animate={{ y: [0, 5, 0], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: 0.25 }}
                d="M 186 86 C 186 82 191 76 191 76 C 191 76 196 82 196 86 C 196 89.5 193.8 92 191 92 C 188.2 92 186 89.5 186 86 Z"
                fill="#38BDF8"
              />
              {/* Muscle flex sweat droplets */}
              <motion.g
                animate={{ scale: [1, 1.25, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                <text x="56" y="148" fontSize="20">💦</text>
                <text x="204" y="148" fontSize="20">💦</text>
              </motion.g>
              {/* Muscle flex power emojis */}
              <text x="52" y="210" fontSize="18">💪</text>
              <text x="210" y="210" fontSize="18">💪</text>
            </g>
          )}

          {/* STUDY ACTION DECORATIONS */}
          {action === 'study' && (
            <g id="study-decorations">
              {!equipped.accessory?.includes('glasses') && (
                <g id="study-glasses">
                  <circle cx="118" cy="104" r="15" fill="none" stroke="#2563EB" strokeWidth="3.5" />
                  <circle cx="162" cy="104" r="15" fill="none" stroke="#2563EB" strokeWidth="3.5" />
                  <line x1="133" y1="104" x2="147" y2="104" stroke="#2563EB" strokeWidth="3" />
                  <line x1="103" y1="102" x2="88" y2="98" stroke="#2563EB" strokeWidth="2.5" />
                  <line x1="177" y1="102" x2="192" y2="98" stroke="#2563EB" strokeWidth="2.5" />
                </g>
              )}
              {/* Open Book in front */}
              <g transform="translate(105, 205)">
                <rect x="0" y="0" width="34" height="26" rx="3" fill="#3B82F6" />
                <rect x="36" y="0" width="34" height="26" rx="3" fill="#2563EB" />
                <rect x="3" y="2" width="28" height="22" rx="2" fill="#FFFFFF" />
                <rect x="39" y="2" width="28" height="22" rx="2" fill="#FFFFFF" />
                <line x1="7" y1="7" x2="27" y2="7" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
                <line x1="7" y1="12" x2="25" y2="12" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
                <line x1="7" y1="17" x2="22" y2="17" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
                <line x1="43" y1="7" x2="63" y2="7" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
                <line x1="43" y1="12" x2="61" y2="12" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
                <line x1="43" y1="17" x2="58" y2="17" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
              </g>
              <text x="64" y="80" fontSize="22" className="animate-bounce">💡</text>
              <text x="198" y="75" fontSize="22" className="animate-bounce">📖</text>
            </g>
          )}
        </g>

        {/* ======================================================== */}
        {/* LAYER 8: ACCESSORIES (GLASSES, HEADPHONES, MEDAL) */}
        {/* ======================================================== */}
        {equipped.accessory && (
          <g id="layer-accessories">
            {/* 1. Smart Glasses */}
            {equipped.accessory === 'glasses_genius' && (
              <g id="smart-glasses">
                <circle cx="118" cy="104" r="16" fill="none" stroke="#4F46E5" strokeWidth="3.5" />
                <circle cx="162" cy="104" r="16" fill="none" stroke="#4F46E5" strokeWidth="3.5" />
                <line x1="134" y1="104" x2="146" y2="104" stroke="#4F46E5" strokeWidth="3" />
                <line x1="102" y1="102" x2="88" y2="98" stroke="#4F46E5" strokeWidth="2.5" />
                <line x1="178" y1="102" x2="192" y2="98" stroke="#4F46E5" strokeWidth="2.5" />
              </g>
            )}

            {/* 2. Gamer Neon Headphones */}
            {equipped.accessory === 'headphones_gamer' && (
              <g id="gamer-headphones">
                {/* Arc headband */}
                <path d="M 82 82 Q 140 24 198 82" stroke="#8B5CF6" strokeWidth="6" fill="none" strokeLinecap="round" />
                {/* Neon light strip */}
                <path d="M 92 76 Q 140 32 188 76" stroke="#06B6D4" strokeWidth="2" fill="none" />
                {/* Left Ear Cushion */}
                <rect x="70" y="70" width="16" height="32" rx="8" fill="#1E1B4B" stroke="#06B6D4" strokeWidth="2.5" />
                {/* Right Ear Cushion */}
                <rect x="194" y="70" width="16" height="32" rx="8" fill="#1E1B4B" stroke="#06B6D4" strokeWidth="2.5" />
              </g>
            )}

            {/* 3. Girl Pearl Necklace */}
            {equipped.accessory === 'pearl_necklace_girl' && (
              <g id="pearl-necklace">
                <path d="M 116 166 Q 140 186 164 166" stroke="#CBD5E1" strokeWidth="1" fill="none" />
                <circle cx="118" cy="167" r="4" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
                <circle cx="126" cy="172" r="4.5" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
                <circle cx="135" cy="176" r="5" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
                <circle cx="145" cy="176" r="5" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
                <circle cx="154" cy="172" r="4.5" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
                <circle cx="162" cy="167" r="4" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
                {/* Pink crystal pendant in center */}
                <circle cx="140" cy="184" r="4.5" fill="#EC4899" stroke="#FDE047" strokeWidth="1.5" />
              </g>
            )}

            {/* 4. Olympic Gold Medal */}
            {equipped.accessory === 'gold_medal' && (
              <g id="gold-medal">
                {/* Ribbon V */}
                <path d="M 124 166 L 140 196 L 156 166" stroke="#2563EB" strokeWidth="5" fill="none" />
                <path d="M 127 166 L 140 196 L 153 166" stroke="#DC2626" strokeWidth="2.5" fill="none" />
                {/* Gold medallion */}
                <circle cx="140" cy="204" r="13" fill="url(#crownGrad)" stroke="#B45309" strokeWidth="2" />
                <text x="140" y="209" textAnchor="middle" fontSize="13" fontWeight="900" fill="#78350F">1</text>
              </g>
            )}
          </g>
        )}

        {/* ======================================================== */}
        {/* LAYER 9: HATS & HEADWEAR (ROYAL CROWN, TIARA, BOW, ETC.) */}
        {/* ======================================================== */}
        {equipped.hat && (
          <g id="layer-hats">
            {/* 1. Shohona Oltin Toj (King/Queen Crown) */}
            {equipped.hat === 'crown_gold' && (
              <g id="golden-crown">
                <path
                  d="M 102 62 L 112 28 L 128 46 L 140 22 L 152 46 L 168 28 L 178 62 Z"
                  fill="url(#crownGrad)"
                  stroke="#A16207"
                  strokeWidth="2.5"
                />
                {/* Crown Gems */}
                <circle cx="112" cy="28" r="4" fill="#EF4444" />
                <circle cx="140" cy="22" r="5" fill="#3B82F6" />
                <circle cx="168" cy="28" r="4" fill="#10B981" />
                {/* Crown band jewels */}
                <rect x="108" y="56" width="64" height="6" rx="2" fill="#CA8A04" />
                <circle cx="125" cy="59" r="2.5" fill="#EC4899" />
                <circle cx="140" cy="59" r="2.5" fill="#38BDF8" />
                <circle cx="155" cy="59" r="2.5" fill="#EC4899" />
              </g>
            )}

            {/* 2. Princess Diamond Tiara (Girl) */}
            {equipped.hat === 'tiara_princess_girl' && (
              <g id="princess-tiara">
                <path
                  d="M 112 65 Q 140 50 168 65 L 160 48 L 150 56 L 140 38 L 130 56 L 120 48 Z"
                  fill="#FCE7F3"
                  stroke="#EC4899"
                  strokeWidth="2"
                />
                <circle cx="140" cy="38" r="4.5" fill="#EC4899" stroke="#FFFFFF" strokeWidth="1.5" />
                <circle cx="120" cy="48" r="3" fill="#F472B6" />
                <circle cx="160" cy="48" r="3" fill="#F472B6" />
              </g>
            )}

            {/* 3. Flower Crown (Girl) */}
            {equipped.hat === 'flower_crown_girl' && (
              <g id="flower-wreath">
                <path d="M 100 66 Q 140 48 180 66" stroke="#059669" strokeWidth="3" fill="none" />
                {/* Blooming roses & daisies */}
                <circle cx="106" cy="64" r="7" fill="#F43F5E" /><circle cx="106" cy="64" r="3" fill="#FEF08A" />
                <circle cx="122" cy="56" r="7" fill="#F472B6" /><circle cx="122" cy="56" r="3" fill="#FFFFFF" />
                <circle cx="140" cy="52" r="8" fill="#FB7185" /><circle cx="140" cy="52" r="3.5" fill="#FDE047" />
                <circle cx="158" cy="56" r="7" fill="#F472B6" /><circle cx="158" cy="56" r="3" fill="#FFFFFF" />
                <circle cx="174" cy="64" r="7" fill="#F43F5E" /><circle cx="174" cy="64" r="3" fill="#FEF08A" />
              </g>
            )}

            {/* 4. Large Pink Bow (Girl) */}
            {equipped.hat === 'pink_bow_girl' && (
              <g id="large-pink-bow">
                <path d="M 140 54 C 120 35 105 45 120 62 Z" fill="#F472B6" stroke="#DB2777" strokeWidth="2" />
                <path d="M 140 54 C 160 35 175 45 160 62 Z" fill="#F472B6" stroke="#DB2777" strokeWidth="2" />
                <circle cx="140" cy="54" r="6" fill="#DB2777" />
                {/* Ribbon tails */}
                <path d="M 137 58 Q 130 74 125 80" stroke="#F472B6" strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M 143 58 Q 150 74 155 80" stroke="#F472B6" strokeWidth="3" fill="none" strokeLinecap="round" />
              </g>
            )}

            {/* 5. Academic Graduation Cap */}
            {equipped.hat === 'grad_cap' && (
              <g id="grad-cap">
                {/* Rhombus mortarboard */}
                <polygon points="140,28 186,45 140,62 94,45" fill="#18181B" stroke="#09090B" strokeWidth="2" />
                {/* Cap skull base */}
                <path d="M 112 55 L 112 68 Q 140 76 168 68 L 168 55" fill="#27272A" />
                {/* Gold Tassel */}
                <circle cx="140" cy="45" r="3" fill="#FACC15" />
                <path d="M 140 45 Q 165 52 170 70" stroke="#FACC15" strokeWidth="2.5" fill="none" />
                <rect x="168" y="70" width="5" height="10" rx="1" fill="#EAB308" />
              </g>
            )}

            {/* 6. Detective Sherlock Hat (Boy) */}
            {equipped.hat === 'sherlock_hat_boy' && (
              <g id="sherlock-hat">
                <path d="M 94 65 Q 140 32 186 65" fill="#78350F" stroke="#451A03" strokeWidth="2.5" />
                {/* Front and back visors */}
                <path d="M 84 68 Q 98 62 110 65" stroke="#451A03" strokeWidth="4" strokeLinecap="round" />
                <path d="M 170 65 Q 182 62 196 68" stroke="#451A03" strokeWidth="4" strokeLinecap="round" />
                {/* Ear flaps tied on top */}
                <path d="M 130 42 Q 140 34 150 42" stroke="#451A03" strokeWidth="3" fill="none" />
              </g>
            )}

            {/* 7. Cool Baseball Cap */}
            {equipped.hat === 'cap_cool' && (
              <g id="baseball-cap">
                {/* Cap Dome */}
                <path d="M 104 65 Q 140 36 176 65 Z" fill="#0284C7" stroke="#0369A1" strokeWidth="2.5" />
                {/* Cap Visor Bill sticking forward */}
                <path d="M 100 66 Q 140 68 184 66 C 188 74 150 78 100 66" fill="#0369A1" />
                {/* Cap front button & eyelets */}
                <circle cx="140" cy="40" r="3" fill="#FDE047" />
              </g>
            )}
          </g>
        )}
      </svg>
    </motion.div>
  );
}
