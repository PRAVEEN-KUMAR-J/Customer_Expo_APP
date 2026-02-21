import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Heart } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { navigateToWishlist } from '../navigation/rootNavigationRef';

export const FloatingWishlistButton: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  // Hide on login screen / logged out
  if (!user) return null;

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={navigateToWishlist}
        style={[styles.btn, { top: insets.top + 12 }]}
      >
        <Heart size={20} color="#EF4444" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  btn: {
    position: 'absolute',
    right: 14,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
});

