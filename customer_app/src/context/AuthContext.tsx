import React, { createContext, useContext, useState, useEffect } from 'react';
import { dummyUsers, User } from '../data/users';

interface AuthContextType {
  user: User | null;
  login: (phoneNumber: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Auto-login for demo purposes
    const autoLogin = async () => {
      setIsLoading(true);
      // Simulate loading time
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Auto login with first dummy user
      setUser(dummyUsers[0]);
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
    setIsLoading(false);
    
    return true; // Always successful for demo
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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