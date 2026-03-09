import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ShoppingCart, Trash2, Store } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useCart } from '@/context/CartContext';
import { dummyShops } from '@/data/shops';
import { Compact } from '@/ui/compact';
import { LinearGradient } from 'expo-linear-gradient';

export const CartScreen: React.FC = () => {
  const router = useRouter();
  const { items, updateQuantity, removeFromCart, clearCart, getTotalPrice } = useCart();

  const groupedData = useMemo(() => {
    const map = new Map<string, { shop: typeof dummyShops[0] | undefined; items: typeof items }>();
    items.forEach((item) => {
      const sId = item.product.shopId;
      if (!map.has(sId)) {
        map.set(sId, { shop: dummyShops.find((s) => s.id === sId), items: [] });
      }
      map.get(sId)!.items.push(item);
    });
    return Array.from(map.values());
  }, [items]);

  const subtotal = getTotalPrice();
  const shopCount = groupedData.length;
  // Let's assume a delivery fee of 20 per unique shop for accurate UI
  const deliveryFee = subtotal > 0 ? shopCount * 20 : 0;
  const total = subtotal + deliveryFee;

  const handleCheckout = () => {
    if (items.length === 0) {
      Alert.alert('Cart Empty', 'Add some items to your cart first');
      return;
    }
    router.push('/checkout');
  };

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: clearCart },
      ]
    );
  };

  const handleBackPress = () => {
    router.replace('/(tabs)/home');
  };

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <ShoppingCart size={Compact.icon.xxl} color="#E5E7EB" />
          <Text style={styles.emptyStateTitle}>Your cart is empty</Text>
          <Text style={styles.emptyStateText}>Add some groceries to get started</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBackPress}
          style={styles.backButton}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <View style={styles.headerTextWrap}>
          <Text style={styles.headerTitle}>Your Cart</Text>
          <Text style={styles.headerSubTitle}>NIMBASKET PREMIUM</Text>
        </View>
        <TouchableOpacity onPress={handleClearCart} style={styles.clearButton}>
          <Trash2 size={22} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.cartItems} showsVerticalScrollIndicator={false}>
        {groupedData.map((group, gIndex) => (
          <View key={group.shop?.id || gIndex}>
            {/* Shop Header */}
            <View style={styles.shopHeader}>
              <View style={styles.shopIconBg}>
                <Store size={18} color="#EF4444" />
              </View>
              <Text style={styles.shopName}>{group.shop?.name || 'Local Store'}</Text>
              <View style={styles.shopCountBadge}>
                <Text style={styles.shopCountBadgeText}>
                  {group.items.length} {group.items.length === 1 ? 'Item' : 'Items'}
                </Text>
              </View>
            </View>

            {/* Items List */}
            <View style={styles.shopItemGroup}>
              {group.items.map((cartItem) => {
                const { product, quantity } = cartItem;
                return (
                  <View key={product.id} style={styles.itemRow}>
                    <Image source={{ uri: product.image }} style={styles.itemImageRound} />
                    <View style={styles.itemDetails}>
                      <Text style={styles.itemNameText}>{product.name}</Text>
                      <Text style={styles.itemUnitText}>
                        {product.unit} • ₹{product.price}
                      </Text>

                      <View style={styles.stepperWrapper}>
                        <TouchableOpacity
                          style={styles.stepperAction}
                          onPress={() => updateQuantity(product.id, quantity - 1)}
                        >
                          <Text style={styles.stepperActionText}>−</Text>
                        </TouchableOpacity>
                        <Text style={styles.stepperValText}>{quantity}</Text>
                        <TouchableOpacity
                          style={styles.stepperAction}
                          onPress={() => updateQuantity(product.id, quantity + 1)}
                        >
                          <Text style={styles.stepperActionText}>+</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <Text style={styles.itemRowTotalText}>
                      ₹{(product.price * quantity).toFixed(2)}
                    </Text>
                  </View>
                );
              })}
            </View>

            {/* Dashed Separator between shops if not last */}
            {gIndex !== groupedData.length - 1 && <View style={styles.dashedSeparator} />}
          </View>
        ))}
        {/* Extra padding to prevent cutting off at the bottom sheet */}
        <View style={{ height: 180 }} />
      </ScrollView>

      {/* Floating Bottom Sheet Summary */}
      <View style={styles.floatingBottomSheet}>
        <View style={styles.billRow}>
          <Text style={styles.billLabel}>Subtotal</Text>
          <Text style={styles.billValue}>₹{subtotal.toFixed(2)}</Text>
        </View>
        <View style={[styles.billRow, { marginBottom: 16 }]}>
          <Text style={styles.billLabel}>Delivery Fees ({shopCount} {shopCount === 1 ? 'shop' : 'shops'})</Text>
          <Text style={styles.billValue}>₹{deliveryFee.toFixed(2)}</Text>
        </View>

        <View style={[styles.billRow, { marginBottom: 20 }]}>
          <Text style={styles.grandTotalLabel}>Grand Total</Text>
          <Text style={styles.grandTotalValue}>₹{total.toFixed(2)}</Text>
        </View>

        <TouchableOpacity onPress={handleCheckout} activeOpacity={0.9}>
          <LinearGradient
            colors={['#E21E26', '#FF5B14', '#F97316']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.gradientCheckoutBtn}
          >
            <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
            <Text style={styles.checkoutBtnIcon}>›</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    padding: 4,
  },
  headerTextWrap: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  headerSubTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#EF4444',
    letterSpacing: 1,
    marginTop: 2,
  },
  clearButton: {
    padding: 4,
  },
  cartItems: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  // Shop Header
  shopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  shopIconBg: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  shopName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
    flex: 1,
  },
  shopCountBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  shopCountBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6B7280',
  },
  // Items
  shopItemGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemImageRound: {
    width: 60,
    height: 60,
    borderRadius: 30, // Fully round
    backgroundColor: '#F3F4F6',
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  itemNameText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 2,
  },
  itemUnitText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 6,
  },
  stepperWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  stepperAction: {
    paddingHorizontal: 6,
  },
  stepperActionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    lineHeight: 18,
  },
  stepperValText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
    marginHorizontal: 10,
  },
  itemRowTotalText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
    alignSelf: 'flex-end',
    marginBottom: 4, // Align roughly with stepper level
  },
  dashedSeparator: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    borderStyle: 'dashed',
    marginBottom: 16,
  },
  // Floating Bottom Sheet Summary
  floatingBottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20, // Padding for safe area/bottom
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 20,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  billLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  billValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: '900',
    color: '#111827',
  },
  grandTotalValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#EF4444', // As per spec red tone
  },
  gradientCheckoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 20,
  },
  checkoutBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    marginRight: 4,
  },
  checkoutBtnIcon: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 22,
  },
  // empty state fallback...
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 15,
    color: '#6B7280',
  },
});

