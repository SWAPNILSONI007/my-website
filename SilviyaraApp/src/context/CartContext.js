import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem('cart').then(val => {
      if (val) setCart(JSON.parse(val));
    });
  }, []);

  const saveCart = (items) => {
    setCart(items);
    AsyncStorage.setItem('cart', JSON.stringify(items));
  };

  const addToCart = (product) => {
    const exists = cart.find(i => i._id === product._id);
    let updated;
    if (exists) {
      updated = cart.map(i =>
        i._id === product._id ? { ...i, qty: (i.qty || 1) + 1 } : i
      );
    } else {
      updated = [...cart, { ...product, qty: 1 }];
    }
    saveCart(updated);
  };

  const removeFromCart = (productId) => {
    saveCart(cart.filter(i => i._id !== productId));
  };

  const updateQty = (productId, qty) => {
    if (qty <= 0) return removeFromCart(productId);
    saveCart(cart.map(i => (i._id === productId ? { ...i, qty } : i)));
  };

  const clearCart = () => saveCart([]);

  const cartTotal = cart.reduce((sum, i) => sum + i.price * (i.qty || 1), 0);
  const cartCount = cart.reduce((sum, i) => sum + (i.qty || 1), 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQty, clearCart, cartTotal, cartCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
