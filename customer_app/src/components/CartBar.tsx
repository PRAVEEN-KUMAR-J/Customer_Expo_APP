import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { useCart } from '../context/CartContext';
import { navigateToCheckout } from '../navigation/rootNavigationRef';

const TAB_BAR_HEIGHT = 60;

interface CartBarProps {
  /** When true, bar sits above tab bar (e.g. when Main/tabs is visible) */
  aboveTabBar?: boolean;
}

export const CartBar: React.FC<CartBarProps> = ({ aboveTabBar = false }) => {
  const { getTotalPrice, clearCart } = useCart();
  const subtotal = getTotalPrice();
  const deliveryFee = subtotal > 500 ? 0 : 25;
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + deliveryFee + tax;

  const handleClearCart = () => {
    Alert.alert(
      'Clear cart',
      'Remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: clearCart },
      ]
    );
  };

  const handleCheckout = () => {
    navigateToCheckout();
  };

  return (
    <View
      style={[
        styles.cartBar,
        {
          bottom: aboveTabBar ? TAB_BAR_HEIGHT + 12 : 12,
        },
      ]}
    >
      <View style={styles.cartBarLeft}>
        <Text style={styles.cartBarLabel}>Total</Text>
        <Text style={styles.cartBarPrice}>₹{total}</Text>
      </View>
      <View style={styles.cartBarRight}>
        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={handleCheckout}
          activeOpacity={0.8}
        >
          <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={handleClearCart}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Trash2 size={22} color="#F87171" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cartBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderWidth: 1,
    borderColor: 'rgba(209,213,219,0.9)',
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 10,
  },
  cartBarLeft: {
    flexDirection: 'column',
  },
  cartBarLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  cartBarPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  cartBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkoutBtn: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  deleteBtn: {
    padding: 8,
  },
  checkoutBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
