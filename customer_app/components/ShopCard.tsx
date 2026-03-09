import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Star } from 'lucide-react-native';
import { Shop } from '@/data/shops';

interface ShopCardProps {
  shop: Shop;
  onPress: () => void;
}

export const ShopCard: React.FC<ShopCardProps> = ({ shop, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.92}>
      <View style={styles.imageWrap}>
        <Image source={{ uri: shop.image }} style={styles.shopImage} />
        <View style={[styles.statusBadge, { backgroundColor: shop.isOpen ? '#16A34A' : '#DC2626' }]}>
          <Text style={styles.statusText}>{shop.isOpen ? 'Open' : 'Closed'}</Text>
        </View>
      </View>
      <View style={styles.content}>
        <Text style={styles.shopName} numberOfLines={1}>{shop.name}</Text>
        <View style={styles.metaRow}>
          <View style={styles.ratingWrap}>
            <Star size={14} color="#EAB308" fill="#EAB308" />
            <Text style={styles.rating}>{shop.rating}</Text>
          </View>
          <View style={styles.dot} />
          <Text style={styles.deliveryTime}>{shop.deliveryTime}</Text>
        </View>
        {/* Location row removed as requested */}
        <View style={styles.tagsRow}>
          {shop.categories.slice(0, 3).map((category, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{category}</Text>
            </View>
          ))}
          {shop.categories.length > 3 && (
            <Text style={styles.moreText}>+{shop.categories.length - 3}</Text>
          )}
        </View>
      </View>
      <View style={styles.chevronWrap}>
        <Text style={styles.chevron}>›</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F5F5F4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  imageWrap: {
    width: 96,
    height: 96,
    position: 'relative',
    borderRadius: 18,
    overflow: 'hidden',
    marginLeft: 12,
    marginVertical: 8,
    borderWidth: 2,
    borderColor: '#FFE4D5',
  },
  shopImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    backgroundColor: '#F5F5F4',
  },
  statusBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    minWidth: 0,
  },
  shopName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1917',
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 6,
  },
  rating: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1C1917',
    marginLeft: 4,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#A8A29E',
    marginRight: 6,
  },
  deliveryTime: {
    fontSize: 13,
    fontWeight: '500',
    color: '#57534E',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#78716C',
    flex: 1,
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    backgroundColor: '#F5F5F4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#57534E',
  },
  moreText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#78716C',
  },
  chevronWrap: {
    paddingRight: 14,
    paddingLeft: 4,
  },
  chevron: {
    fontSize: 24,
    fontWeight: '300',
    color: '#A8A29E',
  },
});
