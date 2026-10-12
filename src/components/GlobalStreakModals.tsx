'use client';

import React from 'react';
import { useGame } from '@/context/GameContext';
import StreakCelebrationModal from './StreakCelebrationModal';
import StreakClaimModal from './StreakClaimModal';

export default function GlobalStreakModals() {
  const {
    celebrationPrize,
    setCelebrationPrize,
    isStreakClaimModalOpen,
    setIsStreakClaimModalOpen,
    selectedPrizeToClaim,
    setSelectedPrizeToClaim,
    openClaimModalForPrize,
  } = useGame();

  return (
    <>
      <StreakCelebrationModal
        prize={celebrationPrize}
        onClose={() => setCelebrationPrize(null)}
        onClaim={(prize) => {
          setCelebrationPrize(null);
          openClaimModalForPrize(prize);
        }}
      />

      <StreakClaimModal
        prize={selectedPrizeToClaim}
        isOpen={isStreakClaimModalOpen}
        onClose={() => {
          setIsStreakClaimModalOpen(false);
          setSelectedPrizeToClaim(null);
        }}
      />
    </>
  );
}
