import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Home, ShoppingBag, ShoppingCart, Clock, Settings } from 'lucide-react-native';
import { useCart } from '@/context/CartContext';
import { CartBar } from '@/components/CartBar';

const TAB_BAR_HEIGHT = 64;

export default function TabsLayout() {
  const { getTotalItems, shouldShowCheckoutBar } = useCart();
  const cartItemCount = getTotalItems();

  return (
    <View style={styles.rootContainer}>
      <View style={styles.tabContentWrapper}>
        <Tabs
          initialRouteName="home"
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor: '#E41E26',
            tabBarInactiveTintColor: '#9CA3AF',
            tabBarStyle: {
              backgroundColor: 'transparent',
              borderTopWidth: 0,
              elevation: 0,
              height: TAB_BAR_HEIGHT,
              paddingBottom: 10,
              paddingTop: 10,
              position: 'absolute',
              display: route.name === 'cart' ? 'none' : 'flex',
              overflow: 'visible',
              width: Platform.OS === 'web' ? 600 : '100%',
              left: Platform.OS === 'web' ? '50%' : 0,
              transform: Platform.OS === 'web' ? [{ translateX: -300 }] : [],
            },
            tabBarLabelStyle: {
              fontSize: 11,
              fontWeight: '600',
              marginTop: 4,
            },
            tabBarBackground: () => (
              <View style={StyleSheet.absoluteFill}>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: '#FFFFFF',
                    borderTopLeftRadius: 28,
                    borderTopRightRadius: 28,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -3 },
                    shadowOpacity: 0.06,
                    shadowRadius: 12,
                    overflow: 'hidden',
                    borderTopWidth: 2,
                    borderLeftWidth: 1,
                    borderRightWidth: 1,
                    borderColor: 'rgba(234, 88, 12, 0.12)',
                  }}
                />
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: '10%',
                    right: '10%',
                    height: 3,
                    borderTopLeftRadius: 2,
                    borderTopRightRadius: 2,
                    backgroundColor: '#E41E26',
                  }}
                />
              </View>
            ),
          })}
        >
          <Tabs.Screen
            name="shops"
            options={{
              title: 'Shops',
              tabBarIcon: ({ color, size }) => <ShoppingBag size={24} color={color} />,
            }}
          />
          <Tabs.Screen
            name="cart"
            options={{
              title: 'Cart',
              tabBarIcon: ({ color, size }) => <ShoppingCart size={24} color={color} />,
              tabBarBadge: cartItemCount > 0 ? cartItemCount : undefined,
            }}
          />
          <Tabs.Screen
            name="home"
            options={{
              title: 'Home',
              tabBarLabel: () => null,
              tabBarIcon: ({ color, size }) => (
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
              tabBarItemStyle: { marginTop: -20 },
            }}
          />
          <Tabs.Screen
            name="orders"
            options={{
              title: 'Orders',
              tabBarIcon: ({ color, size }) => <Clock size={24} color={color} />,
            }}
          />
          <Tabs.Screen
            name="settings"
            options={{
              title: 'Settings',
              tabBarIcon: ({ color, size }) => <Settings size={24} color={color} />,
            }}
          />
        </Tabs>
        {cartItemCount > 0 && shouldShowCheckoutBar && <CartBar aboveTabBar />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centerHomeWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 56,
    height: 56,
  },
  centerHomeCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#E41E26',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  rootContainer: {
    flex: 1,
    backgroundColor: '#fefefe',
  },
  tabContentWrapper: {
    flex: 1,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 600 : '100%',
    alignSelf: 'center',
    position: 'relative',
  },
});
