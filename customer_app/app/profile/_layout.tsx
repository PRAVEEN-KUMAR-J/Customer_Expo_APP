import React from 'react';
import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="details" />
      <Stack.Screen name="addresses" />
      <Stack.Screen name="address-map" />
      <Stack.Screen name="address-details" />
      <Stack.Screen name="help" />
      <Stack.Screen name="wishlist" />
    </Stack>
  );
}
