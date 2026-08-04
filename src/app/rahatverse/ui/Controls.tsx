'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

interface ControlsProps {
  isPlaying: boolean;
  onPauseResume: () => void;
  onRestart: () => void;
  onModeSwitch: (mode: 'auto' | 'explore') => void;
  currentMode: 'auto' | 'explore';
}

export function Controls({
  isPlaying,
  onPauseResume,
  onRestart,
  onModeSwitch,
  currentMode,
}: ControlsProps) {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-wrap gap-3 justify-center">
      <Button
        onClick={onPauseResume}
        variant="outline"
        className="border-white/30 text-white hover:bg-white/10 px-6"
      >
        {isPlaying ? 'Pause Tour' : 'Resume Tour'}
      </Button>

      <Button
        onClick={onRestart}
        variant="outline"
        className="border-white/30 text-white hover:bg-white/10"
      >
        Restart Tour
      </Button>

      <Button
        onClick={() => onModeSwitch(currentMode === 'auto' ? 'explore' : 'auto')}
        variant="outline"
        className="border-white/30 text-white hover:bg-white/10"
      >
        {currentMode === 'auto' ? 'Explore Mode' : 'Auto Tour'}
      </Button>
    </div>
  );
}
