import React from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { NimBasketSplash } from '@/screens/SplashScreen';
import LoginScreen from './login';

export default function Index() {
  const { user, isLoading } = useAuth();

  // Show branded splash while app is initialising
  if (isLoading) return <NimBasketSplash />;

  // If user is not logged in, show login screen
  if (!user) return <LoginScreen />;

  // If user is logged in, redirect to home
  return <Redirect href="/(tabs)/home" />;
}
