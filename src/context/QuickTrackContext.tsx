import React, { createContext, useContext, useState } from 'react';

interface QuickTrackContextType {
  isOpen: boolean;
  orderId: string;
  openQuickTrack: (id: string) => void;
  closeQuickTrack: () => void;
  setOrderId: (id: string) => void;
}

const QuickTrackContext = createContext<QuickTrackContextType | undefined>(undefined);

export function QuickTrackProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [orderId, setOrderId] = useState('');

  const openQuickTrack = (id: string) => {
    setOrderId(id.trim());
    setIsOpen(true);
  };

  const closeQuickTrack = () => {
    setIsOpen(false);
  };

  return (
    <QuickTrackContext.Provider value={{ isOpen, orderId, openQuickTrack, closeQuickTrack, setOrderId }}>
      {children}
    </QuickTrackContext.Provider>
  );
}

export function useQuickTrack() {
  const context = useContext(QuickTrackContext);
  if (context === undefined) {
    throw new Error('useQuickTrack must be used within a QuickTrackProvider');
  }
  return context;
}
