import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { RequestItem, Equipment } from '../types';
import { useSound } from '../hooks/useSound';

interface CartContextType {
  cart: RequestItem[];
  addToCart: (equipment: Equipment, quantity: number) => void;
  removeFromCart: (equipmentId: string) => void;
  updateQuantity: (equipmentId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<RequestItem[]>([]);
  const playSound = useSound();

  // Load from localstorage just in case they refresh
  useEffect(() => {
    const storedCart = localStorage.getItem('taksin_cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('taksin_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (equipment: Equipment, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.equipmentId === equipment.id);
      if (existing) {
        const maxAllowed = equipment.availableUnits;
        const newQuantity = Math.min(existing.quantity + quantity, maxAllowed);
        return prev.map(item => 
          item.equipmentId === equipment.id 
            ? { ...item, quantity: newQuantity }
            : item
        );
      }
      return [...prev, { equipmentId: equipment.id, quantity, equipment }];
    });
    playSound('click');
  };

  const removeFromCart = (equipmentId: string) => {
    setCart(prev => prev.filter(item => item.equipmentId !== equipmentId));
    playSound('click');
  };

  const updateQuantity = (equipmentId: string, quantity: number) => {
    setCart(prev => prev.map(item => {
      if (item.equipmentId === equipmentId) {
         // validate against available units
         const maxAllowed = item.equipment.availableUnits;
         const newQuantity = Math.max(1, Math.min(quantity, maxAllowed));
         return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCart([]);
  };

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, itemCount }}>
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
