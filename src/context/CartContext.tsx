import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, size: string, quantity?: number) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  changeItemSize: (cartItemId: string, newSize: string) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  totalItemCount: number;
  subtotal: number;
  tax: number;
  packagingFee: number;
  deliveryFee: number;
  discount: number;
  appliedCoupon: string | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  total: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'pour_shopping_cart';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
      return [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState<number>(0);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = (product: Product, size: string, quantity: number = 1) => {
    const sizeOption = product.bottleSizes.find((s) => s.size === size) || product.bottleSizes[0];
    const cartItemId = `${product.id}_${sizeOption.size}`;

    setItems((prevItems) => {
      const existing = prevItems.find((item) => item.cartItemId === cartItemId);
      if (existing) {
        return prevItems.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      const newItem: CartItem = {
        cartItemId,
        productId: product.id,
        product,
        selectedSize: sizeOption.size,
        price: sizeOption.price,
        volumeMl: sizeOption.volumeMl,
        quantity,
      };
      return [...prevItems, newItem];
    });

    // Auto open cart drawer on add
    setIsCartOpen(true);
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setItems((prevItems) => {
      return prevItems
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const changeItemSize = (cartItemId: string, newSize: string) => {
    setItems((prevItems) => {
      const itemToChange = prevItems.find((i) => i.cartItemId === cartItemId);
      if (!itemToChange) return prevItems;

      const newSizeOption = itemToChange.product.bottleSizes.find((s) => s.size === newSize);
      if (!newSizeOption) return prevItems;

      const newCartItemId = `${itemToChange.productId}_${newSizeOption.size}`;

      // Check if item with target size already exists in cart
      const existingTarget = prevItems.find((i) => i.cartItemId === newCartItemId);

      if (existingTarget && existingTarget.cartItemId !== cartItemId) {
        // Merge quantities and remove old size entry
        return prevItems
          .filter((i) => i.cartItemId !== cartItemId)
          .map((i) =>
            i.cartItemId === newCartItemId
              ? { ...i, quantity: i.quantity + itemToChange.quantity }
              : i
          );
      }

      // Transform in place
      return prevItems.map((i) =>
        i.cartItemId === cartItemId
          ? {
              ...i,
              cartItemId: newCartItemId,
              selectedSize: newSizeOption.size,
              price: newSizeOption.price,
              volumeMl: newSizeOption.volumeMl,
            }
          : i
      );
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
    setDiscountPercent(0);
  };

  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Simulated Excise duty & VAT
  const tax = Math.round(subtotal * 0.05);

  // Flat tamper-proof packaging fee
  const packagingFee = items.length > 0 ? 49 : 0;

  // Free delivery for orders >= ₹2000, else ₹60
  const deliveryFee = items.length === 0 ? 0 : subtotal >= 2000 ? 0 : 60;

  // Discount calculation
  const discount = Math.round((subtotal * discountPercent) / 100);

  const total = Math.max(0, subtotal + tax + packagingFee + deliveryFee - discount);

  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const formatted = code.trim().toUpperCase();
    if (formatted === 'POURFIRST' || formatted === 'POUR10') {
      setAppliedCoupon(formatted);
      setDiscountPercent(10);
      return { success: true, message: '🎉 Flat 10% Connoisseur discount applied!' };
    }
    if (formatted === 'LUXURY20') {
      if (subtotal >= 5000) {
        setAppliedCoupon(formatted);
        setDiscountPercent(20);
        return { success: true, message: '💎 Premium Reserve 20% discount applied!' };
      }
      return { success: false, message: 'Code LUXURY20 requires minimum order value of ₹5,000.' };
    }
    return { success: false, message: 'Invalid coupon code. Try POURFIRST or LUXURY20.' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscountPercent(0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        changeItemSize,
        removeFromCart,
        clearCart,
        totalItemCount,
        subtotal,
        tax,
        packagingFee,
        deliveryFee,
        discount,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        total,
        isCartOpen,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
