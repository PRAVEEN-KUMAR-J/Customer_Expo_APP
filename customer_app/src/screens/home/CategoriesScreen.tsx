import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, Heart, Search } from 'lucide-react-native';
import { CartBar } from '../../components/CartBar';
import { ShopCard } from '../../components/ShopCard';
import { useCart } from '../../context/CartContext';
import { dummyShops } from '../../data/shops';

// Category items with image seeds for placeholder images (picsum)
const sections = [
  {
    title: 'Grocery & Kitchen',
    items: [
      { label: 'Fruits & Vegetables', imageSeed: 'fruits-veg' },
      { label: 'Dairy, Bread & Eggs', imageSeed: 'dairy-bread' },
      { label: 'Atta, Rice, Oil & Dals', imageSeed: 'atta-rice' },
      { label: 'Meat, Fish & Eggs', imageSeed: 'meat-fish' },
      { label: 'Masala & Dry Fruits', imageSeed: 'masala-dry' },
      { label: 'Breakfast & Spreads', imageSeed: 'breakfast' },
      { label: 'Packaged Food', imageSeed: 'packaged' },
    ],
  },
  {
    title: 'Snacks & Drinks',
    items: [
      { label: 'Tea, Coffee & More', imageSeed: 'tea-coffee' },
      { label: 'Ice Cream & More', imageSeed: 'icecream' },
      { label: 'Frozen Food', imageSeed: 'frozen' },
      { label: 'Sweet Cravings', imageSeed: 'sweets' },
      { label: 'Cold Drinks & Juices', imageSeed: 'drinks' },
      { label: 'Munchies', imageSeed: 'munchies' },
      { label: 'Biscuits & Cookies', imageSeed: 'biscuits' },
    ],
  },
  {
    title: 'Fashion & Lifestyle',
    items: [
      { label: 'Apparel', imageSeed: 'apparel' },
      { label: 'Jewellery', imageSeed: 'jewellery' },
    ],
  },
  {
    title: 'Beauty & Personal Care',
    items: [
      { label: 'Skincare', imageSeed: 'skincare' },
      { label: 'Makeup & Beauty', imageSeed: 'makeup' },
      { label: 'Fragrance', imageSeed: 'fragrance' },
      { label: 'Bath & Body', imageSeed: 'bath-body' },
      { label: 'Haircare', imageSeed: 'haircare' },
      { label: 'Baby Care', imageSeed: 'baby-care' },
      { label: 'Protein & Nutrition', imageSeed: 'protein' },
      { label: 'Feminine Hygiene', imageSeed: 'feminine' },
      { label: 'Sexual Wellness', imageSeed: 'wellness' },
    ],
  },
  {
    title: 'Household Essentials',
    items: [
      { label: 'Home Needs', imageSeed: 'home-needs' },
      { label: 'Kitchen & Dining', imageSeed: 'kitchen' },
      { label: 'Cleaning Essentials', imageSeed: 'cleaning' },
      { label: 'Electronics & Appliances', imageSeed: 'electronics' },
      { label: 'Pet Care', imageSeed: 'pet-care' },
      { label: 'Toys & Sports', imageSeed: 'toys-sports' },
      { label: 'Stationery & Books', imageSeed: 'stationery' },
      { label: 'Pooja Corner', imageSeed: 'pooja' },
    ],
  },
  {
    title: 'Shop by Store',
    items: [
      { label: 'Gift Store', imageSeed: 'gift' },
      { label: 'Ayush Store', imageSeed: 'ayush' },
      { label: 'Winter Store', imageSeed: 'winter' },
      { label: 'Pooja Store', imageSeed: 'pooja-store' },
      { label: 'Wedding Store', imageSeed: 'wedding' },
      { label: 'Global Store', imageSeed: 'global' },
      { label: 'Sports Store', imageSeed: 'sports' },
      { label: 'Decor Store', imageSeed: 'decor' },
      { label: 'Flower Store', imageSeed: 'flower' },
      { label: 'Gaming & Gift Cards', imageSeed: 'gaming' },
      { label: 'Baby Store', imageSeed: 'baby-store' },
      { label: 'Automotive Store', imageSeed: 'automotive' },
    ],
  },
];

const getImageUri = (seed: string) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/200/200`;

type ShopCategoriesParams = { shopId?: string; shopName?: string };

// Animated category card for nicer unique UI and tap feedback
const CategoryCard: React.FC<{
  label: string;
  imageSeed: string;
  index: number;
  onPress: () => void;
}> = ({ label, imageSeed, index, onPress }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
      friction: 6,
      tension: 120,
    }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 7,
      tension: 120,
    }).start();
  };

  const pastelPalette = ['#ECFDF3', '#EEF2FF', '#FFF7ED', '#FDF2F8', '#E0F2FE', '#FEF9C3'];
  const backgroundColor = pastelPalette[index % pastelPalette.length];

  return (
    <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.cardInner, { backgroundColor }]}
      >
        <Image source={{ uri: getImageUri(imageSeed) }} style={styles.cardImage} />
        <Text style={styles.cardLabel} numberOfLines={2}>
          {label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const CategoriesScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const params = (route.params || {}) as ShopCategoriesParams;
  const fromShop = !!params.shopId;
  const { getTotalItems, shouldShowCheckoutBar } = useCart();
  const cartItemCount = getTotalItems();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            // Always go to home when clicking back from categories
            navigation.navigate('Main' as never, { screen: 'Home' } as never);
          }}
          style={styles.backBtn}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {fromShop ? (params.shopName ? `Categories · ${params.shopName}` : 'Categories') : 'All Categories'}
        </Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.headerIconBtn}>
            <Heart size={22} color="#374151" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIconBtn}>
            <Search size={22} color="#374151" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchWrap}>
        <Search size={18} color="#9CA3AF" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for categories..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {!fromShop && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>All Shops</Text>
            {dummyShops.map((shop) => (
              <ShopCard
                key={shop.id}
                shop={shop}
                onPress={() =>
                  navigation.navigate('ShopCategories' as never, {
                    shopId: shop.id,
                    shopName: shop.name,
                  } as never)
                }
              />
            ))}
          </View>
        )}
        {sections.map((section) => {
          const filteredItems = searchQuery
            ? section.items.filter((item) =>
                item.label.toLowerCase().includes(searchQuery.toLowerCase())
              )
            : section.items;
          if (filteredItems.length === 0) return null;

          return (
            <View key={section.title} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <View style={styles.grid}>
                {filteredItems.map((item, idx) => (
                  <CategoryCard
                    key={item.label}
                    label={item.label}
                    imageSeed={item.imageSeed}
                    index={idx}
                    onPress={() =>
                      navigation.navigate('CategoryProducts' as never, {
                        categoryName: item.label,
                        shopId: params.shopId,
                        shopName: params.shopName,
                        fromCategories: true,
                      } as never)
                    }
                  />
                ))}
              </View>
            </View>
          );
        })}
      </ScrollView>
      {fromShop && cartItemCount > 0 && shouldShowCheckoutBar && <CartBar aboveTabBar={false} />}
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backBtn: {
    marginRight: 8,
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIconBtn: {
    padding: 4,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    padding: 0,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  card: {
    width: '33.33%',
    paddingHorizontal: 6,
    marginBottom: 16,
  },
  cardInner: {
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardImage: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 11,
    color: '#111827',
    textAlign: 'center',
    fontWeight: '500',
  },
});
