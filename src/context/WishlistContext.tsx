import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WishlistContextType {
  wishlistIds: string[];
  toggleWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('maisonh_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('maisonh_wishlist', JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  const toggleWishlist = (id: string) => {
    setWishlistIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const isInWishlist = (id: string) => wishlistIds.includes(id);

  return (
    <WishlistContext.Provider value={{ wishlistIds, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
