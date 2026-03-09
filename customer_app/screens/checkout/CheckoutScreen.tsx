import React, { useEffect, useMemo, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  Animated,
  Dimensions,
  ActivityIndicator,
  PanResponder,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  MapPin,
  Ticket,
  CreditCard,
  Zap,
  Circle,
  Plus,
  Minus,
  ArrowRight,
  Wallet,
  Check,
  X
} from 'lucide-react-native';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useOrder } from '@/context/OrderContext';
import { dummyShops } from '@/data/shops';
import { Address } from '@/data/users';
import { LinearGradient } from 'expo-linear-gradient';
const { width, height } = Dimensions.get('window');

export const CheckoutScreen: React.FC = () => {
  const router = useRouter();
  const { items, updateQuantity, getTotalPrice, clearCart } = useCart();
  const { user, addAddress, updateUser, addresses, selectedAddressIndex } = useAuth();
  const { placeOrder: placeRealOrder } = useOrder();

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'razorpay'>('razorpay');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Form State
  const [formAddress, setFormAddress] = useState({
    street: '',
    city: '',
    pincode: '',
    type: 'Home' as 'Home' | 'Work' | 'Other'
  });

  const successScale = useRef(new Animated.Value(0)).current;

  // Swipe animation states
  const SWIPE_WIDTH = width - 32; // Full width minus padding
  const KNOB_WIDTH = 56;
  const slideMax = SWIPE_WIDTH - KNOB_WIDTH;
  const swipeAnim = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        if (isPlacingOrder || items.length === 0) return;
        let newValue = gesture.dx;
        if (newValue < 0) newValue = 0;
        if (newValue > slideMax) newValue = slideMax;
        swipeAnim.setValue(newValue);
      },
      onPanResponderRelease: (_, gesture) => {
        if (isPlacingOrder || items.length === 0) return;
        if (gesture.dx > slideMax * 0.75) {
          // Trigger checkout
          Animated.spring(swipeAnim, {
            toValue: slideMax,
            useNativeDriver: false,
            bounciness: 0,
          }).start(() => {
            handlePlaceOrder();
          });
        } else {
          // Snap back
          Animated.spring(swipeAnim, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  // Interpolations for swipe coloring
  const textOpacity = swipeAnim.interpolate({
    inputRange: [0, slideMax / 2],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  const backgroundWidth = swipeAnim.interpolate({
    inputRange: [0, slideMax],
    outputRange: [KNOB_WIDTH, SWIPE_WIDTH],
    extrapolate: 'clamp',
  });

  const subtotal = getTotalPrice();
  const deliveryFee = 0;
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + deliveryFee + tax;

  const shop = dummyShops[0];
  const currentAddress = addresses[selectedAddressIndex] || null;

  const handlePlaceOrder = async () => {
    if (!currentAddress) return;
    setIsPlacingOrder(true);

    // Simulate minor delay
    setTimeout(async () => {
      const orderId = await placeRealOrder(items, shop, paymentMethod === 'cod' ? 'cash' : 'razorpay', currentAddress);
      clearCart();
      setIsPlacingOrder(false);
      setShowSuccess(true);

      Animated.spring(successScale, {
        toValue: 1,
        useNativeDriver: true,
        friction: 4
      }).start();

      setTimeout(() => {
        router.push({
          pathname: '/tracking',
          params: { orderId, totalPrice: String(total), noAutoRedirect: 'true' }
        });
      }, 2000);
    }, 1500);
  };

  const saveAddress = () => {
    const newAddr: Address = {
      ...formAddress,
      location: { latitude: 19.0760, longitude: 72.8777 }
    };
    addAddress(newAddr);
    setShowAddressModal(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <ArrowLeft size={20} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContentInner}>
        <View style={styles.arrivingBanner}>
          <View style={styles.zapIconContainer}><Zap size={20} color="#FFF" fill="#FFF" /></View>
          <View style={styles.arrivingTextContainer}>
            <Text style={styles.arrivingLabel}>ARRIVING IN 25-30 MINS</Text>
            <Text style={styles.arrivingSubtext}>Fast delivery from {shop.name}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitleSmall}>Your Cart</Text>
        {items.map(item => (
          <View key={item.product.id} style={styles.cartItemCard}>
            <Image source={{ uri: item.product.image }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.product.name}</Text>
              <Text style={styles.itemUnit}>{item.product.unit} • ₹{item.product.price}</Text>
              <Text style={styles.itemPriceText}>₹{item.product.price * item.quantity}</Text>
            </View>
            <View style={styles.quantityContainer}>
              <TouchableOpacity onPress={() => updateQuantity(item.product.id, item.quantity - 1)} style={styles.qtyBtn}>
                <Minus size={14} color="#F97316" />
              </TouchableOpacity>
              <Text style={styles.qtyNum}>{item.quantity}</Text>
              <TouchableOpacity onPress={() => updateQuantity(item.product.id, item.quantity + 1)} style={styles.qtyBtn}>
                <Plus size={14} color="#F97316" />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <Text style={styles.sectionTitleSmall}>Delivery Address</Text>
        <View style={styles.addressCard}>
          {currentAddress ? (
            <View style={styles.addressRow}>
              <MapPin size={20} color="#F97316" />
              <View style={styles.addressTextContainer}>
                <View style={styles.nameRow}>
                  <Text style={styles.userName}>{user?.name}</Text>
                  <TouchableOpacity onPress={() => setShowAddressModal(true)}><Text style={styles.editText}>EDIT</Text></TouchableOpacity>
                </View>
                <Text style={styles.addressText}>{currentAddress.street}, {currentAddress.city} - {currentAddress.pincode}</Text>
              </View>
            </View>
          ) : (
            <TouchableOpacity style={styles.addAddressBtn} onPress={() => setShowAddressModal(true)}>
              <Plus size={18} color="#F97316" />
              <Text style={styles.addAddressText}>Add New Address</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.paymentCard}>
          <TouchableOpacity style={styles.paymentOption} onPress={() => setPaymentMethod('cod')}>
            <View style={styles.paymentLeft}>
              <Wallet size={18} color="#6B7280" />
              <Text style={styles.paymentOptionText}>Cash on Delivery</Text>
            </View>
            <Circle size={18} color={paymentMethod === 'cod' ? '#F97316' : '#E5E7EB'} fill={paymentMethod === 'cod' ? '#F97316' : 'transparent'} />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.paymentOption} onPress={() => setPaymentMethod('razorpay')}>
            <View style={styles.paymentLeft}>
              <CreditCard size={18} color="#6B7280" />
              <Text style={styles.paymentOptionText}>Razorpay (Cards/UPI)</Text>
            </View>
            <Circle size={18} color={paymentMethod === 'razorpay' ? '#F97316' : '#E5E7EB'} fill={paymentMethod === 'razorpay' ? '#F97316' : 'transparent'} />
          </TouchableOpacity>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>ORDER SUMMARY</Text>
          <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Subtotal</Text><Text style={styles.summaryValue}>₹{subtotal}</Text></View>
          <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Tax (10%)</Text><Text style={styles.summaryValue}>₹{tax}</Text></View>
          <View style={styles.grandTotalDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.grandTotalLabel}>Grand Total</Text>
            <Text style={styles.grandTotalValue}>₹{total}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={[styles.swipeContainer, (items.length === 0 || isPlacingOrder) && { opacity: 0.5 }]}>
          <Text style={styles.swipePlaceholderText}>Swipe to Place Order</Text>
          <Animated.View style={[styles.swipeBg, { width: backgroundWidth }]} />
          <Animated.View
            {...panResponder.panHandlers}
            style={[
              styles.swipeKnob,
              { transform: [{ translateX: swipeAnim }] }
            ]}
          >
            {isPlacingOrder ? (
              <ActivityIndicator color="#F97316" />
            ) : (
              <ArrowRight size={24} color="#F97316" />
            )}
          </Animated.View>
        </View>
      </View>

      {/* ADDRESS MODAL */}
      <Modal visible={showAddressModal} transparent animationType="slide" onRequestClose={() => setShowAddressModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Address</Text>
              <TouchableOpacity onPress={() => setShowAddressModal(false)}><X size={24} color="#111827" /></TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.mapPickerContainer}>
                <Text style={styles.inputLabel}>Delivery Location</Text>
                <View style={[styles.miniMap, { backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' }]}>
                  <MapPin size={32} color="#F97316" fill="#FED7AA" />
                  <Text style={{ marginTop: 8, fontSize: 13, color: '#6B7280', fontWeight: '600' }}>Tiruvannamalai</Text>
                </View>
              </View>

              <Text style={styles.inputLabel}>House / Flat / Area</Text>
              <TextInput style={styles.modalInput} placeholder="e.g. Flat 402, Skyline Apartments" value={formAddress.street} onChangeText={(v) => setFormAddress({ ...formAddress, street: v })} />

              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>City</Text>
                  <TextInput style={styles.modalInput} placeholder="Mumbai" value={formAddress.city} onChangeText={(v) => setFormAddress({ ...formAddress, city: v })} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Pincode</Text>
                  <TextInput style={styles.modalInput} placeholder="400018" value={formAddress.pincode} keyboardType="numeric" onChangeText={(v) => setFormAddress({ ...formAddress, pincode: v })} />
                </View>
              </View>

              <Text style={styles.inputLabel}>Type</Text>
              <View style={styles.typeRow}>
                {['Home', 'Work', 'Other'].map(t => (
                  <TouchableOpacity key={t} style={[styles.typeBtn, formAddress.type === t && styles.typeBtnActive]} onPress={() => setFormAddress({ ...formAddress, type: t as any })}>
                    <Text style={[styles.typeBtnText, formAddress.type === t && styles.typeBtnTextActive]}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity style={styles.saveBtn} onPress={saveAddress}>
                <Text style={styles.saveBtnText}>Save Address</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* SUCCESS OVERLAY */}
      {showSuccess && (
        <View style={styles.successOverlay}>
          <Animated.View style={[styles.successCircle, { transform: [{ scale: successScale }] }]}>
            <LinearGradient colors={['#22C55E', '#16A34A']} style={styles.successGradient}>
              <Check size={60} color="#FFF" strokeWidth={4} />
            </LinearGradient>
          </Animated.View>
          <Text style={styles.successText}>Order Placed Successfully!</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAF9' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#FFFFFF' },
  headerBtn: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#111827' },
  scrollContentInner: { paddingHorizontal: 12, paddingTop: 10, paddingBottom: 100 },
  arrivingBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF7ED', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#FFEDD5', marginBottom: 16 },
  zapIconContainer: { width: 36, height: 36, borderRadius: 8, backgroundColor: '#F97316', alignItems: 'center', justifyContent: 'center' },
  arrivingTextContainer: { marginLeft: 12 },
  arrivingLabel: { fontSize: 12, fontWeight: '900', color: '#D97706', letterSpacing: 0.5 },
  arrivingSubtext: { fontSize: 13, color: '#4B5563', marginTop: 1 },
  sectionTitleSmall: { fontSize: 16, fontWeight: '800', color: '#111827', marginTop: 10, marginBottom: 10 },
  cartItemCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, padding: 8, marginBottom: 8 },
  itemImage: { width: 48, height: 48, borderRadius: 8 },
  itemDetails: { flex: 1, marginLeft: 10 },
  itemName: { fontSize: 14, fontWeight: '700', color: '#111827' },
  itemUnit: { fontSize: 11, color: '#6B7280' },
  itemPriceText: { fontSize: 14, fontWeight: '800', color: '#111827' },
  quantityContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 16, paddingHorizontal: 6 },
  qtyBtn: { padding: 4 },
  qtyNum: { fontSize: 13, fontWeight: '700', marginHorizontal: 8 },
  addressCard: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, marginBottom: 12 },
  addressRow: { flexDirection: 'row' },
  addressTextContainer: { flex: 1, marginLeft: 10 },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between' },
  userName: { fontSize: 14, fontWeight: '700' },
  editText: { fontSize: 11, color: '#F97316', fontWeight: '800' },
  addressText: { fontSize: 12, color: '#6B7280', marginTop: 3 },
  addAddressBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#FED7AA', borderStyle: 'dashed', borderRadius: 8, paddingVertical: 10 },
  addAddressText: { fontSize: 13, color: '#F97316', fontWeight: '700', marginLeft: 6 },
  paymentCard: { backgroundColor: '#FFFFFF', borderRadius: 12, marginBottom: 16 },
  paymentOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  paymentLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  paymentOptionText: { fontSize: 14, color: '#111827', fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginHorizontal: 16 },
  summaryCard: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 16 },
  summaryTitle: { fontSize: 12, fontWeight: '900', color: '#9CA3AF', marginBottom: 12 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { fontSize: 14, color: '#6B7280' },
  summaryValue: { fontSize: 14, color: '#111827', fontWeight: '700' },
  grandTotalDivider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 8 },
  grandTotalLabel: { fontSize: 16, fontWeight: '900' },
  grandTotalValue: { fontSize: 18, fontWeight: '900', color: '#F97316' },
  footer: { backgroundColor: '#FFFFFF', padding: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingBottom: 24 },
  swipeContainer: { height: 56, backgroundColor: '#F9FAFB', borderRadius: 28, justifyContent: 'center', overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB' },
  swipePlaceholderText: { position: 'absolute', alignSelf: 'center', fontSize: 16, fontWeight: '800', color: '#9CA3AF', letterSpacing: 0.5 },
  swipeBg: { position: 'absolute', left: 0, top: 0, bottom: 0, backgroundColor: '#22C55E', borderRadius: 28 },
  swipeKnob: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 4 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: height * 0.8 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: '800' },
  modalInput: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, padding: 12, fontSize: 14, marginBottom: 12 },
  inputLabel: { fontSize: 13, fontWeight: '700', color: '#4B5563', marginBottom: 6, marginTop: 4 },
  mapPickerContainer: { marginBottom: 16 },
  miniMap: { height: 150, borderRadius: 12, overflow: 'hidden', position: 'relative' },
  mapOverlay: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  mapBtn: { position: 'absolute', bottom: 10, left: 10, right: 10, backgroundColor: '#FFF', paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  mapBtnText: { fontSize: 12, fontWeight: '800', color: '#F97316' },
  typeRow: { flexDirection: 'row', gap: 10, marginTop: 4, marginBottom: 20 },
  typeBtn: { flex: 1, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center' },
  typeBtnActive: { backgroundColor: '#F97316', borderColor: '#F97316' },
  typeBtnText: { fontSize: 13, color: '#4B5563', fontWeight: '600' },
  typeBtnTextActive: { color: '#FFF' },
  saveBtn: { backgroundColor: '#F97316', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  saveBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
  successOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: '#FFF', zIndex: 999, alignItems: 'center', justifyContent: 'center' },
  successCircle: { width: 100, height: 100, borderRadius: 50 },
  successGradient: { flex: 1, borderRadius: 50, alignItems: 'center', justifyContent: 'center' },
  successText: { fontSize: 20, fontWeight: '900', marginTop: 20 },
});
