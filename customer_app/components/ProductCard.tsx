import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { QuantitySelector } from '@/components/QuantitySelector';
import { BottomSheet } from '@/components/BottomSheet';
import { Plus, Leaf, ShoppingBag } from 'lucide-react-native';
import { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { Compact } from '@/ui/compact';

interface ProductCardProps {
  product: Product;
}

/** Detect unit type for smart quantity options */
type UnitType = 'kg' | 'g' | 'litre' | 'ml' | 'item';

function detectUnitType(unit: string): UnitType {
  const u = unit.toLowerCase();
  if (u.includes('kg') || (u.match(/\d+\s*kg/))) return 'kg';
  if (u.match(/\d+\s*g\b/) && !u.includes('kg')) return 'g';
  if (u.includes('liter') || u.includes('litre') || (u.match(/\d+\s*l\b/) && !u.includes('ml'))) return 'litre';
  if (u.includes('ml')) return 'ml';
  return 'item';
}

interface QuantityOption {
  label: string;
  qty: number;
  price: number;
}

function getSmartOptions(product: { price: number; unit: string }): QuantityOption[] {
  const unitType = detectUnitType(product.unit);
  const u = product.unit.toLowerCase();
  const basePrice = product.price;

  switch (unitType) {
    case 'kg': {
      const kgMatch = u.match(/(\d+(?:\.\d+)?)\s*kg/);
      const gMatch = u.match(/(\d+)\s*g\b/);
      let baseKg = kgMatch ? parseFloat(kgMatch[1]) : (gMatch ? parseInt(gMatch[1]) / 1000 : 1);
      const pricePerKg = basePrice / baseKg;
      return [
        { label: '250 g', qty: 1, price: Math.round(pricePerKg * 0.25) },
        { label: '500 g', qty: 2, price: Math.round(pricePerKg * 0.5) },
        { label: '1 kg', qty: 4, price: Math.round(pricePerKg) },
        { label: '2 kg', qty: 8, price: Math.round(pricePerKg * 2) },
      ];
    }
    case 'g': {
      const gMatch = u.match(/(\d+)\s*g\b/);
      const baseG = gMatch ? parseInt(gMatch[1]) : 100;
      const ppg = basePrice / baseG;
      return [
        { label: `${baseG} g`, qty: 1, price: Math.round(ppg * baseG) },
        { label: `${baseG * 2} g`, qty: 2, price: Math.round(ppg * baseG * 2) },
        { label: `${baseG * 4} g`, qty: 4, price: Math.round(ppg * baseG * 4) },
        { label: `${baseG * 6} g`, qty: 6, price: Math.round(ppg * baseG * 6) },
      ];
    }
    case 'litre': {
      const lMatch = u.match(/(\d+(?:\.\d+)?)\s*lit/);
      const baseL = lMatch ? parseFloat(lMatch[1]) : 1;
      const ppl = basePrice / baseL;
      return [
        { label: '250 ml', qty: 1, price: Math.round(ppl * 0.25) },
        { label: '500 ml', qty: 2, price: Math.round(ppl * 0.5) },
        { label: '1 L', qty: 4, price: Math.round(ppl) },
        { label: '2 L', qty: 8, price: Math.round(ppl * 2) },
      ];
    }
    case 'ml': {
      const mlMatch = u.match(/(\d+)\s*ml/);
      const baseML = mlMatch ? parseInt(mlMatch[1]) : 200;
      const ppml = basePrice / baseML;
      return [
        { label: `${baseML} ml`, qty: 1, price: Math.round(ppml * baseML) },
        { label: `${baseML * 2} ml`, qty: 2, price: Math.round(ppml * baseML * 2) },
        { label: `${baseML * 4} ml`, qty: 4, price: Math.round(ppml * baseML * 4) },
        { label: `${baseML * 6} ml`, qty: 6, price: Math.round(ppml * baseML * 6) },
      ];
    }
    default:
      return [
        { label: '1', qty: 1, price: basePrice },
        { label: '2', qty: 2, price: basePrice * 2 },
        { label: '3', qty: 3, price: basePrice * 3 },
        { label: '5', qty: 5, price: basePrice * 5 },
      ];
  }
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { items, addToCart, updateQuantity } = useCart();
  const [showImageZoom, setShowImageZoom] = useState(false);
  const [quantityPickerOpen, setQuantityPickerOpen] = useState(false);

  // New Slide-up Animations
  const { height: screenHeight } = Dimensions.get('window');
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const overlayOpacityAnim = useRef(new Animated.Value(0)).current;

  // Internal Picker States
  const [selectedOptIndex, setSelectedOptIndex] = useState(0);
  const [localCount, setLocalCount] = useState(1);

  const cartItem = items.find((item) => item.product.id === product.id);
  const quantity = cartItem?.quantity || 0;

  const smartOptions = getSmartOptions(product);
  const unitType = detectUnitType(product.unit);
  const isLiquid = unitType === 'litre' || unitType === 'ml';

  const openPicker = () => {
    setSelectedOptIndex(0);
    setLocalCount(1);
    setQuantityPickerOpen(true);

    Animated.parallel([
      Animated.timing(overlayOpacityAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 350,
        easing: Easing.out(Easing.back(1.05)),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closePicker = () => {
    Animated.parallel([
      Animated.timing(overlayOpacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: screenHeight,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => setQuantityPickerOpen(false));
  };

  const handleAddToCartModal = () => {
    const qtyToAdd = smartOptions[selectedOptIndex].qty * localCount;
    closePicker();
    setTimeout(() => {
      if (qtyToAdd <= 0) return;
      if (quantity === 0) {
        addToCart(product, qtyToAdd);
      } else {
        updateQuantity(product.id, quantity + qtyToAdd);
      }
    }, 200);
  };

  return (
    <View style={[styles.container, !product.inStock && styles.outOfStock]}>
      <View style={styles.imageWrapper}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => setShowImageZoom(true)} style={styles.imageInner}>
          <Image source={{ uri: product.image }} style={styles.productImage} resizeMode="cover" />
        </TouchableOpacity>

        {/* Animated Add / Quantity Button over Image */}
        {product.inStock && (
          <TouchableOpacity style={styles.addButtonOverlay} onPress={openPicker} activeOpacity={0.9}>
            {quantity === 0 ? (
              <Plus size={16} color="#F97316" strokeWidth={3} />
            ) : (
              <Text style={styles.quantityBadgeText}>{quantity}</Text>
            )}
          </TouchableOpacity>
        )}
        {!product.inStock && (
          <View style={styles.outOfStockOverlay}>
            <Text style={styles.outOfStockTextBadge}>Out</Text>
          </View>
        )}
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.priceUnitText}>
          ₹{product.price}/{product.unit}
        </Text>
      </View>

      {/* Image zoom modal */}
      <Modal
        visible={showImageZoom}
        transparent
        animationType="fade"
        onRequestClose={() => setShowImageZoom(false)}
      >
        <Pressable style={styles.zoomOverlay} onPress={() => setShowImageZoom(false)}>
          <Image source={{ uri: product.image }} style={styles.zoomImage} resizeMode="contain" />
        </Pressable>
      </Modal>

      {/* Quantity picker modal */}
      <BottomSheet
        visible={quantityPickerOpen}
        onClose={closePicker}
        overlayOpacity={overlayOpacityAnim}
        slideAnim={slideAnim}
      >
        {/* Top Product Header */}
        <View style={styles.sheetHeader}>
          <View style={styles.sheetHeaderLeft}>
            <Text style={styles.sheetTitle}>{product.name}</Text>
            <Text style={styles.sheetSubtitle} numberOfLines={1}>{product.description}</Text>
          </View>
          <View style={styles.leafIconContainer}>
            <Leaf size={18} color="#22C55E" strokeWidth={2.5} />
          </View>
        </View>

        {/* SELECT LABEL */}
        <Text style={styles.sectionTitle}>
          {isLiquid ? 'SELECT VOLUME' : unitType === 'item' ? 'SELECT QUANTITY' : 'SELECT WEIGHT'}
        </Text>

        {/* Options grid */}
        <View style={styles.gridContainer}>
          {smartOptions.map((opt: QuantityOption, i: number) => {
            const isSelected = selectedOptIndex === i;
            return (
              <TouchableOpacity
                key={opt.label}
                style={[styles.gridOption, isSelected && styles.gridOptionSelected]}
                onPress={() => setSelectedOptIndex(i)}
                activeOpacity={0.8}
              >
                <View style={styles.optionRow}>
                  <Text style={[styles.optionLabel, isSelected && styles.textSelected]}>
                    {opt.label}
                  </Text>
                  <View style={[styles.radioOutline, isSelected && styles.radioOutlineSelected]}>
                    {isSelected && <View style={styles.radioFilled} />}
                  </View>
                </View>
                <Text style={[styles.optionPrice, isSelected && styles.textSelected]}>
                  ₹{opt.price}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Bottom Actions */}
        <View style={styles.bottomActionRow}>
          <QuantitySelector
            quantity={localCount}
            onIncrease={() => setLocalCount(localCount + 1)}
            onDecrease={() => setLocalCount(Math.max(1, localCount - 1))}
          />

          {/* Add Button */}
          <TouchableOpacity style={styles.addToCartBtn} onPress={handleAddToCartModal}>
            <ShoppingBag size={18} color="#FFFFFF" strokeWidth={2.5} />
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>

        {/* Subtotal */}
        <View style={styles.subtotalArea}>
          <Text style={styles.subtotalLabel}>SUBTOTAL: </Text>
          <Text style={styles.subtotalValue}>
            ₹{(smartOptions[selectedOptIndex].price * localCount).toFixed(2)}
          </Text>
        </View>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    marginBottom: Compact.space.md,
    position: 'relative',
    width: '100%',
  },
  imageWrapper: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    marginBottom: 8,
    position: 'relative',
    aspectRatio: 1, // Make it perfectly square
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  imageInner: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    borderRadius: 12,
  },
  outOfStock: {
    opacity: 0.7,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  addButtonOverlay: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
    zIndex: 10,
  },
  quantityBadgeText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#F97316',
  },
  outOfStockOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 4,
    alignItems: 'center',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  outOfStockTextBadge: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  contentContainer: {
    paddingHorizontal: 2,
  },
  productName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
    lineHeight: 18,
  },
  priceUnitText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F97316',
  },
  zoomOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomImage: {
    width: '90%',
    height: '80%',
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  sheetHeaderLeft: {
    flex: 1,
    paddingRight: 16,
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  sheetSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  leafIconContainer: {
    backgroundColor: '#DCFCE7',
    padding: 8,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  gridOption: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#F3F4F6',
    borderRadius: 16,
    padding: 16,
  },
  gridOptionSelected: {
    borderColor: '#22C55E',
    backgroundColor: '#F0FDF4',
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#374151',
  },
  optionPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#22C55E',
  },
  textSelected: {
    color: '#15803D',
  },
  radioOutline: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOutlineSelected: {
    borderColor: '#22C55E',
  },
  radioFilled: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#22C55E',
  },
  bottomActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  addToCartBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#22C55E',
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  subtotalArea: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtotalLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 1,
  },
  subtotalValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#374151',
  },
});


