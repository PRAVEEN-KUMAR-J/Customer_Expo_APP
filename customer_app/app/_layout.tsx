import 'react-native-url-polyfill/auto';
import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { OrderProvider } from '@/context/OrderContext';

export default function RootLayoutScreen() {
  useFrameworkReady();

  return (
    <AuthProvider>
      <CartProvider>
        <OrderProvider>
          <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="checkout" />
            <Stack.Screen name="tracking" />
            <Stack.Screen name="profile" />
          </Stack>
          <StatusBar style="auto" />
        </OrderProvider>
      </CartProvider>
    </AuthProvider>
  );
}
