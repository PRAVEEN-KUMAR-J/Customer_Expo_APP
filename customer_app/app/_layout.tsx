import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider } from '@/src/context/AuthContext';
import { CartProvider } from '@/src/context/CartContext';
import { OrderProvider } from '@/src/context/OrderContext';
import { AppNavigator } from '@/src/navigation/AppNavigator';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <AuthProvider>
      <CartProvider>
        <OrderProvider>
          <AppNavigator />
          <StatusBar style="auto" />
        </OrderProvider>
      </CartProvider>
    </AuthProvider>
  );
}