import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../data';
import { getPriceInUom } from '../utils/uom';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedUomId: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number, uomId?: string) => void;
  removeFromCart: (productId: string, uomId: string) => void;
  updateQuantity: (productId: string, uomId: string, quantity: number) => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('maisonh_cart');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Map old structure to new structure if needed
        return parsed.map((item: any) => ({
          ...item,
          selectedUomId: item.selectedUomId || item.product.defaultUom || 'uom_piece'
        }));
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('maisonh_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product, quantity = 1, uomId?: string) => {
    const finalUomId = uomId || product.defaultUom || 'uom_piece';
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id && item.selectedUomId === finalUomId);
      if (existing) {
        return prev.map(item =>
          (item.product.id === product.id && item.selectedUomId === finalUomId)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, selectedUomId: finalUomId }];
    });
  };

  const removeFromCart = (productId: string, uomId: string) => {
    setCartItems(prev => prev.filter(item => !(item.product.id === productId && item.selectedUomId === uomId)));
  };

  const updateQuantity = (productId: string, uomId: string, quantity: number) => {
    setCartItems(prev =>
      prev.map(item =>
        (item.product.id === productId && item.selectedUomId === uomId)
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    );
  };

  const cartTotal = cartItems.reduce((total, item) => {
    const unitPrice = getPriceInUom(item.product.price, item.product.defaultUom || 'uom_piece', item.selectedUomId);
    return total + (unitPrice * item.quantity);
  }, 0);

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
