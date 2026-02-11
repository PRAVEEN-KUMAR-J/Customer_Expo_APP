import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Home as HomeIcon, Briefcase, QrCode, LogOut, Pencil } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { Address } from '../../data/users';

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, updateUser, logout } = useAuth();

  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [addresses, setAddresses] = useState<Address[]>(
    user?.addresses && user.addresses.length > 0
      ? user.addresses
      : user
      ? [
          {
            ...user.address,
            id: user.address.id || 'home',
            label: user.address.label || 'Home',
            isDefault: true,
          },
        ]
      : [],
  );

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone);
      if (user.addresses && user.addresses.length > 0) {
        setAddresses(user.addresses);
      } else {
        setAddresses([
          {
            ...user.address,
            id: user.address.id || 'home',
            label: user.address.label || 'Home',
            isDefault: true,
          },
        ]);
      }
    }
  }, [user]);

  const updateAddressAt = (index: number, partial: Partial<Address>) => {
    setAddresses((prev) =>
      prev.map((addr, i) =>
        i === index
          ? {
              ...addr,
              ...partial,
              location: {
                ...addr.location,
                ...(partial.location ?? {}),
              },
            }
          : addr,
      ),
    );
  };

  const handleSave = () => {
    if (!user || addresses.length === 0) return;

    const primary = addresses.find((a) => a.isDefault) ?? addresses[0];

    updateUser({
      name,
      email,
      phone,
      address: primary,
      addresses,
    });
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerSide}>
            <ChevronLeft
              size={22}
              color="#111827"
              onPress={() => navigation.goBack()}
            />
          </View>
          <Text style={styles.headerTitle}>My Profile</Text>
          <View style={styles.headerSide} />
        </View>

        {/* Avatar + Name */}
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitials}>
              {name
                .split(' ')
                .filter(Boolean)
                .slice(0, 2)
                .map((part) => part[0]?.toUpperCase())
                .join('') || 'U'}
            </Text>
          </View>
          <Text style={styles.name}>{name || 'Your Name'}</Text>
        </View>

        {/* Personal Information Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.statusDot} />
            <Text style={styles.cardTitle}>Personal Information</Text>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Full Name</Text>
            <View style={styles.fieldBox}>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Your full name"
                style={styles.fieldInput}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Email Address</Text>
            <View style={styles.fieldBox}>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.fieldInput}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Phone Number</Text>
            <View style={styles.fieldBox}>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="+1 (555) 123-4567"
                keyboardType="phone-pad"
                style={styles.fieldInput}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>
        </View>

        {/* Saved Addresses */}
        <View style={styles.cardSecondary}>
          <View style={styles.cardHeader}>
            <View style={styles.statusDot} />
            <Text style={styles.cardTitle}>Saved Addresses</Text>
            <TouchableOpacity activeOpacity={0.8} onPress={() => {
              setAddresses((prev) => {
                const baseLocation =
                  prev[0]?.location ??
                  (user
                    ? user.address.location
                    : { latitude: 0, longitude: 0 });

                return [
                  ...prev,
                  {
                    id: `addr-${Date.now()}`,
                    label: 'New Address',
                    street: '',
                    city: '',
                    pincode: '',
                    location: baseLocation,
                  },
                ];
              });
            }}>
              <Text style={styles.addNewText}>+ Add New</Text>
            </TouchableOpacity>
          </View>

          {addresses.map((addr, index) => {
            const isPrimary = addr.isDefault || index === 0;
            const IconComponent =
              addr.label.toLowerCase() === 'home'
                ? HomeIcon
                : addr.label.toLowerCase() === 'work'
                ? Briefcase
                : HomeIcon;

            return (
              <View key={addr.id} style={styles.addressItem}>
                <View style={styles.addressIconWrapper}>
                  <IconComponent
                    size={20}
                    color={isPrimary ? '#F97316' : '#3B82F6'}
                  />
                </View>
                <View style={styles.addressContent}>
                  <View style={styles.addressHeaderRow}>
                    <Text style={styles.addressLabel}>
                      {addr.label || (isPrimary ? 'Home' : 'Address')}
                    </Text>
                    <View style={styles.addressActions}>
                      {isPrimary ? (
                        <Text style={styles.defaultBadge}>Default</Text>
                      ) : (
                        <TouchableOpacity
                          onPress={() =>
                            setAddresses((prev) =>
                              prev
                                .map((a, i) => ({
                                  ...a,
                                  isDefault: i === index,
                                }))
                            )
                          }
                        >
                          <Text style={styles.makeDefaultText}>
                            Make Default
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                  <TextInput
                    value={addr.street}
                    onChangeText={(text) =>
                      updateAddressAt(index, { street: text })
                    }
                    multiline
                    placeholder="Street, apartment"
                    style={styles.addressText}
                    placeholderTextColor="#9CA3AF"
                  />
                  <View style={styles.addressRow}>
                    <TextInput
                      value={addr.city}
                      onChangeText={(text) =>
                        updateAddressAt(index, { city: text })
                      }
                      placeholder="City"
                      style={[styles.addressText, styles.addressHalf]}
                      placeholderTextColor="#9CA3AF"
                    />
                    <TextInput
                      value={addr.pincode}
                      onChangeText={(text) =>
                        updateAddressAt(index, { pincode: text })
                      }
                      placeholder="Pincode"
                      keyboardType="numeric"
                      style={[styles.addressText, styles.addressHalf]}
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Share application */}
        <View style={styles.cardSecondary}>
          <View style={styles.cardHeaderSimple}>
            <View style={styles.statusDot} />
            <Text style={styles.cardTitle}>Share Application</Text>
          </View>
          <TouchableOpacity style={styles.qrButton} activeOpacity={0.8}>
            <QrCode size={20} color="#111827" />
            <Text style={styles.qrButtonText}>Show QR Code</Text>
          </TouchableOpacity>
        </View>

        {/* Logout and Save / Edit buttons */}
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={styles.logoutButton}
            activeOpacity={0.8}
            onPress={handleLogout}
          >
            <LogOut size={18} color="#DC2626" />
            <Text style={styles.logoutText}>Log Out Securely</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.9}
            onPress={handleSave}
          >
            <Pencil size={18} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Save Profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  headerSide: {
    width: 40,
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarInitials: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardSecondary: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardHeaderSimple: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F97316',
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  addNewText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#22C55E',
  },
  fieldGroup: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9CA3AF',
    marginBottom: 6,
  },
  fieldBox: {
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  fieldValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  fieldInput: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  addressItem: {
    flexDirection: 'row',
    paddingVertical: 12,
  },
  addressIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  addressContent: {
    flex: 1,
  },
  addressHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  addressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  addressActions: {
    flexDirection: 'row',
    gap: 8,
  },
  addressText: {
    fontSize: 13,
    color: '#4B5563',
    marginTop: 2,
  },
  addressStaticText: {
    fontSize: 13,
    color: '#4B5563',
    marginTop: 4,
  },
  addressRow: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  addressHalf: {
    flex: 1,
  },
  cardSecondaryDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  qrButton: {
    marginTop: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
  },
  qrButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  actionSection: {
    marginTop: 24,
    gap: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 999,
    backgroundColor: '#FEF2F2',
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#DC2626',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 999,
    backgroundColor: '#111827',
  },
  primaryButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

