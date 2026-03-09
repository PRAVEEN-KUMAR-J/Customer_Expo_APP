import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Modal,
  Animated,
  Easing,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useOrder } from '@/context/OrderContext';
import { dummyShops } from '@/data/shops';

type PaymentMethod = 'qr' | 'upi' | 'card' | 'cash';

export const PaymentScreen: React.FC = () => {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCart();
  const { user, addresses } = useAuth();
  const { placeOrder } = useOrder();

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('qr');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm'>('gpay');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successOrderId, setSuccessOrderId] = useState<string | null>(null);
  const successScale = useRef(new Animated.Value(0.8)).current;
  const successOpacity = useRef(new Animated.Value(0)).current;

  const subtotal = getTotalPrice();
  const deliveryFee = subtotal > 500 ? 0 : 49;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + tax;

  const activeAddress = useMemo(
    () => user?.address ?? addresses[0],
    [addresses, user?.address],
  );

  const shopId = items[0]?.product.shopId;
  const shop = dummyShops.find((s) => s.id === shopId);
  const deliveryPulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(deliveryPulse, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(deliveryPulse, {
          toValue: 0,
          duration: 800,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [deliveryPulse]);

  const runSuccessAnimation = (orderId: string) => {
    setSuccessOrderId(orderId);
    setShowSuccess(true);
    successScale.setValue(0.8);
    successOpacity.setValue(0);

    Animated.parallel([
      Animated.timing(successOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.spring(successScale, {
        toValue: 1,
        useNativeDriver: true,
        friction: 6,
        tension: 120,
      }),
    ]).start();

    setTimeout(() => {
      setShowSuccess(false);
      router.replace({
        pathname: '/order/tracking',
        params: { orderId, fromPayment: 'true' },
      });
    }, 1200);
  };

  const handlePlaceOrder = async () => {
    if (!shop || items.length === 0) {
      return;
    }

    if (!activeAddress) {
      Alert.alert('Add address', 'Please add a delivery address before placing the order.');
      return;
    }

     // Basic validation depending on method
     if (selectedMethod === 'card') {
       if (!cardNumber.trim() || cardNumber.trim().length < 12) {
         Alert.alert('Card details', 'Please enter a valid card number.');
         return;
       }
       if (!cardName.trim()) {
         Alert.alert('Card details', 'Please enter name on card.');
         return;
       }
       if (!cardExpiry.trim()) {
         Alert.alert('Card details', 'Please enter expiry (MM/YY).');
         return;
       }
       if (!cardCvv.trim() || cardCvv.trim().length < 3) {
         Alert.alert('Card details', 'Please enter CVV.');
         return;
       }
     }

    const paymentForOrder =
      selectedMethod === 'cash' ? 'cash' : 'razorpay' as const;

    setIsPlacingOrder(true);
    try {
      const orderId = await placeOrder(items, shop, paymentForOrder, {
        street: activeAddress.street,
        city: activeAddress.city,
        pincode: activeAddress.pincode,
      });
      clearCart();
      runSuccessAnimation(orderId);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
        >
          <ArrowLeft size={22} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={styles.headerSpacer} />
      </View>

      <Animated.View
        style={[
          styles.deliveryBanner,
          {
            opacity: deliveryPulse.interpolate({
              inputRange: [0, 1],
              outputRange: [0.7, 1],
            }),
            transform: [
              {
                scale: deliveryPulse.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.97, 1.03],
                }),
              },
            ],
          },
        ]}
      >
        <Text style={styles.deliveryBannerText}>30 minutes delivery</Text>
      </Animated.View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Delivering to address */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardHeaderLabel}>DELIVERING TO HOME</Text>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: '/profile/addresses',
                  params: { returnTo: 'Payment' },
                })
              }
              style={styles.changeBtn}
            >
              <Text style={styles.changeBtnText}>Change</Text>
            </TouchableOpacity>
          </View>
          {activeAddress ? (
            <Text style={styles.addressText} numberOfLines={2}>
              {activeAddress.street}, {activeAddress.city} -{' '}
              {activeAddress.pincode}
            </Text>
          ) : (
            <Text style={styles.addressTextMuted}>
              Add an address for delivery
            </Text>
          )}
        </View>

        {/* Shop & items */}
        {shop && (
          <View style={styles.card}>
            <Text style={styles.shopName}>{shop.name}</Text>
            <Text style={styles.shopSub}>Delivery in {shop.deliveryTime}</Text>
          </View>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>ITEMS IN CART</Text>
        </View>

        <View style={styles.card}>
          {items.map((item) => (
            <View key={item.product.id} style={styles.itemRow}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.product.name}</Text>
                <Text style={styles.itemUnit}>{item.product.unit}</Text>
              </View>
              <View style={styles.itemControls}>
                <View style={styles.qtyPill}>
                  <Text style={styles.qtyText}>-  {item.quantity}  +</Text>
                </View>
                <Text style={styles.itemPrice}>
                  ₹{item.product.price * item.quantity}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Bill details */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>BILL DETAILS</Text>
        </View>
        <View style={styles.card}>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Item Total</Text>
            <Text style={styles.billValue}>₹{subtotal}</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Delivery Partner Fee</Text>
            <Text style={styles.billValue}>₹{deliveryFee}</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Taxes & Charges</Text>
            <Text style={styles.billValue}>₹{tax}</Text>
          </View>
          <View style={styles.toPayRow}>
            <Text style={styles.toPayLabel}>To Pay</Text>
            <Text style={styles.toPayValue}>₹{total}</Text>
          </View>
        </View>

        {/* Payment method */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>PAYMENT METHOD</Text>
        </View>

        {/* QR option */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setSelectedMethod('qr')}
          style={[
            styles.qrCard,
            selectedMethod === 'qr' && styles.qrCardSelected,
          ]}
        >
          <Text style={styles.qrTitle}>Scan QR & Pay</Text>
          <Text style={styles.qrSubtitle}>
            Total amount to scan: ₹{total}
          </Text>
          {selectedMethod === 'qr' && (
            <View style={styles.qrWrapper}>
              <QRCode
                value={`upi://pay?pa=store@upi&pn=CustomerExpo&am=${total}&cu=INR`}
                size={140}
                backgroundColor="#FFFFFF"
                color="#000000"
              />
            </View>
          )}
          <Text style={styles.qrHelper}>
            Open your UPI app (GPay, PhonePe, Paytm) and scan to complete
            payment.
          </Text>
        </TouchableOpacity>

        {/* Other methods list */}
        <View style={styles.methodList}>
          <TouchableOpacity
            style={styles.methodRow}
            onPress={() => setSelectedMethod('upi')}
          >
            <Text style={styles.methodLabel}>UPI / Mobile Wallet</Text>
            <View
              style={[
                styles.radioOuter,
                selectedMethod === 'upi' && styles.radioOuterActive,
              ]}
            >
              {selectedMethod === 'upi' && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.methodRow}
            onPress={() => setSelectedMethod('card')}
          >
            <Text style={styles.methodLabel}>Credit / Debit Card</Text>
            <View
              style={[
                styles.radioOuter,
                selectedMethod === 'card' && styles.radioOuterActive,
              ]}
            >
              {selectedMethod === 'card' && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.methodRow}
            onPress={() => setSelectedMethod('cash')}
          >
            <Text style={styles.methodLabel}>Cash on Delivery</Text>
            <View
              style={[
                styles.radioOuter,
                selectedMethod === 'cash' && styles.radioOuterActive,
              ]}
            >
              {selectedMethod === 'cash' && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>
        </View>

        {/* UPI app choices */}
        {selectedMethod === 'upi' && (
          <View style={styles.upiAppsRow}>
            {[
              {
                id: 'gpay' as const,
                label: 'GPay',
                logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Google_Pay_%28GPay%29_Logo.svg/512px-Google_Pay_%28GPay%29_Logo.svg.png',
              },
              {
                id: 'phonepe' as const,
                label: 'PhonePe',
                logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/PhonePe-Logo.png/512px-PhonePe-Logo.png',
              },
              {
                id: 'paytm' as const,
                label: 'Paytm',
                logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Paytm_Logo_%28standalone%29_-_Blue.svg/512px-Paytm_Logo_%28standalone%29_-_Blue.svg.png',
              },
            ].map((app) => (
              <TouchableOpacity
                key={app.id}
                style={[
                  styles.upiChip,
                  selectedUpiApp === app.id && styles.upiChipSelected,
                ]}
                activeOpacity={0.8}
                onPress={() => setSelectedUpiApp(app.id)}
              >
                <View style={styles.upiLogoWrapper}>
                  <Image
                    source={{ uri: app.logo }}
                    style={styles.upiLogoImage}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.upiChipText}>{app.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Card details form */}
        {selectedMethod === 'card' && (
          <View style={[styles.card, styles.cardForm]}>
            <Text style={styles.formLabel}>Card Number</Text>
            <TextInput
              value={cardNumber}
              onChangeText={setCardNumber}
              placeholder="**** **** **** 1234"
              keyboardType="number-pad"
              style={styles.formInput}
              placeholderTextColor="#9CA3AF"
            />

            <Text style={styles.formLabel}>Name on Card</Text>
            <TextInput
              value={cardName}
              onChangeText={setCardName}
              placeholder="Full name"
              style={styles.formInput}
              placeholderTextColor="#9CA3AF"
            />

            <View style={styles.formRow}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.formLabel}>Expiry</Text>
                <TextInput
                  value={cardExpiry}
                  onChangeText={setCardExpiry}
                  placeholder="MM/YY"
                  style={styles.formInput}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.formLabel}>CVV</Text>
                <TextInput
                  value={cardCvv}
                  onChangeText={setCardCvv}
                  placeholder="***"
                  style={styles.formInput}
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry
                  keyboardType="number-pad"
                />
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.payButton}
          onPress={handlePlaceOrder}
          disabled={isPlacingOrder || items.length === 0}
        >
          {isPlacingOrder ? (
            <ActivityIndicator color="#22C55E" />
          ) : (
            <Text style={styles.payButtonText}>Proceed to Pay ₹{total}</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Payment success animation overlay */}
      <Modal visible={showSuccess} transparent animationType="fade">
        <View style={styles.successOverlay}>
          <Animated.View
            style={[
              styles.successCard,
              { transform: [{ scale: successScale }], opacity: successOpacity },
            ]}
          >
            <View style={styles.successIconCircle}>
              <Text style={styles.successIconCheck}>✓</Text>
            </View>
            <Text style={styles.successTitle}>Payment Confirmed</Text>
            <Text style={styles.successSubtitle}>
              Your order {successOrderId ? `#${successOrderId}` : ''} has been placed.
            </Text>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  headerSpacer: {
    width: 36,
  },
  deliveryBanner: {
    alignSelf: 'center',
    marginTop: 4,
    marginBottom: 4,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#DCFCE7',
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
  },
  deliveryBannerText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#15803D',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardHeaderLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
  },
  changeBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#FEF3C7',
  },
  changeBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400E',
  },
  addressText: {
    fontSize: 14,
    color: '#111827',
  },
  addressTextMuted: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  shopName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  shopSub: {
    marginTop: 4,
    fontSize: 13,
    color: '#16A34A',
  },
  sectionHeader: {
    marginTop: 8,
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  itemInfo: {
    flex: 1,
    paddingRight: 12,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  itemUnit: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  itemControls: {
    alignItems: 'flex-end',
  },
  qtyPill: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#D1FAE5',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 4,
  },
  qtyText: {
    fontSize: 13,
    color: '#16A34A',
    fontWeight: '600',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  billLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  billValue: {
    fontSize: 13,
    color: '#111827',
    fontWeight: '500',
  },
  toPayRow: {
    marginTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  toPayLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  toPayValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  qrCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  qrCardSelected: {
    borderColor: '#FB7185',
    shadowColor: '#FB7185',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  qrTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#BE123C',
  },
  qrSubtitle: {
    marginTop: 6,
    fontSize: 13,
    color: '#BE123C',
  },
  qrWrapper: {
    marginTop: 16,
    alignSelf: 'center',
    padding: 12,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  qrHelper: {
    marginTop: 8,
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  methodList: {
    marginTop: 12,
  },
  methodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 8,
  },
  methodLabel: {
    fontSize: 14,
    color: '#111827',
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterActive: {
    borderColor: '#FB7185',
  },
  radioInner: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#FB7185',
  },
  upiAppsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  upiChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    marginRight: 6,
  },
  upiChipSelected: {
    backgroundColor: '#FEF2F2',
  },
  upiLogoWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 8,
    backgroundColor: '#F9FAFB',
  },
  upiLogoImage: {
    width: '100%',
    height: '100%',
  },
  upiChipText: {
    fontSize: 13,
    color: '#111827',
    fontWeight: '500',
  },
  cardForm: {
    marginTop: 8,
  },
  formLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
    marginTop: 4,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    color: '#111827',
  },
  formRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  bottomBar: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  payButton: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#22C55E',
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#22C55E',
  },
  successOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successCard: {
    width: '78%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  successIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#BBF7D0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  successIconCheck: {
    fontSize: 30,
    color: '#15803D',
    fontWeight: '800',
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  successSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
  },
});


