import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Hop as Home, ShoppingBag, ShoppingCart, Clock, User } from 'lucide-react-native';
import { HomeScreen } from '../screens/home/HomeScreen';
import { ShopListScreen } from '../screens/shop/ShopListScreen';
import { CartScreen } from '../screens/cart/CartScreen';
import { OrderHistoryScreen } from '../screens/order/OrderHistoryScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { useCart } from '../context/CartContext';

const Tab = createBottomTabNavigator();

export const BottomTabs: React.FC = () => {
  const { getTotalItems } = useCart();
  const cartItemCount = getTotalItems();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#22C55E',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          paddingVertical: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Shops"
        component={ShopListScreen}
        options={{
          tabBarIcon: ({ color, size }) => <ShoppingBag size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarIcon: ({ color, size }) => <ShoppingCart size={size} color={color} />,
          tabBarBadge: cartItemCount > 0 ? cartItemCount : undefined,
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrderHistoryScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Clock size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};