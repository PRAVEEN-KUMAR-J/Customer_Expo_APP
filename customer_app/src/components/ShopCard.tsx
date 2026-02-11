import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Star, Clock, MapPin } from 'lucide-react-native';
import { Shop } from '../data/shops';

interface ShopCardProps {
  shop: Shop;
  onPress: () => void;
}

export const ShopCard: React.FC<ShopCardProps> = ({ shop, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: shop.image }} style={styles.shopImage} />
      
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.shopName}>{shop.name}</Text>
          <View style={[styles.statusBadge, { backgroundColor: shop.isOpen ? '#22C55E' : '#EF4444' }]}>
            <Text style={styles.statusText}>{shop.isOpen ? 'Open' : 'Closed'}</Text>
          </View>
        </View>
        
        <View style={styles.infoRow}>
          <View style={styles.ratingContainer}>
            <Star size={14} color="#FFC107" fill="#FFC107" />
            <Text style={styles.rating}>{shop.rating}</Text>
          </View>
          
          <View style={styles.deliveryContainer}>
            <Clock size={14} color="#6B7280" />
            <Text style={styles.deliveryTime}>{shop.deliveryTime}</Text>
          </View>
        </View>
        
        <View style={styles.categoriesContainer}>
          {shop.categories.slice(0, 3).map((category, index) => (
            <View key={index} style={styles.categoryTag}>
              <Text style={styles.categoryText}>{category}</Text>
            </View>
          ))}
          {shop.categories.length > 3 && (
            <Text style={styles.moreText}>+{shop.categories.length - 3}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  shopImage: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  shopName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  rating: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginLeft: 4,
  },
  deliveryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryTime: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  categoriesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  categoryTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 12,
    color: '#6B7280',
  },
  moreText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
});