import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { OrderProvider } from '@/context/OrderContext';

interface RootLayoutProps {
  children: React.ReactNode;
}

export function RootLayout({ children }: RootLayoutProps) {
  return (
    <AuthProvider>
      <CartProvider>
        <OrderProvider>
          {children}
          <StatusBar style="auto" />
        </OrderProvider>
      </CartProvider>
    </AuthProvider>
  );
}
