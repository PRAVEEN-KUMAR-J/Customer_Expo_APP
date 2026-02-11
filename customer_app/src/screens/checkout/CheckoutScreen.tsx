import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, CreditCard, DollarSign } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../../context/CartContext';
import { useOrder } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';
import { dummyShops } from '../../data/shops';

export const CheckoutScreen: React.FC = () => {
  const navigation = useNavigation();
  const { items, getTotalPrice, clearCart } = useCart();
  const { placeOrder } = useOrder();
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'razorpay'>('razorpay');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const subtotal = getTotalPrice();
  const deliveryFee = subtotal > 500 ? 0 : 25;
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + deliveryFee + tax;

  // Get the shop from first item (assuming all items from same shop)
  const shopId = items[0]?.product.shopId;
  const shop = dummyShops.find(s => s.id === shopId);

  const handlePlaceOrder = async () => {
    if (!shop) {
      Alert.alert('Error', 'Shop information not found');
      return;
    }

    setIsPlacingOrder(true);
    try {
      const orderId = await placeOrder(items, shop, paymentMethod);
      clearCart();
      Alert.alert(
        'Order Placed!',
        `Your order #${orderId} has been placed successfully.`,
        [
          {
            text: 'Track Order',
            onPress: () => navigation.navigate('OrderTracking' as never, { orderId } as never),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to place order. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Delivery Address */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MapPin size={20} color="#22C55E" />
            <Text style={styles.sectionTitle}>Delivery Address</Text>
          </View>
          <View style={styles.addressContainer}>
            <Text style={styles.addressText}>
              {user?.address.street}
            </Text>
            <Text style={styles.addressSubText}>
              {user?.address.city}, {user?.address.pincode}
            </Text>
          </View>
        </View>

        {/* Order Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          {items.map((item) => (
            <View key={item.product.id} style={styles.orderItem}>
              <Text style={styles.itemName} numberOfLines={1}>
                {item.product.name}
              </Text>
              <View style={styles.itemDetails}>
                <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
                <Text style={styles.itemPrice}>₹{item.product.price * item.quantity}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          
          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'razorpay' && styles.selectedPaymentOption
            ]}
            onPress={() => setPaymentMethod('razorpay')}
          >
            <CreditCard size={20} color={paymentMethod === 'razorpay' ? '#22C55E' : '#6B7280'} />
            <Text style={[
              styles.paymentOptionText,
              paymentMethod === 'razorpay' && styles.selectedPaymentText
            ]}>
              Pay Online (Razorpay)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'cash' && styles.selectedPaymentOption
            ]}
            onPress={() => setPaymentMethod('cash')}
          >
            <DollarSign size={20} color={paymentMethod === 'cash' ? '#22C55E' : '#6B7280'} />
            <Text style={[
              styles.paymentOptionText,
              paymentMethod === 'cash' && styles.selectedPaymentText
            ]}>
              Cash on Delivery
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bill Summary */}
      <View style={styles.footer}>
        <View style={styles.billContainer}>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Subtotal</Text>
            <Text style={styles.billValue}>₹{subtotal}</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Delivery Fee</Text>
            <Text style={[styles.billValue, deliveryFee === 0 && styles.freeText]}>
              {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
            </Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Tax</Text>
            <Text style={styles.billValue}>₹{tax}</Text>
          </View>
          <View style={[styles.billRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹{total}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.placeOrderButton, isPlacingOrder && styles.disabledButton]} 
          onPress={handlePlaceOrder}
          disabled={isPlacingOrder}
        >
          {isPlacingOrder ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.placeOrderButtonText}>Place Order</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
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
  addressContainer: {
    paddingLeft: 28,
  },
  addressText: {
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 4,
  },
  addressSubText: {
    fontSize: 14,
    color: '#6B7280',
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  itemName: {
    fontSize: 16,
    color: '#1F2937',
    flex: 1,
    marginRight: 12,
  },
  itemDetails: {
    alignItems: 'flex-end',
  },
  itemQuantity: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    marginBottom: 12,
  },
  selectedPaymentOption: {
    borderColor: '#22C55E',
    backgroundColor: '#F0FDF4',
  },
  paymentOptionText: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 12,
  },
  selectedPaymentText: {
    color: '#1F2937',
    fontWeight: '500',
  },
  footer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  billContainer: {
    marginBottom: 16,
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
  freeText: {
    color: '#22C55E',
    fontWeight: '600',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  placeOrderButton: {
    backgroundColor: '#22C55E',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  placeOrderButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});