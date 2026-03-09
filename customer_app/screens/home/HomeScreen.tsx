import React, { useMemo, useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Modal, Image, Animated, Easing, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronDown, MapPin, Search } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Header } from '@/components/Header';
import { SearchBar } from '@/components/SearchBar';
import { CategoryCard } from '@/components/CategoryCard';
import { ShopCard } from '@/components/ShopCard';
import { ProductCard } from '@/components/ProductCard';
import { dummyShops } from '@/data/shops';
import { dummyProducts } from '@/data/products';
import { useAuth } from '@/context/AuthContext';
import { useOrder } from '@/context/OrderContext';
import { Compact } from '@/ui/compact';

const quickTiles = [
  {
    id: '1zone-veggies',
    label: '1zone veggies',
    image:
      'https://images.pexels.com/photos/839725/pexels-photo-839725.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    id: 'fruits',
    label: 'Fruits',
    image:
      'https://images.pexels.com/photos/1128678/pexels-photo-1128678.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    id: 'new',
    label: 'New Launches',
    image:
      'https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    id: 'decor',
    label: 'Home Decor',
    image:
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    id: 'dairy',
    label: 'Dairy',
    image:
      'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    id: 'snacks',
    label: 'Snacks',
    image:
      'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
] as const;

export const HomeScreen: React.FC = () => {
  const router = useRouter();
  const { user, addresses, selectedAddressIndex, selectAddress } = useAuth();
  const { currentOrder } = useOrder();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<string>(quickTiles[0].id);
  const [addressPickerOpen, setAddressPickerOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const quickScrollRef = useRef<ScrollView | null>(null);
  const [quickContentWidth, setQuickContentWidth] = useState(0);
  const [quickContainerWidth, setQuickContainerWidth] = useState(0);

  useEffect(() => {
    if (!quickScrollRef.current) return;
    if (quickContainerWidth === 0 || quickContentWidth <= quickContainerWidth) return;

    let animId: number;
    let started = false;

    const delayTimer = setTimeout(() => {
      let offset = 0;
      const maxOffset = quickContentWidth - quickContainerWidth;
      let lastTimestamp: number | null = null;
      const SPEED = 38; // pixels per second

      const step = (timestamp: number) => {
        if (lastTimestamp !== null) {
          const delta = timestamp - lastTimestamp;
          offset += (SPEED * delta) / 1000;
          if (offset > maxOffset) offset = 0;
          quickScrollRef.current?.scrollTo({ x: offset, y: 0, animated: false });
        }
        lastTimestamp = timestamp;
        animId = requestAnimationFrame(step);
      };

      started = true;
      animId = requestAnimationFrame(step);
    }, 3000);

    return () => {
      clearTimeout(delayTimer);
      if (started) cancelAnimationFrame(animId);
    };
  }, [quickContentWidth, quickContainerWidth]);

  const selectedAddress = user?.address;

  const handleShopPress = (shopId: string, shopName?: string) => {
    const name = shopName ?? dummyShops.find((s) => s.id === shopId)?.name ?? '';
    router.push({ pathname: '/store/categories', params: { shopId, shopName: name } });
  };

  const handleProductPress = (product: typeof dummyProducts[0]) => {
    const shop = dummyShops.find(s => s.id === product.shopId);
    router.push({
      pathname: '/product/[productId]',
      params: {
        categoryName: product.category,
        shopId: product.shopId,
        shopName: shop?.name,
        productId: product.id,
        fromProduct: 'true',
      },
    });
  };

  const HOME_PRODUCT_LIMIT = 40;

  const groupedByCategory = useMemo(() => {
    const groups: Record<string, typeof dummyProducts> = {};
    let count = 0;
    dummyProducts.forEach((product) => {
      if (count >= HOME_PRODUCT_LIMIT) return;
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return;
      }
      const key = product.category;
      if (!groups[key]) groups[key] = [];
      groups[key].push(product);
      count++;
    });
    return groups;
  }, [searchQuery]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentWrapper}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Header
            user={user}
            selectedAddress={selectedAddress}
            onProfilePress={() => setProfileModalOpen(true)}
            onAddressPress={() => setAddressPickerOpen(true)}
          />

          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          {/* Promotional Banner */}
          <View style={styles.promoBanner}>
            <View style={styles.promoContent}>
              <View style={styles.promoTextSection}>
                <Text style={styles.promoTitle}>Go to premium now!</Text>
                <Text style={styles.promoDescription}>
                  Cook with love, bring the flavors of the world to your table.
                </Text>
                <TouchableOpacity style={styles.promoButton}>
                  <Text style={styles.promoButtonText}>Start 5-day FREE Trial</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.promoImageSection}>
                <Image
                  source={{ uri: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=200' }}
                  style={styles.promoImage}
                  resizeMode="cover"
                />
              </View>
            </View>
          </View>

          {/* Quick tiles */}
          <ScrollView
            ref={quickScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.quickTilesWrap}
            contentContainerStyle={styles.quickTilesContent}
            onContentSizeChange={(w) => setQuickContentWidth(w)}
            onLayout={(e) => setQuickContainerWidth(e.nativeEvent.layout.width)}
          >
            {quickTiles.map((t) => (
              <CategoryCard
                key={t.id}
                id={t.id}
                label={t.label}
                image={t.image}
                isActive={selectedTab === t.id}
                onPress={() => setSelectedTab(t.id)}
              />
            ))}
          </ScrollView>

          {/* Products grid */}
          <View style={styles.featuredSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderTitle}>All Items</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.featuredGrid}>
              {dummyProducts.slice(0, 21).map((product) => (
                <View key={product.id} style={styles.featuredGridItem}>
                  <ProductCard product={product} />
                </View>
              ))}
            </View>
          </View>

          {/* Help & Support Section */}
          <View style={styles.helpSection}>
            <LinearGradient
              colors={['#111827', '#1F2937']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.helpGradient}
            >
              <View style={styles.helpHeader}>
                <View style={styles.helpIconCircle}>
                  <Text style={styles.helpIconText}>?</Text>
                </View>
                <View>
                  <Text style={styles.helpTitle}>Help & Support</Text>
                  <Text style={styles.helpSubtitle}>Available 24/7 for you</Text>
                </View>
              </View>
              <View style={styles.helpContent}>
                <View style={[styles.helpItem, { borderLeftWidth: 3, borderLeftColor: '#F97316' }]}>
                  <Text style={styles.helpLabel}>Official Email</Text>
                  <Text style={styles.helpValue}>nimbasket.official@gmail.com</Text>
                </View>
                <View style={[styles.helpItem, { borderLeftWidth: 3, borderLeftColor: '#F97316' }]}>
                  <Text style={styles.helpLabel}>Contact Support</Text>
                  <Text style={styles.helpValue}>7200729718</Text>
                </View>
              </View>
              <View style={styles.helpDesignElement} />
            </LinearGradient>
          </View>

          {/* Nearby Shops */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Nearby Shops</Text>
            {dummyShops.map((shop) => (
              <ShopCard
                key={shop.id}
                shop={shop}
                onPress={() => handleShopPress(shop.id, shop.name)}
              />
            ))}
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </View>

      {/* Live order badge at bottom of Home while not delivered */}
      {currentOrder && currentOrder.status !== 'delivered' && (
        <TouchableOpacity
          activeOpacity={0.9}
          style={[styles.liveOrderBar, { bottom: insets.bottom + 76 }]}
          onPress={() =>
            router.push({
              pathname: '/tracking',
              params: { orderId: String(currentOrder.id), noAutoRedirect: 'true' },
            })
          }
        >
          <View style={styles.liveOrderTextWrap}>
            <Text style={styles.liveOrderTitle} numberOfLines={1}>
              Order #{currentOrder.id} · {currentOrder.shopName}
            </Text>
            <Text style={styles.liveOrderSub} numberOfLines={1}>
              Status: {currentOrder.status.replace(/_/g, ' ')}
            </Text>
          </View>
          <Text style={styles.liveOrderLink}>View</Text>
        </TouchableOpacity>
      )}

      <Modal
        visible={profileModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setProfileModalOpen(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setProfileModalOpen(false)}
          style={styles.modalOverlay}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Profile details</Text>
            <View style={styles.profileDetailRow}>
              <Text style={styles.profileDetailLabel}>Name</Text>
              <Text style={styles.profileDetailValue}>{user?.name || 'Guest User'}</Text>
            </View>
            <View style={styles.profileDetailRow}>
              <Text style={styles.profileDetailLabel}>Phone</Text>
              <Text style={styles.profileDetailValue}>{user?.phone || '—'}</Text>
            </View>
            <View style={styles.profileDetailRow}>
              <Text style={styles.profileDetailLabel}>Email</Text>
              <Text style={styles.profileDetailValue}>{user?.email || '—'}</Text>
            </View>
            <View style={styles.profileDetailRow}>
              <Text style={styles.profileDetailLabel}>Address</Text>
              <Text style={styles.profileDetailValue} numberOfLines={3}>
                {user?.address ? `${user.address.street}, ${user.address.city} - ${user.address.pincode}` : '—'}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.profileCloseBtn}
              onPress={() => setProfileModalOpen(false)}
            >
              <Text style={styles.profileCloseBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={addressPickerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setAddressPickerOpen(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setAddressPickerOpen(false)}
          style={styles.modalOverlay}
        >
          <TouchableOpacity activeOpacity={1} style={styles.modalCard}>
            <Text style={styles.modalTitle}>Choose delivery address</Text>

            {addresses.length > 1 ? (
              <View style={styles.addressList}>
                {addresses.map((addr, idx) => {
                  const isSelected = idx === selectedAddressIndex;
                  return (
                    <TouchableOpacity
                      key={`${addr.street}-${idx}`}
                      activeOpacity={0.85}
                      onPress={() => {
                        selectAddress(idx);
                        setAddressPickerOpen(false);
                      }}
                      style={[styles.addressRow, isSelected && styles.addressRowSelected]}
                    >
                      <Text style={[styles.addressRowText, isSelected && styles.addressRowTextSelected]} numberOfLines={2}>
                        {addr.street}, {addr.city} - {addr.pincode}
                      </Text>
                      {isSelected ? <Text style={styles.selectedMark}>Selected</Text> : null}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : (
              <Text style={styles.modalSub}>
                No other saved address. Add a new address to switch delivery location.
              </Text>
            )}

            <TouchableOpacity
              style={styles.addAddressBtn}
              onPress={() => {
                setAddressPickerOpen(false);
                router.push('/profile/address-map');
              }}
            >
              <Text style={styles.addAddressBtnText}>Add New Address</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefefe',
  },
  orangeHeader: {
    paddingTop: 8,
    paddingBottom: Compact.space.xxl,
    paddingHorizontal: Compact.space.xl,
    position: 'relative',
    overflow: 'hidden',
  },
  headerOverlay: {
    display: 'none',
  },
  contentWrapper: {
    flex: 1,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 600 : '100%',
    alignSelf: 'center',
    backgroundColor: '#fefefe',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Compact.space.xl,
  },
  userProfileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: Compact.image.avatar,
    height: Compact.image.avatar,
    borderRadius: Compact.image.avatar / 2,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Compact.space.md,
  },
  avatarText: {
    fontSize: Compact.font.xxl,
    fontWeight: '700',
    color: '#F97316',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: Compact.font.xxxl,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 4,
  },
  userAddress: {
    fontSize: Compact.font.md,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  greetingSection: {
    marginTop: 8,
  },
  greetingTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  greetingHi: {
    fontSize: Compact.font.lg,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.95)',
    letterSpacing: 0.5,
  },
  greetingTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 3,
  },
  greetingSubtitle: {
    fontSize: Compact.font.md,
    fontWeight: '500',
    letterSpacing: 0.8,
    color: 'rgba(255, 255, 255, 0.92)',
  },
  searchWrapper: {
    paddingHorizontal: Compact.space.xl,
    marginTop: -10,
    marginBottom: Compact.space.xl,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E7E5E4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1C1917',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-start',
    paddingTop: 80,
    paddingHorizontal: 16,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 10,
  },
  profileDetailRow: {
    marginBottom: 14,
  },
  profileDetailLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  profileDetailValue: {
    fontSize: 15,
    color: '#111827',
  },
  profileCloseBtn: {
    backgroundColor: '#111827',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  profileCloseBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalSub: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 12,
  },
  addressList: {
    marginBottom: 12,
  },
  addressRow: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  addressRowSelected: {
    borderColor: '#22C55E',
    backgroundColor: '#F0FDF4',
  },
  addressRowText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  addressRowTextSelected: {
    color: '#166534',
  },
  selectedMark: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '800',
    color: '#16A34A',
  },
  addAddressBtn: {
    backgroundColor: '#22C55E',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  addAddressBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  searchButton: {
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  section: {
    paddingHorizontal: Compact.space.xl,
  },
  sectionTitle: {
    fontSize: Compact.font.xxxl,
    fontWeight: '700',
    color: '#292524',
    marginBottom: Compact.space.xl,
  },
  productSection: {
    marginBottom: 24,
  },
  productSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  productGridItem: {
    width: '33.33%',
    paddingHorizontal: 6,
    marginBottom: 12,
  },

  promoBanner: {
    backgroundColor: '#1F2937',
    marginHorizontal: Compact.space.xl,
    marginBottom: Compact.space.xxl,
    borderRadius: 20,
    overflow: 'hidden',
    minHeight: 180,
  },
  promoContent: {
    flexDirection: 'row',
    padding: 20,
  },
  promoTextSection: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 12,
  },
  promoTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  promoDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 20,
    marginBottom: 16,
  },
  promoButton: {
    backgroundColor: '#F97316',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  promoButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  promoImageSection: {
    width: 120,
    height: 140,
    borderRadius: 12,
    overflow: 'hidden',
  },
  promoImage: {
    width: '100%',
    height: '100%',
  },
  quickTilesWrap: {
    marginBottom: Compact.space.xl,
  },
  quickTilesContent: {
    paddingHorizontal: Compact.space.xl,
    gap: 14,
  },
  quickTile: {
    width: 72,
    alignItems: 'center',
  },
  quickIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#E7E5E4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  quickIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },
  quickIconCircleImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  quickIcon: {
    width: 46,
    height: 46,
    borderRadius: 12,
  },
  quickLabel: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '700',
    color: '#292524',
    textAlign: 'center',
    lineHeight: 14,
    minHeight: 28,
  },
  quickLabelActive: {
    fontWeight: '800',
    color: '#EA580C',
  },
  quickUnderline: {
    marginTop: 6,
    height: 2,
    width: 24,
    borderRadius: 1,
    backgroundColor: 'transparent',
  },
  quickUnderlineActive: {
    backgroundColor: '#EA580C',
  },
  featuredSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#292524',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F97316',
  },
  featuredGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Compact.space.xl,
    marginHorizontal: -Compact.space.sm,
  },
  featuredGridItem: {
    width: '33.33%',
    paddingHorizontal: Compact.space.sm,
    marginBottom: Compact.space.md,
  },
  liveOrderBar: {
    position: 'absolute',
    left: Compact.space.xl,
    right: Compact.space.xl,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: Compact.radius.xl,
    paddingVertical: Compact.space.md,
    paddingHorizontal: Compact.space.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    minHeight: 56,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  liveOrderTextWrap: {
    flex: 1,
    minWidth: 0,
    paddingRight: 12,
  },
  liveOrderTitle: {
    color: '#111827',
    fontSize: Compact.font.xxl,
    fontWeight: '700',
  },
  liveOrderSub: {
    marginTop: 4,
    color: '#6B7280',
    fontSize: Compact.font.md,
  },
  liveOrderLink: {
    color: '#22C55E',
    fontWeight: '700',
    fontSize: Compact.font.lg,
  },
  appInfoSection: {
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  appHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  appLogo: {
    width: 60,
    height: 60,
    marginRight: 12,
  },
  appTextContainer: {
    flex: 1,
  },
  appName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
    textTransform: 'lowercase',
  },
  appDescription: {
    fontSize: 14,
    color: '#F9FAFB',
    lineHeight: 20,
  },
  badgesScrollContainer: {
    marginTop: 4,
  },
  badgesContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 16,
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    marginRight: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  helpSection: {
    marginHorizontal: 16,
    marginTop: 24,
    borderRadius: 20,
    overflow: 'hidden',
  },
  helpGradient: {
    padding: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  helpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
    zIndex: 2,
  },
  helpIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpIconText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  helpSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
  helpContent: {
    gap: 16,
    zIndex: 2,
  },
  helpItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    borderRadius: 12,
  },
  helpLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  helpValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  helpDesignElement: {
    position: 'absolute',
    right: -20,
    bottom: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(249, 115, 22, 0.1)',
  },
});

