import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Search } from 'lucide-react-native';
import { ProductCard } from '@/components/ProductCard';
import { CartBar } from '@/components/CartBar';
import { useCart } from '@/context/CartContext';
import { dummyProducts, Product } from '@/data/products';
import { Compact } from '@/ui/compact';

// Map category labels to product categories
const categoryMapping: Record<string, string[]> = {
  'Fruits & Vegetables': ['Fruits', 'Vegetables'],
  'Dairy, Bread & Eggs': ['Dairy'],
  'Atta, Rice, Oil & Dals': ['Vegetables'],
  'Meat, Fish & Eggs': ['Vegetables'],
  'Masala & Dry Fruits': ['Snacks'],
  'Breakfast & Spreads': ['Dairy'],
  'Packaged Food': ['Snacks'],
  'Tea, Coffee & More': ['Snacks'],
  'Ice Cream & More': ['Snacks'],
  'Frozen Food': ['Snacks'],
  'Sweet Cravings': ['Snacks'],
  'Cold Drinks & Juices': ['Snacks'],
  'Munchies': ['Snacks'],
  'Biscuits & Cookies': ['Snacks'],
};

// Sidebar subcategories per product category. Each has label and a filter (product) => boolean.
// No data changes - filter by product name/unit only.
const getSidebarItems = (productCategories: string[]): { id: string; label: string; filter: (p: Product) => boolean }[] => {
  const allMatch = () => true;
  const nameIncludes = (...keys: string[]) => (p: Product) =>
    keys.some((k) => p.name.toLowerCase().includes(k));
  const unitIncludes = (...keys: string[]) => (p: Product) =>
    keys.some((k) => p.unit.toLowerCase().includes(k));

  const dairy: { id: string; label: string; filter: (p: Product) => boolean }[] = [
    { id: 'all', label: 'All', filter: allMatch },
    { id: 'milk', label: 'Milk', filter: (p) => /milk/i.test(p.name) || /liter|litre|ml|pack/i.test(p.unit) },
    { id: 'ghee', label: 'Ghee', filter: nameIncludes('ghee') },
    { id: 'cheese', label: 'Cheese', filter: nameIncludes('cheese', 'cottage') },
    { id: 'paneer', label: 'Paneer & Cream', filter: nameIncludes('paneer', 'cream', 'condensed') },
    { id: 'butter', label: 'Butter', filter: nameIncludes('butter') },
    { id: 'bread', label: 'Bread & Eggs', filter: nameIncludes('bread', 'egg', 'loaf') },
    { id: 'curd', label: 'Curd & Yogurt', filter: nameIncludes('curd', 'yogurt', 'lassi') },
    { id: 'icecream', label: 'Ice Cream', filter: nameIncludes('ice cream') },
    { id: 'milkpowder', label: 'Milk Powder', filter: nameIncludes('milk powder') },
  ];

  const fruits: { id: string; label: string; filter: (p: Product) => boolean }[] = [
    { id: 'all', label: 'All', filter: allMatch },
    { id: 'banana', label: 'Banana', filter: nameIncludes('banana') },
    { id: 'apple', label: 'Apple', filter: nameIncludes('apple') },
    { id: 'mango', label: 'Mango', filter: nameIncludes('mango') },
    { id: 'orange', label: 'Orange', filter: nameIncludes('orange') },
    { id: 'grape', label: 'Grapes', filter: nameIncludes('grape') },
    { id: 'berry', label: 'Berries', filter: nameIncludes('strawberry', 'blueberr', 'cherr', 'blackberr') },
    { id: 'melon', label: 'Melons', filter: nameIncludes('watermelon', 'melon', 'cantaloupe', 'honeydew') },
    { id: 'tropical', label: 'Tropical', filter: nameIncludes('papaya', 'pineapple', 'pomegranate', 'avocado', 'coconut', 'guava', 'dragon', 'litchi', 'jackfruit', 'sapota', 'kiwi', 'plum', 'fig', 'dates') },
  ];

  const vegetables: { id: string; label: string; filter: (p: Product) => boolean }[] = [
    { id: 'all', label: 'All', filter: allMatch },
    { id: 'leafy', label: 'Leafy', filter: nameIncludes('spinach', 'cabbage', 'lettuce') },
    { id: 'root', label: 'Root', filter: nameIncludes('potato', 'carrot', 'onion', 'beet') },
    { id: 'tomato', label: 'Tomato', filter: nameIncludes('tomato') },
    { id: 'beans', label: 'Beans & Peas', filter: nameIncludes('bean', 'pea', 'ladyfinger', 'okra') },
    { id: 'broccoli', label: 'Broccoli', filter: nameIncludes('broccoli') },
    { id: 'capsicum', label: 'Capsicum', filter: nameIncludes('capsicum', 'pepper') },
    { id: 'others', label: 'Others', filter: nameIncludes('cucumber', 'cauliflower', 'brinjal', 'zucchini', 'mushroom') },
  ];

  const snacks: { id: string; label: string; filter: (p: Product) => boolean }[] = [
    { id: 'all', label: 'All', filter: allMatch },
    { id: 'tea', label: 'Tea', filter: nameIncludes('tea') },
    { id: 'coffee', label: 'Coffee', filter: nameIncludes('coffee') },
    { id: 'biscuits', label: 'Biscuits & Cookies', filter: nameIncludes('biscuit', 'cookie', 'cracker') },
    { id: 'chips', label: 'Chips', filter: nameIncludes('chip', 'kurkure', 'popcorn') },
    { id: 'chocolate', label: 'Chocolate', filter: nameIncludes('chocolate') },
    { id: 'namkeen', label: 'Namkeen & Mix', filter: nameIncludes('namkeen', 'chivda', 'mixture', 'trail') },
    { id: 'nuts', label: 'Nuts & Dry Fruits', filter: nameIncludes('peanut', 'nut', 'dry fruit') },
    { id: 'energy', label: 'Energy & Bars', filter: nameIncludes('energy', 'bar') },
  ];

  if (productCategories.includes('Dairy')) return dairy;
  if (productCategories.includes('Fruits')) return fruits;
  if (productCategories.includes('Vegetables')) return vegetables;
  if (productCategories.includes('Snacks')) return snacks;
  return [{ id: 'all', label: 'All', filter: allMatch }];
};

