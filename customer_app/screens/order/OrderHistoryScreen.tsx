import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, Filter, AlignJustify, Clock } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useOrder } from '@/context/OrderContext';
import { useCart } from '@/context/CartContext';
import { Platform } from 'react-native';
import { dummyProducts } from '@/data/products';
import { Compact } from '@/ui/compact';

export const OrderHistoryScreen: React.FC = () => {
  const router = useRouter();
  const { orders } = useOrder();
  const { addToCart } = useCart();

  const greetingByHour = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning ☀️';
    if (h < 17) return 'Good afternoon 🌤️';
    if (h < 21) return 'Good evening 🌙';
    return 'Good night 😴';
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'delivered':
        return { bg: '#F0FDF4', text: '#166534', label: 'DELIVERED' };
      case 'cancelled':
        return { bg: '#FEF2F2', text: '#991B1B', label: 'CANCELLED' };
      case 'out_for_delivery':
        return { bg: '#EFF6FF', text: '#1E40AF', label: 'OUT FOR DELIVERY' };
      default:
        return { bg: '#F9FAFB', text: '#4B5563', label: status.toUpperCase() };
    }
  };

  const handleOrderPress = (orderId: string) => {
    router.push({ pathname: '/tracking', params: { orderId } });
  };

  const handleReorder = (order: any) => {
    order.items.forEach((item: any) => {
      const product = dummyProducts.find(p => p.id === item.productId);
      if (product) {
        addToCart(product, item.quantity);
      }
    });

    // Navigate to cart
    router.push('/(tabs)/cart');
  };

  if (orders.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Clock size={Compact.icon.xxl} color="#E5E7EB" />
          <Text style={styles.emptyStateTitle}>No orders yet</Text>
          <Text style={styles.emptyStateText}>Your order history will appear here</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentWrapper}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greetingText}>{greetingByHour()}</Text>
            <Text style={styles.headerTitle}>Recent Orders</Text>
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>Filter</Text>
            <Filter size={16} color="#F97316" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {orders.map((order) => {
            const statusStyle = getStatusStyle(order.status);
            return (
              <TouchableOpacity
                key={order.id}
                style={styles.orderCard}
                onPress={() => handleOrderPress(order.id)}
                activeOpacity={0.9}
              >
                <View style={styles.cardTopRow}>
                  <Text style={styles.orderIdLabel}>Order #{order.id}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                    <Text style={[styles.statusText, { color: statusStyle.text }]}>
                      {statusStyle.label}
                    </Text>
                  </View>
                </View>

                <Text style={styles.orderDateTime}>
                  {order.orderDate.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}, {order.orderDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>

                <View style={styles.itemsSection}>
                  <View style={styles.avatarStack}>
                    {order.items.slice(0, 3).map((item, idx) => (
                      <View
                        key={`img-${idx}`}
                        style={[styles.stackedAvatar, { marginLeft: idx === 0 ? 0 : -15 }]}
                      >
                        <Image source={{ uri: item.productImage }} style={styles.avatarImage} />
                        {idx === 2 && order.items.length > 3 && (
                          <View style={styles.avatarOverlay}>
                            <Text style={styles.moreCount}>+{order.items.length - 3}</Text>
                          </View>
                        )}
                      </View>
                    ))}
                  </View>

                  <View style={styles.orderSummary}>
                    <Text style={styles.summaryText} numberOfLines={2}>
                      {order.items.map((i) => i.productName).join(', ')}
                      {order.items.length > 2 ? ` +${order.items.length - 2} more` : ''}
                    </Text>
                  </View>

                  <Text style={styles.totalPrice}>₹{order.total}</Text>
                </View>

                <View style={styles.cardFooter}>
                  <TouchableOpacity
                    style={styles.viewDetailsRow}
                    onPress={() => handleOrderPress(order.id)}
                  >
                    <Text style={styles.viewDetailsText}>View Details</Text>
                    <ChevronRight size={16} color="#6B7280" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      handleReorder(order);
                    }}
                  >
                    <LinearGradient
                      colors={['#E21E26', '#F55A1A', '#F77E2D']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.reorderBtn}
                    >
                      <AlignJustify size={16} color="#FFF" style={{ marginRight: 8 }} />
                      <Text style={styles.reorderBtnText}>Reorder</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  contentWrapper: {
    flex: 1,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 600 : '100%',
    alignSelf: 'center',
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  greetingText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F97316',
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  filterText: {
    fontSize: 14,
    color: '#F97316',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderIdLabel: {
    fontSize: 12,
    color: '#111827',
    fontWeight: '900',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  orderDateTime: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 8,
  },
  itemsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAF9',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 16,
  },
  avatarStack: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 40,
  },
  stackedAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreCount: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  orderSummary: {
    flex: 1,
    paddingHorizontal: 8,
  },
  summaryText: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '500',
    lineHeight: 14,
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: '900',
    color: '#111827',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewDetailsText: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '600',
  },
  reorderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  reorderBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});

