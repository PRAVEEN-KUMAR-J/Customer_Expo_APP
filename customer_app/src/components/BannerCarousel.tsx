import React, { useEffect, useRef, useState } from 'react';
import { View, ScrollView, Image, Text, StyleSheet, Dimensions, TouchableOpacity, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { dummyBanners } from '../data/banners';

const { width: screenWidth } = Dimensions.get('window');

interface BannerCarouselProps {
  onBannerPress?: (banner: any) => void;
}

export const BannerCarousel: React.FC<BannerCarouselProps> = ({ onBannerPress }) => {
  const scrollRef = useRef<ScrollView | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!dummyBanners.length) return;

    const id = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % dummyBanners.length;
        scrollRef.current?.scrollTo({
          x: next * screenWidth,
          y: 0,
          animated: true,
        });
        return next;
      });
    }, 4000);

    return () => clearInterval(id);
  }, []);

  const handleMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / screenWidth);
    setCurrentIndex(index);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        style={styles.scrollView}
        onMomentumScrollEnd={handleMomentumEnd}
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