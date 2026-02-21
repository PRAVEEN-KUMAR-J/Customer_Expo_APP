import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import MapView, { Marker, Region } from 'react-native-maps';

export const AddressMapScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [region, setRegion] = useState<Region | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // On mount, get current GPS location and center map there
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLoading(false);
          return;
        }

        const servicesOn = await Location.hasServicesEnabledAsync();
        if (!servicesOn) {
          setLoading(false);
          return;
        }

        const pos = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
          maximumAge: 10000,
          timeout: 20000,
        });

        const { latitude, longitude } = pos.coords;

        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      } catch {
        // Fall back to a default region (e.g. Mumbai) if GPS fails
        setRegion({
          latitude: 19.0760,
          longitude: 72.8777,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleUseCurrentLocation = async () => {
    try {
      if (!region) {
        Alert.alert('Location', 'Map is still loading location. Please try again.');
        return;
      }

      const { latitude, longitude } = region;

      let street = '';
      let city = '';
      let district = '';
      let pincode = '';

      // 1) Try device reverse geocoding (Expo)
      try {
        const results = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });
        const first = results[0];
        if (first) {
          street =
            `${first.name ?? ''} ${first.street ?? ''}`.trim() ||
            first.formattedAddress ||
            street;
          city =
            first.city ||
            first.subregion ||
            first.region ||
            city;
          district = first.district || first.subregion || district;
          pincode = first.postalCode || pincode;
        }
      } catch {
        // ignore, we'll try web API next
      }

      // 2) Fallback to OpenStreetMap reverse API if still missing
      if (!street || !city || !pincode) {
        try {
          const url =
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;

          const res = await fetch(url, {
            headers: { 'User-Agent': 'CustomerExpoApp/1.0 (demo)' },
          });

          if (res.ok) {
            const data = await res.json();
            street =
              street ||
              data.address?.road ||
              data.display_name ||
              '';
            city =
              city ||
              data.address?.city ||
              data.address?.town ||
              data.address?.village ||
              '';
            district =
              district ||
              data.address?.county ||
              data.address?.state_district ||
              '';
            pincode = pincode || data.address?.postcode || '';
          }
        } catch {
          // Ignore network/geocoding errors; we'll still navigate with coords.
        }
      }

      navigation.replace('AddressDetails' as never, {
        mode: 'add',
        fromMap: true,
        street,
        city,
        district,
        pincode,
        location: { latitude, longitude },
      } as never);
    } catch (e) {
      Alert.alert(
        'Location',
        'Failed to fetch current location. Please check permission, GPS and internet.',
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>{'‹'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add address</Text>
      </View>

      <View style={styles.mapContainer}>
        {region ? (
          <MapView
            style={styles.map}
            initialRegion={region}
            onRegionChangeComplete={setRegion}
          >
            <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} />
          </MapView>
        ) : (
          <View style={styles.mapPlaceholder}>
            <Text style={styles.mapText}>
              {loading ? 'Fetching your location…' : 'Location unavailable'}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.changeButton}
          onPress={handleUseCurrentLocation}
        >
          <Text style={styles.changeButtonText}>Use current location</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
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
  mapContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  map: {
    flex: 1,
    borderRadius: 16,
  },
  mapPlaceholder: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapText: {
    color: '#6B7280',
    fontSize: 14,
  },
  changeButton: {
    marginTop: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1FAE5',
    paddingVertical: 12,
    alignItems: 'center',
  },
  changeButtonText: {
    color: '#16A34A',
    fontSize: 15,
    fontWeight: '600',
  },
});

