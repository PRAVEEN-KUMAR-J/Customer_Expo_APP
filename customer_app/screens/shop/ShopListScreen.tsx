import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Search } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { ShopCard } from '@/components/ShopCard';
import { dummyShops } from '@/data/shops';
import { Compact } from '@/ui/compact';

export const ShopListScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const filteredShops = dummyShops.filter(shop =>
    shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shop.categories.some(category =>
      category.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleShopPress = (shopId: string, shopName: string) => {
    router.push({ pathname: '/store/categories', params: { shopId, shopName } });
  };

  const handleBackPress = () => {
    router.replace('/(tabs)/home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <View style={styles.headerLeftRow}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackPress}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <ArrowLeft size={22} color="#111827" />
            </TouchableOpacity>
            <View>
              <Text style={styles.headerTitle}>All Shops</Text>
              <Text style={styles.headerSubtitle}>Pick your favourite market nearby</Text>
            </View>
          </View>
        </View>
        <View style={styles.searchContainer}>
          <Search size={20} color="#6B7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search shops..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredShops.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No shops found</Text>
          </View>
        ) : (
          filteredShops.map((shop) => (
            <ShopCard
              key={shop.id}
              shop={shop}
              onPress={() => handleShopPress(shop.id, shop.name)}
            />
          ))
        )}
      </ScrollView>
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
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Compact.space.lg,
  },
  headerLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Compact.space.md,
  },
  backButton: {
    padding: Compact.space.xs,
  },
  headerTitle: {
    fontSize: Compact.font.xxxl,
    fontWeight: '700',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: Compact.font.sm,
    color: '#6B7280',
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
  content: {
    flex: 1,
    paddingHorizontal: Compact.space.xl,
    paddingTop: Compact.space.xl,
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

