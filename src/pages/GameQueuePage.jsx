import React from 'react';
import { GameQueue } from '@/components/game/GameQueue';
import { Toaster } from 'sonner';

export default function GameQueuePage() {
  return (
    <>
      <GameQueue />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: 'white',
            border: '2px solid black',
            borderRadius: '12px',
            boxShadow: '4px 4px 0 #000',
          },
        }}
      />
    </>
  );
}
