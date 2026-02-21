import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, Pressable, Animated } from 'react-native';
import { Plus, Minus, Heart, CheckCircle } from 'lucide-react-native';
import { Product } from '../data/products';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { items, addToCart, updateQuantity } = useCart();
  const { wishlistProductIds, toggleWishlist } = useAuth();
  const [showImageZoom, setShowImageZoom] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  
  const cartItem = items.find(item => item.product.id === product.id);
  const quantity = cartItem?.quantity || 0;
  const isWishlisted = wishlistProductIds.includes(product.id);

  useEffect(() => {
    if (showSuccessMessage) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setShowSuccessMessage(false);
          // Don't navigate - just hide the badge
        });
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [showSuccessMessage, fadeAnim]);

  const handleAddToCart = () => {
    const wasInCart = quantity > 0;
    addToCart(product);
    // Only show success message if product wasn't already in cart
    if (!wasInCart) {
      setShowSuccessMessage(true);
    }
  };

  const handleUpdateQuantity = (newQuantity: number) => {
    updateQuantity(product.id, newQuantity);
  };

  return (
    <View style={[styles.container, !product.inStock && styles.outOfStock]}>
      <View style={styles.imageWrapper}>
        <TouchableOpacity
          style={styles.wishlistBtn}
          onPress={() => toggleWishlist(product.id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Heart size={15} color={isWishlisted ? '#EF4444' : '#9CA3AF'} />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8} onPress={() => setShowImageZoom(true)}>
          <Image source={{ uri: product.image }} style={styles.productImage} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
        <Text style={styles.productUnit}>{product.unit}</Text>
        
        <View style={styles.priceContainer}>
          <Text style={styles.currentPrice}>₹{product.price}</Text>
        </View>
        
        {!product.inStock ? (
          <Text style={styles.outOfStockText}>Out of Stock</Text>
        ) : quantity === 0 ? (
          <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
            <Plus size={16} color="#FFFFFF" />
          </TouchableOpacity>
        ) : (
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleUpdateQuantity(quantity - 1)}
            >
              <Minus size={14} color="#22C55E" />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleUpdateQuantity(quantity + 1)}
            >
              <Plus size={14} color="#22C55E" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Modal
        visible={showImageZoom}
        transparent
        animationType="fade"
        onRequestClose={() => setShowImageZoom(false)}
      >
        <Pressable style={styles.zoomOverlay} onPress={() => setShowImageZoom(false)}>
          <Image
            source={{ uri: product.image }}
            style={styles.zoomImage}
            resizeMode="contain"
          />
        </Pressable>
      </Modal>

      {/* Success Message */}
      {showSuccessMessage && (
        <Modal
          visible={showSuccessMessage}
          transparent
          animationType="fade"
          onRequestClose={() => setShowSuccessMessage(false)}
        >
          <View style={styles.successOverlay}>
            <Animated.View style={[styles.successMessage, { opacity: fadeAnim }]}>
              <CheckCircle size={48} color="#22C55E" />
              <Text style={styles.successText}>Product added to cart!</Text>
            </Animated.View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E8ECF0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
    position: 'relative',
    minHeight: 193,
  },
  imageWrapper: {
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    marginBottom: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  wishlistBtn: {
    position: 'absolute',
    top: 5,
    right: 5,
    zIndex: 2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(232,245,233,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outOfStock: {
    opacity: 0.6,
  },
  productImage: {
    width: '100%',
    height: 91,
    borderRadius: 10,
  },
  contentContainer: {
    flex: 1,
  },
  productName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
    lineHeight: 16,
  },
  productUnit: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 6,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  currentPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#22C55E',
  },
  addButton: {
    position: 'absolute',
    right: 6,
    bottom: 6,
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 6,
    paddingVertical: 3,
  },
  quantityButton: {
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
    marginHorizontal: 10,
  },
  outOfStockText: {
    fontSize: 14,
    color: '#EF4444',
    textAlign: 'center',
    fontWeight: '500',
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
  successOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successMessage: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  successText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginTop: 12,
  },
  successSubtext: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
});