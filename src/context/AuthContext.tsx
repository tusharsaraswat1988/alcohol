import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { INITIAL_USER } from '../data/mockUserData';

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  loginWithOtp: (mobile: string, otp: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'pour_user_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
      return INITIAL_USER; // Default VIP profile as agreed
    } catch {
      return INITIAL_USER;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const loginWithOtp = async (mobile: string, otp: string, name?: string): Promise<{ success: boolean; error?: string }> => {
    // Simulated network delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Mock OTP verification (123456 as requested in prompt)
    if (otp !== '123456') {
      return { success: false, error: 'Invalid OTP. Please enter 123456 for this demo.' };
    }

    const cleanMobile = mobile.startsWith('+91') ? mobile : `+91 ${mobile.trim()}`;
    const newUser: User = {
      id: user?.id || `usr-${Date.now()}`,
      name: name || user?.name || 'Valued Connoisseur',
      mobile: cleanMobile,
      email: user?.email || '',
      isAgeVerified: true,
      verifiedAt: new Date().toISOString(),
      wishlistIds: user?.wishlistIds || [],
    };

    setUser(newUser);
    setIsAuthModalOpen(false);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (data: Partial<User>) => {
    if (!user) return;
    setUser({ ...user, ...data });
  };

  const toggleWishlist = (productId: string) => {
    if (!user) {
      openAuthModal();
      return;
    }
    const exists = user.wishlistIds.includes(productId);
    const newWishlist = exists
      ? user.wishlistIds.filter((id) => id !== productId)
      : [...user.wishlistIds, productId];

    setUser({ ...user, wishlistIds: newWishlist });
  };

  const isWishlisted = (productId: string) => {
    return !!user?.wishlistIds.includes(productId);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        loginWithOtp,
        logout,
        updateProfile,
        toggleWishlist,
        isWishlisted,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
