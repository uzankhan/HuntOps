import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp } from '@react-navigation/native';
import { DeviceCard } from '../components/DeviceCard';
import { getIMEI } from '../services/imei';
import { startTracking } from '../services/location';

type DashboardScreenProps = { navigation: NavigationProp<any> };

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const [devices, setDevices] = useState<any[]>([]);
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  const fetchDevices = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;
      const res = await fetch('http://localhost:5000/api/devices', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setDevices(data.devices);
    } catch (e) { Alert.alert('Error', 'Failed to fetch devices'); }
    setLoading(false);
  };

  const registerThisPhone = async () => {
    setRegistering(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) { Alert.alert('Error', 'Please login first'); return; }
      const imei = await getIMEI();
      const res = await fetch('http://localhost:5000/api/devices/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ imei, device_name: 'My Phone', model: 'React Native', manufacturer: 'HuntOps', os_version: 'Android' })
      });
      const data = await res.json();
      if (data.success) {
        Alert.alert('Success', 'Device registered!');
        startTracking(imei, token);
        fetchDevices();
      } else Alert.alert('Error', data.message);
    } catch (e) { Alert.alert('Error', 'Registration failed'); }
    setRegistering(false);
  };

  useEffect(() => {
    AsyncStorage.getItem('user').then(data => setUser(JSON.parse(data || '{}')));
    fetchDevices();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome, {user?.username || 'User'}!</Text>
      <TouchableOpacity style={styles.registerBtn} onPress={registerThisPhone} disabled={registering}>
        <Text style={styles.btnText}>{registering ? 'Registering...' : '📱 Register This Phone'}</Text>
      </TouchableOpacity>
      {loading ? <ActivityIndicator size="large" color="#D4AF37" /> : (
        <FlatList
          data={devices}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <DeviceCard
              device={item}
              onPress={() => navigation.navigate('Tracking', { imei: item.imei })}
            />
          )}
          ListEmptyComponent={<Text style={styles.empty}>No devices registered. Tap "Register This Phone" to add your device.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#1A0A0A' },
  header: { fontSize: 22, color: '#D4AF37', marginBottom: 20, fontWeight: 'bold' },
  registerBtn: { backgroundColor: '#D4AF37', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  btnText: { color: '#000', fontWeight: 'bold' },
  empty: { color: '#888', textAlign: 'center', marginTop: 50, fontSize: 16 }
});