import React, { createContext, useContext, useState, useEffect } from 'react';
import { dummyUsers, User } from '../data/users';

type Address = User['address'];

interface AuthContextType {
  user: User | null;
  login: (phoneNumber: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  addresses: Address[];
  selectedAddressIndex: number;
  selectAddress: (index: number) => void;
  wishlistProductIds: string[];
  toggleWishlist: (productId: string) => void;
  addAddress: (address: Address) => void;
  updateAddress: (index: number, address: Address) => void;
  deleteAddress: (index: number) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<number>(-1);
  const [wishlistProductIds, setWishlistProductIds] = useState<string[]>([]);

  useEffect(() => {
    // Auto-login for demo purposes
    const autoLogin = async () => {
      setIsLoading(true);
      // Simulate loading time
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Auto login with first dummy user
      const initialUser = dummyUsers[0];
      setUser(initialUser);
      if (initialUser.address) {
        setAddresses([initialUser.address]);
        setSelectedAddressIndex(0);
      } else {
        setSelectedAddressIndex(-1);
      }
      setIsLoading(false);
    };
    
    autoLogin();
  }, []);

  const login = async (phoneNumber: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Find user by phone number or use first dummy user
    const foundUser = dummyUsers.find(u => u.phone === phoneNumber) || dummyUsers[0];
    setUser(foundUser);
    if (foundUser.address) {
      setAddresses([foundUser.address]);
      setSelectedAddressIndex(0);
    } else {
      setAddresses([]);
      setSelectedAddressIndex(-1);
    }
    setIsLoading(false);
    
    return true; // Always successful for demo
  };

  const logout = () => {
    setUser(null);
    setAddresses([]);
    setSelectedAddressIndex(-1);
    setWishlistProductIds([]);
  };

  const updateUser = (data: Partial<User>) => {
    setUser(prevUser => {
      if (!prevUser) return prevUser;

      return {
        ...prevUser,
        ...data,
        address: data.address ? { ...prevUser.address, ...data.address } : prevUser.address,
      };
    });
  };

  // Keep user.address in sync when selection changes or addresses array updates
  useEffect(() => {
    if (!user) return;
    if (selectedAddressIndex < 0) return;
    const addr = addresses[selectedAddressIndex];
    if (!addr) return;
    setUser(prev => (prev ? { ...prev, address: addr } : prev));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAddressIndex, addresses]);

  const addAddress = (address: Address) => {
    setAddresses(prev => {
      const next = [...prev, address];
      setSelectedAddressIndex(next.length - 1);
      return next;
    });
    // Make the newly added address the active one on the user
    setUser(prevUser => (prevUser ? { ...prevUser, address } : prevUser));
  };

  const updateAddress = (index: number, address: Address) => {
    setAddresses(prev => {
      const next = [...prev];
      if (index >= 0 && index < next.length) {
        next[index] = address;
      }
      return next;
    });
    // Also reflect latest edited address on the user for delivery (when editing the selected address)
    setUser(prevUser => {
      if (!prevUser) return prevUser;
      if (index === selectedAddressIndex) return { ...prevUser, address };
      return prevUser;
    });
  };

  const selectAddress = (index: number) => {
    setSelectedAddressIndex(index);
    setUser(prevUser => {
      if (!prevUser) return prevUser;
      const addr = addresses[index];
      if (!addr) return prevUser;
      return { ...prevUser, address: addr };
    });
  };

  const deleteAddress = (index: number) => {
    setAddresses(prev => {
      const next = prev.filter((_, i) => i !== index);
      // Update selected index + selected address
      setSelectedAddressIndex(prevSelected => {
        if (next.length === 0) return -1;
        if (prevSelected === index) return 0;
        if (prevSelected > index) return prevSelected - 1;
        return prevSelected;
      });

      setUser(prevUser => {
        if (!prevUser) return prevUser;
        if (next.length === 0) return { ...prevUser };

        const nextSelected =
          selectedAddressIndex === index
            ? 0
            : selectedAddressIndex > index
              ? selectedAddressIndex - 1
              : selectedAddressIndex;

        const addr = next[nextSelected] ?? next[0];
        return { ...prevUser, address: addr };
      });
      return next;
    });
  };

  const toggleWishlist = (productId: string) => {
    setWishlistProductIds(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      }
      return [productId, ...prev];
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        updateUser,
        addresses,
        selectedAddressIndex,
        selectAddress,
        wishlistProductIds,
        toggleWishlist,
        addAddress,
        updateAddress,
        deleteAddress,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};