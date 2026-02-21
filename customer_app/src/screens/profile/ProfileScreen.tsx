import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { HelpCircle, Heart, MapPin, ShoppingBag, User, Wallet } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';

export const ProfileScreen: React.FC = () => {
  const { user } = useAuth();
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        {/* Profile summary */}
        <TouchableOpacity
          style={styles.profileCard}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('ProfileDetails' as never)}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarInitial}>
              {(user?.name || 'U').charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.profileTextContainer}>
            <Text style={styles.profileName}>{user?.name || 'Guest User'}</Text>
            <Text style={styles.profilePhone}>{user?.phone || ''}</Text>
          </View>
        </TouchableOpacity>

        {/* Quick actions */}
        <View style={styles.quickActionsRow}>
          <ProfileQuickAction
            icon={<ShoppingBag size={22} color="#111827" />}
            label="Your Orders"
            onPress={() => navigation.navigate('Orders' as never)}
          />
          <ProfileQuickAction
            icon={<HelpCircle size={22} color="#111827" />}
            label="Help & Support"
            onPress={() => navigation.navigate('HelpSupport' as never)}
          />
          <ProfileQuickAction
            icon={<Heart size={22} color="#111827" />}
            label="Your Wishlist"
            onPress={() => navigation.navigate('Wishlist' as never)}
          />
        </View>

        {/* Your Information section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Information</Text>

          <ProfileListItem
            icon={<Wallet size={20} color="#111827" />}
            label="Your Refunds"
          />
          <ProfileListItem
            icon={<Heart size={20} color="#111827" />}
            label="Your Wishlist"
            onPress={() => navigation.navigate('Wishlist' as never)}
          />
          <ProfileListItem
            icon={<HelpCircle size={20} color="#111827" />}
            label="Help & Support"
            onPress={() => navigation.navigate('HelpSupport' as never)}
          />
          <ProfileListItem
            icon={<MapPin size={20} color="#111827" />}
            label="Saved Addresses"
            value={user?.address ? '1 Address' : undefined}
            onPress={() => navigation.navigate('SavedAddresses' as never)}
          />
          <ProfileListItem
            icon={<User size={20} color="#111827" />}
            label="Profile"
            onPress={() => navigation.navigate('ProfileDetails' as never)}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
}

const ProfileQuickAction: React.FC<QuickActionProps> = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.quickActionCard} activeOpacity={0.8} onPress={onPress}>
    {icon}
    <Text style={styles.quickActionLabel}>{label}</Text>
  </TouchableOpacity>
);

interface ListItemProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onPress?: () => void;
}

const ProfileListItem: React.FC<ListItemProps> = ({ icon, label, value, onPress }) => (
  <TouchableOpacity style={styles.listItem} activeOpacity={0.7} onPress={onPress}>
    <View style={styles.listItemLeft}>
      <View style={styles.listIconContainer}>{icon}</View>
      <Text style={styles.listLabel}>{label}</Text>
    </View>
    {value ? <Text style={styles.listValue}>{value}</Text> : null}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 24,
    fontWeight: '700',
    color: '#6B7280',
  },
  profileTextContainer: {
    marginLeft: 12,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  profilePhone: {
    marginTop: 4,
    fontSize: 14,
    color: '#6B7280',
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 16,
  },
  quickActionCard: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  quickActionLabel: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 12,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  listItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  listLabel: {
    fontSize: 15,
    color: '#111827',
  },
  listValue: {
    fontSize: 13,
    color: '#6B7280',
  },
});

