import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { dummyUsers, User, Address } from '@/data/users';
import { auth, signInWithPhoneNumber, ConfirmationResult } from '@/src/services/firebase';

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
  sendOtp: (phoneNumber: string) => Promise<boolean>;
  verifyOtp: (code: string) => Promise<boolean>;
  otpSent: boolean;
  resendOtp: () => Promise<void>;
  resetOtpSent: () => void;
  confirmationResult: ConfirmationResult | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<number>(0);
  const [wishlistProductIds, setWishlistProductIds] = useState<string[]>([]);
  const [otpSent, setOtpSent] = useState(false);
  const [tempPhoneNumber, setTempPhoneNumber] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  useEffect(() => {
    // Simulate checking for existing auth state
    const timer = setTimeout(() => {
      setIsLoading(false);
      // In a real app, you would check Firebase auth state here
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const sendOtp = async (phoneNumber: string): Promise<boolean> => {
    try {
      setIsLoading(true);

      // Native Firebase SDK — no RecaptchaVerifier needed.
      // Uses Android SafetyNet/Play Integrity for app verification.
      const result = await signInWithPhoneNumber(phoneNumber);

      setConfirmationResult(result);
      setTempPhoneNumber(phoneNumber);
      setOtpSent(true);
      return true;
    } catch (err: any) {
      console.error('OTP ERROR:', err.code, err.message);
      Alert.alert(
        'Failed to Send OTP',
        err.message || 'Please check your number and try again.'
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (code: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      console.log("Verifying code:", code);

      if (!confirmationResult) {
        throw new Error('No confirmation result found. Please request OTP again.');
      }

      // Verify OTP using Firebase Authentication
      const result = await confirmationResult.confirm(code);

      // Successfully signed in
      if (result?.user) {
        console.log('Login Success!', result.user.uid);
      }

      const foundUser = dummyUsers.find(u => u.phone === tempPhoneNumber) || {
        id: 'new-' + Date.now(),
        name: 'Demo User',
        phone: tempPhoneNumber,
        email: 'nimbasket.official@gmail.com',
        address: {
          street: '123 Demo St',
          city: 'Tiruvannamalai',
          pincode: '606601',
        }
      };
      setUser(foundUser);
      setAddresses(foundUser.address ? [foundUser.address] : []);
      setSelectedAddressIndex(0);
      setOtpSent(false);
      setConfirmationResult(null);
      return true;
    } catch (err: any) {
      console.log('Verification Error:', err);
      Alert.alert('Error', 'Invalid OTP. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    console.log('Resending OTP is handled by requesting a new OTP');
    setOtpSent(false);
  };

  const resetOtpSent = () => {
    setOtpSent(false);
    setConfirmationResult(null);
  };

  const login = async (phoneNumber: string): Promise<boolean> => {
    return false; // Deprecated directly from login
  };

  const logout = () => {
    setUser(null);
    setAddresses([]);
    setSelectedAddressIndex(-1);
    setWishlistProductIds([]);
    setOtpSent(false);
    setConfirmationResult(null);
  };

  const updateUser = (data: Partial<User>) => {
    setUser(prevUser => {
      if (!prevUser) return prevUser;

      const updated = {
        ...prevUser,
        ...data,
      };

      // Ensure address is preserved if it exists
      if (data.address) {
        updated.address = {
          ...(prevUser.address || { street: '', city: 'Tiruvannamalai', pincode: '606601' }),
          ...data.address
        };
      }

      return updated;
    });
  };

  // Keep user.address in sync when selection changes or addresses array updates
  useEffect(() => {
    if (!user) return;
    if (selectedAddressIndex < 0) return;
    const addr = addresses[selectedAddressIndex];
    if (!addr) return;

    // Only update if the address is actually different to avoid render loops
    if (JSON.stringify(user.address) !== JSON.stringify(addr)) {
      setUser(prev => (prev ? { ...prev, address: addr } : prev));
    }
  }, [selectedAddressIndex, addresses, user?.name, user?.email]); // Re-sync if user main info changes

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
        sendOtp,
        verifyOtp,
        otpSent,
        resendOtp,
        resetOtpSent,
        confirmationResult,
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
