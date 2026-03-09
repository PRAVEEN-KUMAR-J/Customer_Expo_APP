import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useCart } from '@/context/CartContext';
import { Compact } from '@/ui/compact';

const TAB_BAR_HEIGHT = 60;

interface CartBarProps {
  /** When true, bar sits above tab bar (e.g. when Main/tabs is visible) */
  aboveTabBar?: boolean;
}

export const CartBar: React.FC<CartBarProps> = ({ aboveTabBar = false }) => {
  const router = useRouter();
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
    router.push('/(tabs)/cart');
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
          style={styles.checkoutBtnWrapper}
          onPress={handleCheckout}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#FB923C', '#F97316', '#F23A2C', '#E41E26']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.checkoutBtn}
          >
            <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={handleClearCart}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Trash2 size={Compact.icon.lg} color="#F87171" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cartBar: {
    position: 'absolute',
    left: Compact.space.xl,
    right: Compact.space.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Compact.space.xl,
    paddingVertical: Compact.space.md,
    borderRadius: Compact.radius.xl,
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
    fontSize: Compact.font.sm,
    color: '#6B7280',
  },
  cartBarPrice: {
    fontSize: Compact.font.xxxl,
    fontWeight: '700',
    color: '#111827',
  },
  cartBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Compact.space.md,
  },
  checkoutBtnWrapper: {
    borderRadius: Compact.radius.md,
    overflow: 'hidden',
  },
  checkoutBtn: {
    paddingHorizontal: Compact.space.xxl,
    paddingVertical: Compact.space.md,
    borderRadius: Compact.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtn: {
    padding: Compact.space.sm,
  },
  checkoutBtnText: {
    color: '#FFFFFF',
    fontSize: Compact.font.lg,
    fontWeight: '600',
  },
});

