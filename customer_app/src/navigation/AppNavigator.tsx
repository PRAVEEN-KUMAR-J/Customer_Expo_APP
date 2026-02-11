import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { BottomTabs } from './BottomTabs';
import { ProductListScreen } from '../screens/shop/ProductListScreen';
import { CheckoutScreen } from '../screens/checkout/CheckoutScreen';
import { OrderTrackingScreen } from '../screens/order/OrderTrackingScreen';

const Stack = createStackNavigator();

export const AppNavigator: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null; // You could show a loading screen here
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        <>
          <Stack.Screen name="Main" component={BottomTabs} />
          <Stack.Screen 
            name="ProductList" 
            component={ProductListScreen} 
            options={{ headerShown: true, title: 'Products' }}
          />
          <Stack.Screen 
            name="Checkout" 
            component={CheckoutScreen} 
            options={{ headerShown: true, title: 'Checkout' }}
          />
          <Stack.Screen 
            name="OrderTracking" 
            component={OrderTrackingScreen} 
            options={{ headerShown: true, title: 'Track Order' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};