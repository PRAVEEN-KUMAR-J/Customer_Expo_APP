import React from 'react';
import { View, Text, StyleSheet, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TIRUVANNAMALAI_COORDS = {
  latitude: 12.2253,
  longitude: 79.0747,
};

const STORES = [
  { id: '1', name: 'Al Mart' },
  { id: '2', name: 'ABK Hyper Mart' },
  { id: '3', name: 'Sri Ramana Super Market' },
  { id: '4', name: 'Dhanapal Store' },
  { id: '5', name: 'GSM Super Market' },
  { id: '6', name: 'Sri Kumars Supermarket' },
  { id: '7', name: 'Zam Zam' },
  { id: '8', name: 'More Super Market' },
  { id: '9', name: 'Nilgiris Supermarket' },
  { id: '10', name: 'ABN Super Market' },
  { id: '11', name: 'Epic Super Market' },
  { id: '12', name: 'GRS Super Market' },
  { id: '13', name: 'Pragadhe Super Market' },
  { id: '14', name: '55 Mart' },
  { id: '15', name: 'ARS Super Mariet' },
];

export default function StoreMapScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tiruvannamalai Stores</Text>
        <Text style={styles.subtitle}>All stores share location: Tiruvannamalai</Text>
      </View>

      {/* Map removed as requested */}

      {/* Store list */}
      <ScrollView style={styles.storeList} showsVerticalScrollIndicator={false}>
        {STORES.map((store, index) => (
          <View key={store.id} style={styles.storeItem}>
            <View style={styles.storeIndex}>
              <Text style={styles.storeIndexText}>{index + 1}</Text>
            </View>
            <View style={styles.storeInfo}>
              <Text style={styles.storeName}>{store.name}</Text>
              <Text style={styles.storeLocation}>📍 Tiruvannamalai</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#6B7280',
  },
  storeList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  storeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  storeIndex: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  storeIndexText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  storeLocation: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
});