type CategoryProductsParams = {
  categoryName: string;
  shopId?: string;
  shopName?: string;
  productId?: string;
  fromProduct?: boolean;
  fromCategories?: boolean;
};

const SIDEBAR_ICON = 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=100';

export const CategoryProductsScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams() as any;
  const { getTotalItems, shouldShowCheckoutBar } = useCart();
  const categoryName = params.categoryName ?? '';
  const shopId = params.shopId;
  const shopName = params.shopName;
  const productId = params.productId;
  const fromProduct = params.fromProduct === 'true';
  const fromCategories = params.fromCategories === 'true';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSidebarId, setSelectedSidebarId] = useState<string>('all');
  const cartItemCount = getTotalItems();
  const flatListRef = useRef<FlatList>(null);

  const productCategories = useMemo(() => {
    return categoryMapping[categoryName] || [categoryName];
  }, [categoryName]);

  const sidebarItems = useMemo(() => getSidebarItems(productCategories), [productCategories]);

  // Reset sidebar selection when category changes
  React.useEffect(() => {
    setSelectedSidebarId('all');
  }, [categoryName]);

  const baseProducts = useMemo(() => {
    let products = dummyProducts.filter((product) =>
      productCategories.some((cat) =>
        product.category.toLowerCase().includes(cat.toLowerCase())
      )
    );
    if (shopId) products = products.filter((p) => p.shopId === shopId);
    if (searchQuery) {
      products = products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return products;
  }, [productCategories, shopId, searchQuery]);

  const selectedFilter = useMemo(
    () => sidebarItems.find((s) => s.id === selectedSidebarId)?.filter ?? (() => true),
    [sidebarItems, selectedSidebarId]
  );

  const filteredProducts = useMemo(
    () => baseProducts.filter(selectedFilter),
    [baseProducts, selectedFilter]
  );

  // Scroll to product when productId is provided
  useEffect(() => {
    if (productId && flatListRef.current && filteredProducts.length > 0) {
      const productIndex = filteredProducts.findIndex(p => p.id === productId);
      if (productIndex >= 0) {
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({
            index: productIndex,
            animated: true,
            viewPosition: 0.3,
          });
        }, 300);
      }
    }
  }, [productId, filteredProducts]);

  const handleBackPress = () => {
    if (fromProduct && shopId && shopName) {
      // Coming from featured product, go to categories page
      router.push({ pathname: '/store/categories', params: { shopId: shopId ?? '', shopName: shopName ?? '' } });
    } else if (fromCategories) {
      // Coming from categories page, go back to home
      router.replace('/(tabs)/home');
    } else if (shopId) {
      // Coming from shop, go back normally
      router.back();
    } else {
      router.back();
    }
  };

  const renderProductItem = React.useCallback(({ item }: { item: Product }) => (
    <View style={styles.productItem}>
      <ProductCard product={item} />
    </View>
  ), []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBackPress}
          style={styles.backBtn}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {shopName || categoryName}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.searchContainer}>
        <Search size={18} color="#9CA3AF" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.mainRow}>
        <View style={styles.sidebarWrap}>
          <ScrollView
            style={styles.sidebar}
            contentContainerStyle={styles.sidebarContent}
            showsVerticalScrollIndicator={false}
          >
            {sidebarItems.map((item) => {
              const isSelected = selectedSidebarId === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.sidebarItem, isSelected && styles.sidebarItemSelected]}
                  onPress={() => setSelectedSidebarId(item.id)}
                  activeOpacity={1}
                >
                  <View style={[styles.sidebarCircle, isSelected && styles.sidebarCircleSelected]}>
                    <Image source={{ uri: SIDEBAR_ICON }} style={styles.sidebarIcon} />
                  </View>
                  <Text
                    style={[styles.sidebarLabel, isSelected && styles.sidebarLabelSelected]}
                    numberOfLines={2}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.productListWrap}>
          <FlatList
            ref={flatListRef}
            data={filteredProducts}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id}
            numColumns={3}
            style={styles.productList}
            contentContainerStyle={styles.productListContent}
            columnWrapperStyle={styles.columnWrapper}
            showsVerticalScrollIndicator={false}
            onScrollToIndexFailed={(info) => {
              // Handle scroll to index failure
              setTimeout(() => {
                if (flatListRef.current) {
                  flatListRef.current.scrollToOffset({ offset: info.averageItemLength * info.index, animated: true });
                }
              }, 100);
            }}
            ListEmptyComponent={() => (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No products found</Text>
              </View>
            )}
          />
        </View>
      </View>
      {cartItemCount > 0 && shouldShowCheckoutBar && <CartBar aboveTabBar={false} />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Compact.space.lg,
    paddingVertical: Compact.space.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backBtn: {
    marginRight: Compact.space.md,
    padding: Compact.space.xs,
  },
  headerTitle: {
    flex: 1,
    fontSize: Compact.font.xxl,
    fontWeight: '700',
    color: '#111827',
  },
  headerSpacer: {
    width: 32,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    marginHorizontal: Compact.space.lg,
    marginVertical: Compact.space.md,
    paddingHorizontal: Compact.space.lg,
    paddingVertical: Compact.space.sm,
    borderRadius: Compact.radius.md,
    gap: Compact.space.md,
  },
  searchInput: {
    flex: 1,
    fontSize: Compact.font.lg,
    color: '#111827',
    padding: 0,
  },
  mainRow: {
    flex: 1,
    flexDirection: 'row',
    minWidth: 0,
  },
  sidebarWrap: {
    width: 64,
    flexShrink: 0,
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  sidebar: {
    flex: 1,
  },
  sidebarContent: {
    paddingVertical: Compact.space.sm,
    paddingHorizontal: Compact.space.xs,
    alignItems: 'center',
  },
  sidebarItem: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Compact.space.md,
    width: 58,
  },
  sidebarItemSelected: {
    backgroundColor: 'transparent',
  },
  sidebarCircle: {
    width: Compact.image.sidebarCircle + 16,
    height: Compact.image.sidebarCircle + 16,
    borderRadius: (Compact.image.sidebarCircle + 16) / 2,
    overflow: 'hidden',
    marginBottom: Compact.space.sm,
    backgroundColor: '#E5E7EB',
    alignSelf: 'center',
  },
  sidebarCircleSelected: {
    backgroundColor: '#C7D2FE',
    borderWidth: 2,
    borderColor: '#4F46E5',
  },
  sidebarIcon: {
    width: '100%',
    height: '100%',
  },
  sidebarLabel: {
    fontSize: Compact.font.xs,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
  },
  sidebarLabelSelected: {
    color: '#4F46E5',
    fontWeight: '700',
  },
  productListWrap: {
    flex: 1,
    minWidth: 0,
  },
  productList: {
    flex: 1,
  },
  productListContent: {
    paddingHorizontal: 6,
    paddingVertical: Compact.space.lg,
    paddingBottom: 100,
  },
  columnWrapper: {
    marginBottom: Compact.space.md,
    justifyContent: 'flex-start',
    paddingHorizontal: 2,
  },
  productItem: {
    width: '33.33%',
    alignSelf: 'stretch',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
  },
});
