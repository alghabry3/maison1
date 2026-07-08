import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '../data';

interface CompareContextType {
  compareItems: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isCompared: (productId: string) => boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareItems, setCompareItems] = useState<Product[]>([]);

  const addToCompare = (product: Product) => {
    setCompareItems((prev) => {
      if (prev.length < 3 && !prev.some(p => p.id === product.id)) {
        return [...prev, product];
      }
      return prev;
    });
  };

  const removeFromCompare = (productId: string) => {
    setCompareItems((prev) => prev.filter(p => p.id !== productId));
  };

  const clearCompare = () => {
    setCompareItems([]);
  };

  const isCompared = (productId: string) => {
    return compareItems.some(p => p.id === productId);
  };

  return (
    <CompareContext.Provider value={{ compareItems, addToCompare, removeFromCompare, clearCompare, isCompared }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (context === undefined) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
}
