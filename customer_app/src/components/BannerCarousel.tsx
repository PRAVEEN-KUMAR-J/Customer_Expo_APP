import React from 'react';
import { View, ScrollView, Image, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { dummyBanners } from '../data/banners';

const { width: screenWidth } = Dimensions.get('window');

interface BannerCarouselProps {
  onBannerPress?: (banner: any) => void;
}

export const BannerCarousel: React.FC<BannerCarouselProps> = ({ onBannerPress }) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        style={styles.scrollView}
      >
        {dummyBanners.map((banner) => (
          <TouchableOpacity
            key={banner.id}
            style={[styles.bannerContainer, { backgroundColor: banner.backgroundColor }]}
            onPress={() => onBannerPress?.(banner)}
          >
            <View style={styles.textContainer}>
              <Text style={styles.title}>{banner.title}</Text>
              <Text style={styles.subtitle}>{banner.subtitle}</Text>
            </View>
            <Image source={{ uri: banner.image }} style={styles.bannerImage} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  scrollView: {
    height: 140,
  },
  bannerContainer: {
    width: screenWidth - 32,
    marginHorizontal: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 18,
  },
  bannerImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginLeft: 16,
  },
});