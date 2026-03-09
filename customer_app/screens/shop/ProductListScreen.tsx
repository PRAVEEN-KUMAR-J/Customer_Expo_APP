import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity,
  FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search } from 'lucide-react-native';
import { ProductCard } from '@/components/ProductCard';
import { dummyProducts } from '@/data/products';
import { dummyShops } from '@/data/shops';
import { Compact } from '@/ui/compact';

interface ProductListScreenProps {
  route: {
    params: {
      shopId: string;
    };
  };
}

export const ProductListScreen: React.FC<ProductListScreenProps> = ({ route }) => {
  const { shopId } = route.params;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const shop = dummyShops.find(s => s.id === shopId);
  const shopProducts = dummyProducts.filter(product => product.shopId === shopId);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(shopProducts.map(p => p.category)));
    return ['All', ...cats];
  }, [shopProducts]);

  const filteredProducts = useMemo(() => {
    let filtered = shopProducts;

    if (selectedCategory && selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [shopProducts, selectedCategory, searchQuery]);

  const renderProductItem = ({ item }: { item: any }) => (
    <View style={styles.productItem}>
      <ProductCard product={item} />
    </View>
  );

  if (!shop) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>Shop not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.shopName}>{shop.name}</Text>
        <Text style={styles.shopInfo}>
          ⭐ {shop.rating} • {shop.deliveryTime} • {shop.isOpen ? 'Open' : 'Closed'}
        </Text>
        
        <View style={styles.searchContainer}>
          <Search size={20} color="#6B7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoryContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.selectedCategoryButton
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[
              styles.categoryButtonText,
              selectedCategory === category && styles.selectedCategoryButtonText
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredProducts}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id}
        numColumns={3}
        style={styles.productList}
        contentContainerStyle={styles.productListContent}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No products found</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: Compact.space.xl,
    paddingBottom: Compact.space.xl,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  shopName: {
    fontSize: Compact.font.xxxl,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  shopInfo: {
    fontSize: Compact.font.md,
    color: '#6B7280',
    marginBottom: Compact.space.xl,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: Compact.radius.md,
    paddingHorizontal: Compact.space.xl,
  },
  searchIcon: {
    marginRight: Compact.space.md,
  },
  searchInput: {
    flex: 1,
    paddingVertical: Compact.space.xl,
    fontSize: Compact.font.lg,
  },
  categoryContainer: {
    paddingVertical: Compact.space.xl,
    paddingLeft: Compact.space.xl,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  categoryButton: {
    paddingHorizontal: Compact.space.xl,
    paddingVertical: Compact.space.sm,
    backgroundColor: '#F9FAFB',
    borderRadius: Compact.radius.pill,
    marginRight: Compact.space.md,
  },
  selectedCategoryButton: {
    backgroundColor: '#22C55E',
  },
  categoryButtonText: {
    fontSize: Compact.font.md,
    fontWeight: '500',
    color: '#6B7280',
  },
  selectedCategoryButtonText: {
    color: '#FFFFFF',
  },
  productList: {
    flex: 1,
  },
  productListContent: {
    paddingHorizontal: Compact.space.md,
    paddingVertical: Compact.space.xl,
    paddingBottom: 100,
  },
  productItem: {
    width: '33.33%',
    alignSelf: 'stretch',
  },
  columnWrapper: {
    justifyContent: 'flex-start',
    paddingHorizontal: 2,
    marginBottom: Compact.space.md,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyStateText: {
    fontSize: Compact.font.lg,
    color: '#6B7280',
  },
});
