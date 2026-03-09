import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MapPin, MoreVertical } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';

export const SavedAddressesScreen: React.FC = () => {
  const router = useRouter();
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();
  const { addresses, deleteAddress, selectedAddressIndex, selectAddress } = useAuth();
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backArrow}>{'‹'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Addresses</Text>
      </View>

      <TouchableOpacity
        style={styles.addNewButton}
        onPress={() => router.push('/profile/address-map')}
      >
        <Text style={styles.addNewPlus}>＋</Text>
        <Text style={styles.addNewText}>Add New Address</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Saved Addresses</Text>

      {addresses.map((address, index) => {
        const isSelected = index === selectedAddressIndex;
        return (
        <TouchableOpacity
          key={`${address.street}-${index}`}
          activeOpacity={0.85}
          onPress={() => {
            selectAddress(index);
            if (returnTo === 'Payment') {
              router.back();
            }
          }}
          style={[
            styles.addressCard,
            isSelected && styles.addressCardSelected,
          ]}
        >
          <View style={styles.addressLeft}>
            <View style={styles.addressIconCircle}>
              <MapPin size={18} color={isSelected ? '#16A34A' : '#111827'} />
            </View>
            <View>
              <View style={styles.addressTitleRow}>
                <Text style={styles.addressLabel}>Other</Text>
                {isSelected && (
                  <View style={styles.selectedBadge}>
                    <Text style={styles.selectedBadgeText}>Selected</Text>
                  </View>
                )}
              </View>
              <Text style={styles.addressText} numberOfLines={2}>
                {address.street}, {address.city}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => {
              setActiveIndex(index);
              setOptionsVisible(true);
            }}
          >
            <MoreVertical size={20} color="#6B7280" />
          </TouchableOpacity>
        </TouchableOpacity>
      )})}

      <Modal
        visible={optionsVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setOptionsVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.bottomSheet}>
            <Text style={styles.sheetTitle}>Other</Text>
            {activeIndex !== null && addresses[activeIndex] && (
              <Text style={styles.sheetSubtitle}>
                {addresses[activeIndex].street}, {addresses[activeIndex].city}
              </Text>
            )}

            <TouchableOpacity
              style={styles.sheetItem}
              onPress={() => {
                if (activeIndex === null) return;
                setOptionsVisible(false);
                router.push({
                  pathname: '/profile/address-details',
                  params: { mode: 'edit', index: String(activeIndex) },
                });
              }}
            >
              <Text style={styles.sheetItemText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sheetItem}
              onPress={() => {
                if (activeIndex === null) return;
                deleteAddress(activeIndex);
                setOptionsVisible(false);
                setActiveIndex(null);
              }}
            >
              <Text style={[styles.sheetItemText, styles.deleteText]}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backArrow: {
    fontSize: 24,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  addNewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F3E8FF',
  },
  addNewPlus: {
    fontSize: 20,
    color: '#EC4899',
    marginRight: 8,
  },
  addNewText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#EC4899',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 12,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  addressCardSelected: {
    borderColor: '#22C55E',
    backgroundColor: '#F0FDF4',
  },
  addressLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  addressIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  addressTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  addressLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginRight: 8,
  },
  selectedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: '#DCFCE7',
  },
  selectedBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#16A34A',
  },
  addressText: {
    fontSize: 13,
    color: '#4B5563',
    flexShrink: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  sheetSubtitle: {
    fontSize: 13,
    color: '#4B5563',
    marginBottom: 16,
  },
  sheetItem: {
    paddingVertical: 12,
  },
  sheetItemText: {
    fontSize: 15,
    color: '#111827',
  },
  deleteText: {
    color: '#DC2626',
  },
});


