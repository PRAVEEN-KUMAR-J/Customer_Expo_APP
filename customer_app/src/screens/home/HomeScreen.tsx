import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Search } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { BannerCarousel } from '../../components/BannerCarousel';
import { ShopCard } from '../../components/ShopCard';
import { dummyShops } from '../../data/shops';
import { useAuth } from '../../context/AuthContext';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuth();

  const handleShopPress = (shopId: string) => {
    navigation.navigate('ProductList' as never, { shopId } as never);
  };

  const handleBannerPress = (banner: any) => {
    if (banner.actionType === 'shop') {
      handleShopPress(banner.actionValue);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.locationContainer}>
            <MapPin size={20} color="#22C55E" />
            <View style={styles.locationText}>
              <Text style={styles.deliverTo}>Deliver to</Text>
              <Text style={styles.address} numberOfLines={1}>
                {user?.address.street || 'Current Location'}
              </Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.searchButton}>
            <Search size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Banner Carousel */}
        <BannerCarousel onBannerPress={handleBannerPress} />

        {/* Nearby Shops */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nearby Shops</Text>
          {dummyShops.map((shop) => (
            <ShopCard 
              key={shop.id} 
              shop={shop} 
              onPress={() => handleShopPress(shop.id)}
            />
          ))}
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationText: {
    marginLeft: 8,
    flex: 1,
  },
  deliverTo: {
    fontSize: 12,
    color: '#6B7280',
  },
  address: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
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
});