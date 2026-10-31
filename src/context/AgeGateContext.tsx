import React, { createContext, useContext, useState, useEffect } from 'react';

interface AgeGateContextType {
  isVerified: boolean;
  selectedState: string;
  verifyAge: (stateName: string) => void;
  resetAgeVerification: () => void;
}

const AgeGateContext = createContext<AgeGateContextType | undefined>(undefined);

const AGE_GATE_KEY = 'pour_age_verified';
const STATE_KEY = 'pour_user_state';

export const AgeGateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isVerified, setIsVerified] = useState<boolean>(() => {
    try {
      return localStorage.getItem(AGE_GATE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [selectedState, setSelectedState] = useState<string>(() => {
    try {
      return localStorage.getItem(STATE_KEY) || 'Karnataka';
    } catch {
      return 'Karnataka';
    }
  });

  useEffect(() => {
    localStorage.setItem(AGE_GATE_KEY, String(isVerified));
    localStorage.setItem(STATE_KEY, selectedState);
  }, [isVerified, selectedState]);

  const verifyAge = (stateName: string) => {
    setSelectedState(stateName);
    setIsVerified(true);
  };

  const resetAgeVerification = () => {
    setIsVerified(false);
    localStorage.removeItem(AGE_GATE_KEY);
  };

  return (
    <AgeGateContext.Provider
      value={{
        isVerified,
        selectedState,
        verifyAge,
        resetAgeVerification,
      }}
    >
      {children}
    </AgeGateContext.Provider>
  );
};

export const useAgeGate = () => {
  const context = useContext(AgeGateContext);
  if (!context) {
    throw new Error('useAgeGate must be used within an AgeGateProvider');
  }
  return context;
};
