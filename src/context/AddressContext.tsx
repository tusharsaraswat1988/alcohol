import React, { createContext, useContext, useState, useEffect } from 'react';
import { Address } from '../types';
import { INITIAL_ADDRESSES } from '../data/mockUserData';

interface AddressContextType {
  addresses: Address[];
  selectedAddress: Address | null;
  addAddress: (addressData: Omit<Address, 'id'>) => Address;
  updateAddress: (id: string, updated: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  selectAddress: (id: string) => void;
}

const AddressContext = createContext<AddressContextType | undefined>(undefined);

const ADDRESS_STORAGE_KEY = 'pour_saved_addresses';

export const AddressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [addresses, setAddresses] = useState<Address[]>(() => {
    try {
      const saved = localStorage.getItem(ADDRESS_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
      return INITIAL_ADDRESSES;
    } catch {
      return INITIAL_ADDRESSES;
    }
  });

  const [selectedAddressId, setSelectedAddressId] = useState<string>(() => {
    const def = addresses.find((a) => a.isDefault);
    return def ? def.id : addresses[0]?.id || '';
  });

  useEffect(() => {
    localStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(addresses));
  }, [addresses]);

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) || addresses[0] || null;

  const addAddress = (addressData: Omit<Address, 'id'>): Address => {
    const newAddress: Address = {
      ...addressData,
      id: `addr-${Date.now()}`,
    };

    if (newAddress.isDefault || addresses.length === 0) {
      setAddresses((prev) => [
        newAddress,
        ...prev.map((a) => ({ ...a, isDefault: false })),
      ]);
    } else {
      setAddresses((prev) => [...prev, newAddress]);
    }

    setSelectedAddressId(newAddress.id);
    return newAddress;
  };

  const updateAddress = (id: string, updated: Partial<Address>) => {
    setAddresses((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          return { ...a, ...updated };
        }
        if (updated.isDefault) {
          return { ...a, isDefault: false };
        }
        return a;
      })
    );
  };

  const deleteAddress = (id: string) => {
    setAddresses((prev) => {
      const remaining = prev.filter((a) => a.id !== id);
      if (remaining.length > 0 && !remaining.some((a) => a.isDefault)) {
        remaining[0].isDefault = true;
      }
      return remaining;
    });

    if (selectedAddressId === id) {
      const next = addresses.find((a) => a.id !== id);
      if (next) setSelectedAddressId(next.id);
    }
  };

  const setDefaultAddress = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
  };

  const selectAddress = (id: string) => {
    setSelectedAddressId(id);
  };

  return (
    <AddressContext.Provider
      value={{
        addresses,
        selectedAddress,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        selectAddress,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
};

export const useAddress = () => {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error('useAddress must be used within an AddressProvider');
  }
  return context;
};
