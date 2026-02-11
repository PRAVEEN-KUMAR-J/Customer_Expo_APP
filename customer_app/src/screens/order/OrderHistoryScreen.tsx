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
import { Clock, ArrowRight, RotateCcw } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useOrder } from '../../context/OrderContext';
import { useCart } from '../../context/CartContext';
import { dummyProducts } from '../../data/products';

export const OrderHistoryScreen: React.FC = () => {
  const navigation = useNavigation();
  const { orders } = useOrder();
  const { addToCart } = useCart();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return '#22C55E';
      case 'out_for_delivery':
        return '#3B82F6';
      case 'packed':
        return '#F59E0B';
      case 'confirmed':
        return '#8B5CF6';
      default:
        return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'Delivered';
      case 'out_for_delivery':
        return 'Out for Delivery';
      case 'packed':
        return 'Packed';
      case 'confirmed':
        return 'Confirmed';
      default:
        return 'Unknown';
    }
  };

  const handleOrderPress = (orderId: string) => {
    navigation.navigate('OrderTracking' as never, { orderId } as never);
  };

  const handleReorder = (order: any) => {
    order.items.forEach((item: any) => {
      const product = dummyProducts.find(p => p.id === item.productId);
      if (product) {
        addToCart(product, item.quantity);
      }
    });
    
    // Navigate to cart
    navigation.navigate('Cart' as never);
  };

  if (orders.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Clock size={64} color="#E5E7EB" />
          <Text style={styles.emptyStateTitle}>No orders yet</Text>
          <Text style={styles.emptyStateText}>Your order history will appear here</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Order History</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {orders.map((order) => (
          <TouchableOpacity 
            key={order.id} 
            style={styles.orderCard}
            onPress={() => handleOrderPress(order.id)}
          >
            <View style={styles.orderHeader}>
              <View style={styles.orderInfo}>
                <Text style={styles.orderId}>#{order.id}</Text>
                <Text style={styles.shopName}>{order.shopName}</Text>
                <Text style={styles.orderDate}>
                  {order.orderDate.toLocaleDateString()}
                </Text>
              </View>
              
              <View style={styles.orderStatus}>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(order.status) }
                ]}>
                  <Text style={styles.statusText}>
                    {getStatusText(order.status)}
                  </Text>
                </View>
                <Text style={styles.orderTotal}>₹{order.total}</Text>
              </View>
            </View>

            <View style={styles.orderItems}>
              {order.items.slice(0, 3).map((item, index) => (
                <View key={item.productId} style={styles.orderItem}>
                  <Image 
                    source={{ uri: item.productImage }} 
                    style={styles.itemImage}
                  />
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName} numberOfLines={1}>
                      {item.productName}
                    </Text>
                    <Text style={styles.itemQuantity}>
                      Qty: {item.quantity}
                    </Text>
                  </View>
                </View>
              ))}
              {order.items.length > 3 && (
                <Text style={styles.moreItems}>
                  +{order.items.length - 3} more items
                </Text>
              )}
            </View>

            <View style={styles.orderActions}>
              <TouchableOpacity 
                style={styles.reorderButton}
                onPress={(e) => {
                  e.stopPropagation();
                  handleReorder(order);
                }}
              >
                <RotateCcw size={16} color="#22C55E" />
                <Text style={styles.reorderButtonText}>Reorder</Text>
              </TouchableOpacity>
              
              <View style={styles.viewDetailsButton}>
                <Text style={styles.viewDetailsText}>View Details</Text>
                <ArrowRight size={16} color="#6B7280" />
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  shopName: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  orderDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  orderStatus: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  orderItems: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
    marginBottom: 12,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  itemQuantity: {
    fontSize: 12,
    color: '#6B7280',
  },
  moreItems: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
    marginTop: 4,
  },
  orderActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  reorderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  reorderButtonText: {
    fontSize: 14,
    color: '#22C55E',
    fontWeight: '500',
    marginLeft: 6,
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewDetailsText: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 6,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});