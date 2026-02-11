import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Clock } from 'lucide-react-native';
import { OrderStatusStepper } from '../../components/OrderStatusStepper';
import { useOrder } from '../../context/OrderContext';

interface OrderTrackingScreenProps {
  route: {
    params: {
      orderId: string;
    };
  };
}

export const OrderTrackingScreen: React.FC<OrderTrackingScreenProps> = ({ route }) => {
  const { orderId } = route.params;
  const { getOrderById, startOrderTracking } = useOrder();
  const [order, setOrder] = useState(getOrderById(orderId));

  useEffect(() => {
    if (order) {
      startOrderTracking(orderId);
      
      // Update local order state when order changes
      const interval = setInterval(() => {
        const updatedOrder = getOrderById(orderId);
        setOrder(updatedOrder);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [orderId, order?.status]);

  if (!order) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>Order not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const getStatusMessage = () => {
    switch (order.status) {
      case 'confirmed':
        return 'Your order has been confirmed and is being prepared';
      case 'packed':
        return 'Your order has been packed and ready for pickup';
      case 'out_for_delivery':
        return 'Your order is out for delivery';
      case 'delivered':
        return 'Your order has been delivered successfully!';
      default:
        return 'Tracking your order...';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Order Header */}
        <View style={styles.header}>
          <Text style={styles.orderTitle}>Order #{order.id}</Text>
          <Text style={styles.shopName}>from {order.shopName}</Text>
          <Text style={styles.orderDate}>
            Placed on {order.orderDate.toLocaleDateString()} at {order.orderDate.toLocaleTimeString()}
          </Text>
        </View>

        {/* Status Stepper */}
        <View style={styles.statusSection}>
          <OrderStatusStepper currentStatus={order.status} />
          <Text style={styles.statusMessage}>{getStatusMessage()}</Text>
        </View>

        {/* Delivery Info */}
        {order.status === 'out_for_delivery' && order.tracking && (
          <View style={styles.deliverySection}>
            <View style={styles.sectionHeader}>
              <MapPin size={20} color="#22C55E" />
              <Text style={styles.sectionTitle}>Delivery Information</Text>
            </View>
            <Text style={styles.deliveryText}>
              Your delivery partner is on the way
            </Text>
            <View style={styles.etaContainer}>
              <Clock size={16} color="#6B7280" />
              <Text style={styles.etaText}>ETA: {order.tracking.eta}</Text>
            </View>
          </View>
        )}

        {/* Delivery Address */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MapPin size={20} color="#22C55E" />
            <Text style={styles.sectionTitle}>Delivery Address</Text>
          </View>
          <Text style={styles.addressText}>
            {order.deliveryAddress.street}
          </Text>
          <Text style={styles.addressSubText}>
            {order.deliveryAddress.city}, {order.deliveryAddress.pincode}
          </Text>
        </View>

        {/* Order Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          {order.items.map((item) => (
            <View key={item.productId} style={styles.orderItem}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.productName}</Text>
                <Text style={styles.itemDetails}>
                  {item.quantity} × ₹{item.price} ({item.unit})
                </Text>
              </View>
              <Text style={styles.itemTotal}>₹{item.quantity * item.price}</Text>
            </View>
          ))}
        </View>

        {/* Bill Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bill Summary</Text>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Subtotal</Text>
            <Text style={styles.billValue}>₹{order.subtotal}</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Delivery Fee</Text>
            <Text style={styles.billValue}>₹{order.deliveryFee}</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Tax</Text>
            <Text style={styles.billValue}>₹{order.tax}</Text>
          </View>
          <View style={[styles.billRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Paid</Text>
            <Text style={styles.totalValue}>₹{order.total}</Text>
          </View>
          <Text style={styles.paymentMethod}>
            Payment: {order.paymentMethod === 'cash' ? 'Cash on Delivery' : 'Paid Online'}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  shopName: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  statusSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusMessage: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  deliverySection: {
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
  section: {
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  deliveryText: {
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 8,
    paddingLeft: 28,
  },
  etaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 28,
  },
  etaText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
    fontWeight: '500',
  },
  addressText: {
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 4,
    paddingLeft: 28,
  },
  addressSubText: {
    fontSize: 14,
    color: '#6B7280',
    paddingLeft: 28,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  itemInfo: {
    flex: 1,
    marginRight: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  itemDetails: {
    fontSize: 14,
    color: '#6B7280',
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  billLabel: {
    fontSize: 16,
    color: '#6B7280',
  },
  billValue: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#22C55E',
  },
  paymentMethod: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
  },
});