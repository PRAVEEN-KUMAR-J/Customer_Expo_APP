import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, ShoppingCart, ChevronDown, ChevronUp, Plus, Minus } from 'lucide-react-native';
import { useCart } from '../../context/CartContext';
import { dummyShops } from '../../data/shops';
import { CartItem as CartItemType } from '../../context/CartContext';

export const CheckoutScreen: React.FC = () => {
  const navigation = useNavigation();
  const { items, updateQuantity, getTotalPrice, getTotalItems } = useCart();
  const [expandedShops, setExpandedShops] = useState<Record<string, boolean>>({});

  const subtotal = getTotalPrice();
  const deliveryFee = subtotal > 500 ? 0 : 25;
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + deliveryFee + tax;
  const cartItemCount = getTotalItems();

  const groupedByShop = useMemo(() => {
    const map: Record<string, CartItemType[]> = {};
    items.forEach((item) => {
      const sid = item.product.shopId;
      if (!map[sid]) map[sid] = [];
      map[sid].push(item);
    });
    return map;
  }, [items]);

  const shopIds = useMemo(() => Object.keys(groupedByShop), [groupedByShop]);

  useEffect(() => {
    const initial: Record<string, boolean> = {};
    shopIds.forEach((id) => (initial[id] = true));
    setExpandedShops((prev) => ({ ...initial, ...prev }));
  }, [shopIds.join(',')]);

  const toggleShop = (shopId: string) => {
    setExpandedShops((prev) => ({ ...prev, [shopId]: !prev[shopId] }));
  };

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
            <ArrowLeft size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cart</Text>
          <View style={styles.headerRight}>
            <View style={styles.cartBadge}>
              <ShoppingCart size={22} color="#111827" />
              {cartItemCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cartItemCount}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Your cart is empty</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cart</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Cart' as never)}
          style={styles.headerRight}
        >
          <View style={styles.cartBadge}>
            <ShoppingCart size={22} color="#111827" />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartItemCount}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Scrollable Cart by Shop */}
      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContentInner}
      >
        {shopIds.map((shopId) => {
          const shop = dummyShops.find((s) => s.id === shopId);
          const shopItems = groupedByShop[shopId] ?? [];
          const isExpanded = expandedShops[shopId] !== false;

          return (
            <View key={shopId} style={styles.shopCard}>
              {/* Shop Header */}
              <TouchableOpacity
                style={styles.shopHeader}
                onPress={() => toggleShop(shopId)}
                activeOpacity={0.8}
              >
                <Image source={{ uri: shop?.image }} style={styles.shopLogo} />
                <View style={styles.shopHeaderCenter}>
                  <Text style={styles.shopName}>{shop?.name ?? 'Shop'}</Text>
                  <Text style={styles.deliveryText}>
                    Delivery in {shop?.deliveryTime ?? '15 min'}
                  </Text>
                </View>
                {isExpanded ? (
                  <ChevronUp size={22} color="#6B7280" />
                ) : (
                  <ChevronDown size={22} color="#6B7280" />
                )}
              </TouchableOpacity>

              {/* Products */}
              {isExpanded &&
                shopItems.map((item) => (
                  <View key={item.product.id} style={styles.productRow}>
                    <View style={styles.productLeft}>
                      <Image source={{ uri: item.product.image }} style={styles.productImage} />
                      <View style={styles.productInfo}>
                        <Text style={styles.productName} numberOfLines={2}>
                          {item.product.name}
                        </Text>
                        <Text style={styles.productUnit}>{item.product.unit}</Text>
                        <Text style={styles.productPrice}>₹{item.product.price * item.quantity}</Text>
                        <View style={styles.replaceRow}>
                          <Text style={styles.replaceText}>Replace with</Text>
                          <Text style={styles.replaceShop}> {shop?.name}</Text>
                          <Text style={styles.replaceArrow}> ›</Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.quantityOval}>
                      <TouchableOpacity
                        onPress={() => updateQuantity(item.product.id, item.quantity - 1)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <Minus size={16} color="#22C55E" />
                      </TouchableOpacity>
                      <Text style={styles.quantityNum}>{item.quantity}</Text>
                      <TouchableOpacity
                        onPress={() => updateQuantity(item.product.id, item.quantity + 1)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <Plus size={16} color="#22C55E" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
            </View>
          );
        })}
      </ScrollView>

      {/* Sticky Proceed to Checkout Button */}
      <View style={styles.stickyFooter}>
        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={() => navigation.navigate('Payment' as never)}
          activeOpacity={0.9}
        >
          <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  headerRight: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadge: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -8,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentInner: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  shopCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  shopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  shopLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E5E7EB',
  },
  shopHeaderCenter: {
    flex: 1,
    marginLeft: 12,
  },
  shopName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  deliveryText: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#F9FAFB',
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 12,
  },
  productLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  productImage: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  productUnit: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginTop: 4,
  },
  replaceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  replaceText: {
    fontSize: 12,
    color: '#6B7280',
  },
  replaceShop: {
    fontSize: 12,
    color: '#111827',
    fontWeight: '600',
  },
  replaceArrow: {
    fontSize: 12,
    color: '#6B7280',
  },
  quantityOval: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginLeft: 12,
  },
  quantityNum: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginHorizontal: 14,
  },
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  checkoutBtn: {
    backgroundColor: '#86EFAC',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  checkoutBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#166534',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#6B7280',
  },
});
