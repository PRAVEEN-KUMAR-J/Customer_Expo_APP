import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Heart } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { dummyProducts } from '@/data/products';
import { ProductCard } from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';
import { CartBar } from '@/components/CartBar';
import { Compact } from '@/ui/compact';

export const WishlistScreen: React.FC = () => {
  const router = useRouter();
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
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backArrow}>{'‹'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wishlist</Text>
      </View>

      {products.length === 0 ? (
        <View style={styles.empty}>
          <Heart size={Compact.icon.xxl} color="#9CA3AF" />
          <Text style={styles.emptyTitle}>No items in wishlist</Text>
          <Text style={styles.emptySub}>Tap the heart on any product to save it here.</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.productItem}>
              <ProductCard product={item} />
            </View>
          )}
          numColumns={3}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
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
    paddingHorizontal: Compact.space.xl,
    paddingTop: Compact.space.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Compact.space.xl,
  },
  backArrow: {
    fontSize: 22,
    marginRight: Compact.space.md,
    color: '#111827',
  },
  headerTitle: {
    fontSize: Compact.font.xxxl,
    fontWeight: '700',
    color: '#111827',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Compact.space.xxl,
  },
  emptyTitle: {
    marginTop: Compact.space.md,
    fontSize: Compact.font.xxxl,
    fontWeight: '800',
    color: '#111827',
  },
  emptySub: {
    marginTop: Compact.space.sm,
    fontSize: Compact.font.md,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
  },
  listContent: {
    paddingBottom: 120,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 2,
    marginBottom: Compact.space.md,
  },
  productItem: {
    width: '31%',
    alignSelf: 'stretch',
  },
});

