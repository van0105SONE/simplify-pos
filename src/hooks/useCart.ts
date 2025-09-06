// hooks/useCart.ts
import { useState, useCallback } from 'react';
import { CartItem, MenuItem, OrderEntity } from '@/types/pos';

export const useCart = () => {
  const [order, setOrder] = useState<OrderEntity>({
    id: "",
    serial: '',
    items: [],
    total: 0,
    tax: 0,
    subtotal: 0,
    table_id: 0,
    cash_recieve: 0,
    change: 0,
    payment_method: 'cash',
    status: 'pending',
    is_checkout: false,
    createdAt: new Date(),
    customerName: "",
    tableNumber: "",
    orderType: 'dine-in'
  });

  const updateCartItemCheckOut = useCallback((index: number, value: boolean) => {
    setOrder(prev => {
      const updatedItems = [...prev.items]; // Create new items array
      updatedItems[index] = {
        ...updatedItems[index], // Create new item object
        is_checkout: value,
      };

      return {
        ...prev,
        items: updatedItems,
      };
    });
  }, []);

  const addToCart = useCallback((menuItem: MenuItem, quantity: number = 1) => {
    setOrder(prev => {
      const existingIndex = prev.items.findIndex(item =>
        item.menuItem.id === menuItem.id
      );

      if (existingIndex >= 0) {
        const updatedItems = [...prev.items];
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: updatedItems[existingIndex].quantity + quantity,
        };
        return { ...prev, items: updatedItems };
      }

      const newCart: CartItem = {
        id: 0,
        price: menuItem.price,
        quantity: quantity,
        menuItem: menuItem,
        is_checkout: true,
      };
      return { ...prev, items: [...prev.items, newCart] };
    });
  }, []);

  const removeFromCart = useCallback((index: number) => {
    setOrder(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  }, []);

  const updateQuantity = useCallback((index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }

    setOrder(prev => {
      const updatedItems = [...prev.items]; // Create new items array
      updatedItems[index] = {
        ...updatedItems[index], // Create new item object
        quantity: quantity,
      };
      return {
        ...prev,
        items: updatedItems,
      };
    });
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setOrder(prev => ({
      ...prev,
      items: [],
    }));
  }, []);

  const cartTotal = order.items.reduce(
    (total, item) => total + (item.menuItem.price * item.quantity),
    0
  );

  const cartCount = order.items.reduce((count, item) => count + item.quantity, 0);

  return {
    order,
    setOrder,
    updateCartItemCheckOut,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartCount,
  };
};