import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Plus, Minus, Trash2 } from 'lucide-react-native';
import { CartItem as CartItemType } from '@/context/CartContext';
import { Compact } from '@/ui/compact';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemove }) => {
  const { product, quantity } = item;
  const totalPrice = product.price * quantity;

  return (
    <View style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.productImage} />

      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => onRemove(product.id)}
          >
            <Trash2 size={Compact.icon.md} color="#EF4444" />
          </TouchableOpacity>
        </View>

        <Text style={styles.productUnit}>{product.unit}</Text>
        <Text style={styles.productPrice}>₹{product.price} each</Text>

        <View style={styles.footer}>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => onUpdateQuantity(product.id, quantity - 1)}
            >
              <Minus size={Compact.icon.md} color="#22C55E" />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => onUpdateQuantity(product.id, quantity + 1)}
            >
              <Plus size={Compact.icon.md} color="#22C55E" />
            </TouchableOpacity>
          </View>

          <Text style={styles.totalPrice}>₹{totalPrice}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: Compact.radius.md,
    padding: Compact.space.xl,
    marginBottom: Compact.space.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 5,
  },
  productImage: {
    width: 68,
    height: 68,
    borderRadius: Compact.radius.sm,
    marginRight: Compact.space.xl,
  },
  contentContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  productName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    flex: 1,
    marginRight: Compact.space.md,
    lineHeight: 24,
  },
  removeButton: {
    padding: Compact.space.xs,
  },
  productUnit: {
    fontSize: Compact.font.sm,
    color: '#6B7280',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: Compact.font.sm,
    color: '#6B7280',
    marginBottom: Compact.space.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: Compact.radius.sm,
    paddingVertical: 2,
  },
  quantityButton: {
    padding: Compact.space.sm,
  },
  quantityText: {
    fontSize: Compact.font.lg,
    fontWeight: '600',
    color: '#1F2937',
    marginHorizontal: Compact.space.xl,
  },
  totalPrice: {
    fontSize: Compact.font.xl,
    fontWeight: '700',
    color: '#1F2937',
  },
});
