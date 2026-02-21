import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Heart } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { dummyProducts } from '../../data/products';
import { ProductCard } from '../../components/ProductCard';
import { useCart } from '../../context/CartContext';
import { CartBar } from '../../components/CartBar';

export const WishlistScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { wishlistProductIds } = useAuth();
  const { getTotalItems, shouldShowCheckoutBar } = useCart();
  const cartItemCount = getTotalItems();

  const products = useMemo(() => {
    const set = new Set(wishlistProductIds);
    return dummyProducts.filter(p => set.has(p.id));
  }, [wishlistProductIds]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>{'‹'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wishlist</Text>
      </View>

      {products.length === 0 ? (
        <View style={styles.empty}>
          <Heart size={42} color="#9CA3AF" />
          <Text style={styles.emptyTitle}>No items in wishlist</Text>
          <Text style={styles.emptySub}>Tap the heart on any product to save it here.</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ProductCard product={item} />}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      {cartItemCount > 0 && shouldShowCheckoutBar && <CartBar aboveTabBar={false} />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backArrow: {
    fontSize: 24,
    marginRight: 12,
    color: '#111827',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  emptySub: {
    marginTop: 8,
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});

