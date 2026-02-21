import React, { useMemo, useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Modal, Image, Animated, Easing } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import MaskedView from '@react-native-masked-view/masked-view';
import { ChevronDown, MapPin, Search, Heart } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { ShopCard } from '../../components/ShopCard';
import { ProductCard } from '../../components/ProductCard';
import { dummyShops } from '../../data/shops';
import { dummyProducts } from '../../data/products';
import { useAuth } from '../../context/AuthContext';
import { useOrder } from '../../context/OrderContext';

const topTabs = ['All', 'Wedding Store', 'Fashion', 'Electronics', 'Beauty', 'Baby Care', 'Home Decor', 'Snacks'];

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, addresses, selectedAddressIndex, selectAddress } = useAuth();
  const { currentOrder } = useOrder();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<string>('All');
  const [addressPickerOpen, setAddressPickerOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const BRAND_TEXT = 'NimBasket';
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateX = useRef(new Animated.Value(-28)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleTranslateY = useRef(new Animated.Value(14)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 520,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(titleTranslateX, {
          toValue: 0,
          duration: 520,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(subtitleOpacity, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(subtitleTranslateY, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [titleOpacity, titleTranslateX, subtitleOpacity, subtitleTranslateY]);

  const handleShopPress = (shopId: string, shopName?: string) => {
    const name = shopName ?? dummyShops.find((s) => s.id === shopId)?.name ?? '';
    navigation.navigate('ShopCategories' as never, { shopId, shopName: name } as never);
  };

  const handleProductPress = (product: typeof dummyProducts[0]) => {
    const shop = dummyShops.find(s => s.id === product.shopId);
    navigation.navigate('CategoryProducts' as never, {
      categoryName: product.category,
      shopId: product.shopId,
      shopName: shop?.name,
      productId: product.id,
      fromProduct: true,
    } as never);
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
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section - Blur background */}
        <View style={styles.orangeHeader}>
          <BlurView intensity={70} tint="dark" style={StyleSheet.absoluteFill} />
          <View style={styles.headerBlurTint} />
          {/* User Profile and Action Icons */}
          <View style={styles.headerTop}>
            <View style={styles.userProfileSection}>
              <TouchableOpacity
                onPress={() => setProfileModalOpen(true)}
                activeOpacity={0.8}
                style={styles.avatarContainer}
              >
                <Text style={styles.avatarText}>
                  {(user?.name || 'GU')[0].toUpperCase()}
                </Text>
              </TouchableOpacity>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user?.name || 'Guest User'}</Text>
                <TouchableOpacity 
                  onPress={() => setAddressPickerOpen(true)}
                  activeOpacity={0.7}
                >
                  <View style={styles.addressContainer}>
                    <Text style={styles.userAddress} numberOfLines={1}>
                      {user?.address?.street || 'Current Location'}
                    </Text>
                    <ChevronDown size={16} color="rgba(255, 255, 255, 0.9)" />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Greeting Text - NimBasket with orange–red gradient shine + slide-in */}
          <View style={styles.greetingSection}>
            <Animated.View
              style={[
                styles.greetingTitleRow,
                {
                  opacity: titleOpacity,
                  transform: [{ translateX: titleTranslateX }],
                },
              ]}
            >
              <MaskedView
                style={styles.gradientTextMask}
                maskElement={
                  <View style={styles.gradientTextMaskInner}>
                    <Text style={styles.greetingTitleMask}>{BRAND_TEXT}</Text>
                  </View>
                }
              >
                <View style={styles.gradientTextFill}>
                  <LinearGradient
                    colors={['#DB2A2B', '#E57E2D']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={StyleSheet.absoluteFill}
                  />
                </View>
              </MaskedView>
            </Animated.View>
            <Animated.View
              style={{
                opacity: subtitleOpacity,
                transform: [{ translateY: subtitleTranslateY }],
              }}
            >
              <Text style={styles.greetingSubtitle}>Effortless shopping. Excellent speed.</Text>
            </Animated.View>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchWrapper}>
          <View style={styles.searchContainer}>
            <Search size={20} color="#6B7280" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity style={styles.filterIcon}>
              <View style={styles.filterDots}>
                <View style={styles.filterDot} />
                <View style={styles.filterDot} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

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

        {/* Category Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryFiltersContainer}
          contentContainerStyle={styles.categoryFiltersContent}
        >
          <TouchableOpacity style={styles.categoryFilter}>
            <Text style={styles.categoryFilterText}>See All</Text>
          </TouchableOpacity>
          {topTabs.slice(1, 5).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setSelectedTab(tab)}
              style={[
                styles.categoryFilter,
                selectedTab === tab && styles.categoryFilterActive,
              ]}
            >
              <Text
                style={[
                  styles.categoryFilterText,
                  selectedTab === tab && styles.categoryFilterTextActive,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Featured Products - Line by Line */}
        <View style={styles.featuredSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderTitle}>
              240 Featured Products
            </Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.featuredProductsList}>
            {dummyProducts.slice(0, 20).map((product) => {
              const shop = dummyShops.find(s => s.id === product.shopId);
              return (
                <TouchableOpacity 
                  key={product.id} 
                  style={styles.featuredProductRow}
                  onPress={() => handleProductPress(product)}
                >
                  <View style={styles.featuredProductImageContainer}>
                    <Image 
                      source={{ uri: product.image }} 
                      style={styles.featuredProductImageRow}
                      resizeMode="cover"
                    />
                    <View style={styles.featuredProductOverlayRow}>
                      <Text style={styles.featuredProductTime}>20 Mins</Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.featuredProductHeartRow}
                      onPress={(e) => {
                        e.stopPropagation();
                        // Handle wishlist toggle
                      }}
                    >
                      <Heart size={16} color="#FFFFFF" fill="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.featuredProductInfoRow}>
                    <Text style={styles.featuredProductNameRow} numberOfLines={2}>
                      {product.name}
                    </Text>
                    <Text style={styles.featuredProductShopRow} numberOfLines={1}>
                      {shop?.name || 'Shop'}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
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
      </ScrollView>

      {/* Live order badge at bottom of Home while not delivered */}
      {currentOrder && currentOrder.status !== 'delivered' && (
        <TouchableOpacity
          activeOpacity={0.9}
          style={[styles.liveOrderBar, { bottom: insets.bottom + 76 }]}
          onPress={() =>
            navigation.navigate(
              'OrderTracking' as never,
              { orderId: currentOrder.id } as never,
            )
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
                navigation.navigate('AddressMap' as never);
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
    backgroundColor: '#FFFFFF',
  },
  orangeHeader: {
    paddingTop: 8,
    paddingBottom: 20,
    paddingHorizontal: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  headerBlurTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(100, 100, 100, 0.5)',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  userProfileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F97316',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
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
    fontSize: 15,
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
  gradientTextMask: {
    alignSelf: 'flex-start',
  },
  gradientTextMaskInner: {
    backgroundColor: 'transparent',
  },
  gradientTextFill: {
    height: 42,
    minWidth: 220,
  },
  greetingTitleMask: {
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 4,
    color: 'black',
  },
  greetingTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 4,
  },
  greetingSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.8,
    color: 'rgba(255, 255, 255, 0.92)',
  },
  searchWrapper: {
    paddingHorizontal: 16,
    marginTop: -10,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  filterIcon: {
    padding: 4,
  },
  filterDots: {
    flexDirection: 'row',
    gap: 4,
  },
  filterDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#6B7280',
  },
  promoBanner: {
    backgroundColor: '#1F2937',
    marginHorizontal: 16,
    marginBottom: 20,
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
  categoryFiltersContainer: {
    marginBottom: 20,
  },
  categoryFiltersContent: {
    paddingHorizontal: 16,
    gap: 10,
  },
  categoryFilter: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryFilterActive: {
    backgroundColor: '#F97316',
    borderColor: '#F97316',
  },
  categoryFilterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  categoryFilterTextActive: {
    color: '#FFFFFF',
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
    fontWeight: '700',
    color: '#111827',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F97316',
  },
  featuredProductsList: {
    paddingHorizontal: 16,
  },
  featuredProductRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featuredProductImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    marginRight: 12,
  },
  featuredProductImageRow: {
    width: '100%',
    height: '100%',
  },
  featuredProductOverlayRow: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  featuredProductTime: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  featuredProductHeartRow: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredProductInfoRow: {
    flex: 1,
    justifyContent: 'center',
  },
  featuredProductNameRow: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
    lineHeight: 22,
  },
  featuredProductShopRow: {
    fontSize: 14,
    color: '#6B7280',
  },
  liveOrderBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    minHeight: 80,
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
    fontSize: 18,
    fontWeight: '700',
  },
  liveOrderSub: {
    marginTop: 4,
    color: '#6B7280',
    fontSize: 14,
  },
  liveOrderLink: {
    color: '#22C55E',
    fontWeight: '700',
    fontSize: 16,
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
});