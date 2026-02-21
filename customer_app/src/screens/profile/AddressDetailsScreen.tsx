import React, { useRef, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';

export const AddressDetailsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { user, addresses, addAddress, updateAddress } = useAuth();

  const isEdit = route.params?.mode === 'edit';
  const editIndex: number = typeof route.params?.index === 'number' ? route.params.index : 0;
  const editingAddress = isEdit && addresses[editIndex] ? addresses[editIndex] : undefined;

  const prefillStreet: string | undefined = route.params?.street;
  const prefillCity: string | undefined = route.params?.city;
  const prefillDistrict: string | undefined = route.params?.district;
  const prefillPincode: string | undefined = route.params?.pincode;
  const prefillLocation: { latitude: number; longitude: number } | undefined =
    route.params?.location;

  const [house, setHouse] = useState(
    prefillStreet || editingAddress?.street || user?.address?.street || '',
  );
  const [area, setArea] = useState(
    prefillCity || editingAddress?.city || user?.address?.city || '',
  );
  const [district, setDistrict] = useState(
    prefillDistrict || editingAddress?.district || user?.address?.district || '',
  );
  const [label, setLabel] = useState('Other');
  const [showSuccess, setShowSuccess] = useState(false);

  const successScale = useRef(new Animated.Value(0.8)).current;
  const successOpacity = useRef(new Animated.Value(0)).current;

  const runSuccessAnimation = () => {
    setShowSuccess(true);
    successScale.setValue(0.8);
    successOpacity.setValue(0);

    Animated.parallel([
      Animated.timing(successOpacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.spring(successScale, {
        toValue: 1,
        friction: 6,
        tension: 120,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      setShowSuccess(false);
      navigation.goBack();
    }, 1200);
  };

  const handleSave = () => {
    const base = editingAddress || user?.address;

    const newAddress = {
      street: house,
      city: area,
      district: district,
      pincode: prefillPincode || base?.pincode || '',
      location: prefillLocation || base?.location || { latitude: 0, longitude: 0 },
    };

    if (isEdit) {
      updateAddress(editIndex, newAddress);
    } else {
      addAddress(newAddress);
    }
    runSuccessAnimation();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>{'‹'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEdit ? 'Edit address' : 'Add new address'}
        </Text>
      </View>

      <View style={styles.topBand} />

      <View style={styles.card}>
        <Text style={styles.label}>House No. & Floor *</Text>
        <TextInput
          style={styles.input}
          value={house}
          onChangeText={setHouse}
          placeholder="House no / Floor"
        />

        <Text style={styles.label}>Area / Locality *</Text>
        <TextInput
          style={styles.input}
          value={area}
          onChangeText={setArea}
          placeholder="Area / Locality"
        />

        <Text style={styles.label}>District *</Text>
        <TextInput
          style={styles.input}
          value={district}
          onChangeText={setDistrict}
          placeholder="District"
        />

        <Text style={styles.label}>Add Address Label</Text>
        <View style={styles.labelRow}>
          {['Home', 'Work', 'Other'].map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.chip, label === item && styles.chipActive]}
              onPress={() => setLabel(item)}
            >
              <Text style={[styles.chipText, label === item && styles.chipTextActive]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>
            {isEdit ? 'Update Address' : 'Save Address'}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal visible={showSuccess} transparent animationType="fade">
        <View style={styles.successOverlay}>
          <Animated.View
            style={[
              styles.successCard,
              { transform: [{ scale: successScale }], opacity: successOpacity },
            ]}
          >
            <View style={styles.successIconCircle}>
              <Text style={styles.successIconCheck}>✓</Text>
            </View>
            <Text style={styles.successTitle}>
              {isEdit ? 'Address updated' : 'Address added'}
            </Text>
            <Text style={styles.successSubtitle}>
              Your delivery address has been saved successfully.
            </Text>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backArrow: {
    fontSize: 24,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  topBand: {
    height: 60,
    backgroundColor: '#FDBA74',
    opacity: 0.9,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginBottom: 16,
  },
  card: {
    marginHorizontal: 16,
    marginTop: -32,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  labelRow: {
    flexDirection: 'row',
    marginTop: 12,
    marginBottom: 16,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  chipText: {
    fontSize: 13,
    color: '#4B5563',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: '#EC4899',
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  successOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successCard: {
    width: '78%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  successIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#BBF7D0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  successIconCheck: {
    fontSize: 30,
    color: '#15803D',
    fontWeight: '800',
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  successSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
  },
});

