import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { Home, ShoppingBag, ShoppingCart, Clock, Settings } from 'lucide-react-native';
import { HomeScreen } from '../screens/home/HomeScreen';
import { ShopListScreen } from '../screens/shop/ShopListScreen';
import { CheckoutScreen } from '../screens/checkout/CheckoutScreen';
import { OrderHistoryScreen } from '../screens/order/OrderHistoryScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { useCart } from '@/context/CartContext';
import { CartBar } from '@/components/CartBar';

const Tab = createBottomTabNavigator();

const TAB_BAR_HEIGHT = 64;

export const BottomTabs: React.FC = () => {
  const { getTotalItems, shouldShowCheckoutBar } = useCart();
  const cartItemCount = getTotalItems();

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: '#374151',
          tabBarInactiveTintColor: '#6B7280',
          tabBarStyle: {
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            elevation: 0,
            height: TAB_BAR_HEIGHT,
            paddingBottom: 8,
            paddingTop: 8,
            position: 'absolute',
            display: route.name === 'Cart' ? 'none' : 'flex',
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '500',
            marginTop: 4,
          },
          tabBarBackground: () => (
            <View style={StyleSheet.absoluteFill}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: '#FFFFFF',
                  borderTopLeftRadius: 24,
                  borderTopRightRadius: 24,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: -2 },
                  shadowOpacity: 0.08,
                  shadowRadius: 6,
                  overflow: 'hidden',
                }}
              />
              {/* Thin orange line along top border */}
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  borderTopLeftRadius: 24,
                  borderTopRightRadius: 24,
                  backgroundColor: '#E41E26',
                }}
              />
            </View>
          ),
          headerShown: false,
        })}
      >
        <Tab.Screen
          name="Shops"
          component={ShopListScreen}
          options={{
            tabBarIcon: ({ color, size }) => <ShoppingBag size={24} color={color} />,
          }}
        />
        <Tab.Screen
          name="Cart"
          component={CheckoutScreen}
          options={{
            tabBarIcon: ({ color, size }) => <ShoppingCart size={24} color={color} />,
            tabBarBadge: cartItemCount > 0 ? cartItemCount : undefined,
          }}
        />
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: () => (
              <View style={styles.centerHomeWrapper}>
                <LinearGradient
                  colors={['#FB923C', '#F97316', '#F23A2C', '#E41E26']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.centerHomeCircle}
                >
                  <Home size={24} color="#FFFFFF" />
                </LinearGradient>
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Orders"
          component={OrderHistoryScreen}
          options={{
            tabBarIcon: ({ color, size }) => <Clock size={24} color={color} />,
          }}
        />
        <Tab.Screen
          name="Settings"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ color, size }) => <Settings size={24} color={color} />,
          }}
        />
      </Tab.Navigator>

      {cartItemCount > 0 && shouldShowCheckoutBar && <CartBar aboveTabBar />}
    </View>
  );
};

const styles = StyleSheet.create({
  centerHomeWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -20,
  },
  centerHomeCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#E41E26',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});
