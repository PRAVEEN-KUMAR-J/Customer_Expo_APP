import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Mail, PhoneCall } from 'lucide-react-native';

const EMAIL = 'nimbasket.official@gmail.com';
const PHONE = '7200729718';

export const HelpSupportScreen: React.FC = () => {
  const router = useRouter();

  const openEmail = async () => {
    const url = `mailto:${EMAIL}`;
    const canOpen = await Linking.canOpenURL(url);
    if (!canOpen) {
      Alert.alert('Unable to open email app');
      return;
    }
    Linking.openURL(url);
  };

  const openPhone = async () => {
    const url = `tel:${PHONE}`;
    const canOpen = await Linking.canOpenURL(url);
    if (!canOpen) {
      Alert.alert('Unable to place a call');
      return;
    }
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backArrow}>{'‹'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Contact our support</Text>
        <Text style={styles.cardSubtitle}>
          Tap an icon to quickly call or email us.
        </Text>

        <View style={styles.iconRow}>
          <TouchableOpacity
            onPress={openEmail}
            activeOpacity={0.8}
            style={styles.iconButton}
          >
            <View style={styles.iconCircle}>
              <Mail size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.iconLabel}>Email</Text>
            <Text style={styles.iconValue}>{EMAIL}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={openPhone}
            activeOpacity={0.8}
            style={styles.iconButton}
          >
            <View style={[styles.iconCircle, styles.iconCirclePhone]}>
              <PhoneCall size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.iconLabel}>Call</Text>
            <Text style={styles.iconValue}>{PHONE}</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    color: '#111827',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 16,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  iconButton: {
    alignItems: 'center',
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 5,
  },
  iconCirclePhone: {
    backgroundColor: '#16A34A',
  },
  iconLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  iconValue: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
});

