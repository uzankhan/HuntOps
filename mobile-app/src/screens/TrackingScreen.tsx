import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type TrackingRouteProp = RouteProp<{ Tracking: { imei: string } }, 'Tracking'>;

export const TrackingScreen: React.FC = () => {
  const route = useRoute<TrackingRouteProp>();
  const { imei } = route.params;
  const [device, setDevice] = useState<any>(null);
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const API = 'http://localhost:5000/api';

  const fetchDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;
      const [dRes, lRes] = await Promise.all([
        fetch(`${API}/devices/imei/${imei}`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API}/tracking/${imei}/history?limit=50`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      const dData = await dRes.json();
      const lData = await lRes.json();
      if (dData.success) setDevice(dData.device);
      if (lData.success) setLocations(lData.history || []);
    } catch (e) { Alert.alert('Error', 'Failed to fetch data'); }
    setLoading(false);
  };

  const sendCommand = async (type: string, payload: any = {}) => {
    setSending(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) { Alert.alert('Error', 'Please login first'); return; }
      const res = await fetch(`${API}/commands/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ imei, command_type: type, payload })
      });
      const data = await res.json();
      if (data.success) { Alert.alert('Success', `Command '${type}' sent!`); fetchDetails(); }
      else Alert.alert('Error', data.message);
    } catch (e) { Alert.alert('Error', 'Command failed'); }
    setSending(false);
  };

  useEffect(() => { fetchDetails(); }, [imei]);

  if (loading) return <ActivityIndicator size="large" color="#D4AF37" style={{ flex: 1, justifyContent: 'center' }} />;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.deviceName}>{device?.device_name || 'Unknown'}</Text>
        <Text style={styles.imeiText}>IMEI: {imei}</Text>
        <Text style={[styles.statusText, { color: device?.is_locked ? '#dc3545' : '#28a745' }]}>
          {device?.is_locked ? '🔒 Locked' : '🟢 Active'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎮 Remote Commands</Text>
        <View style={styles.commandGrid}>
          {[
            { label: '🔒 Lock', cmd: 'lock' },
            { label: '🔓 Unlock', cmd: 'unlock' },
            { label: '📸 Camera', cmd: 'camera', payload: { camera: 'rear' } },
            { label: '🎙️ Mic', cmd: 'microphone', payload: { duration: 30 } },
            { label: '🔊 Alarm', cmd: 'alarm', payload: { duration: 60 } },
            { label: '🗑️ Wipe', cmd: 'wipe', payload: { confirm: true } }
          ].map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={[styles.commandBtn, { backgroundColor: idx === 0 ? '#dc3545' : idx === 1 ? '#28a745' : idx === 5 ? '#d63384' : '#6c757d' }]}
              onPress={() => {
                if (item.cmd === 'wipe') {
                  Alert.alert('⚠️ WARNING', 'Erase all data?', [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Wipe', style: 'destructive', onPress: () => sendCommand(item.cmd, item.payload) }
                  ]);
                } else sendCommand(item.cmd, item.payload || {});
              }}
              disabled={sending}
            >
              <Text style={styles.commandBtnText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📋 Location History ({locations.length})</Text>
        {locations.slice(0, 20).map((loc, idx) => (
          <View key={idx} style={styles.locationItem}>
            <Text style={styles.locationItemText}>{new Date(loc.timestamp).toLocaleString()}</Text>
            <Text style={styles.locationItemCoords}>{loc.latitude.toFixed(6)}, {loc.longitude.toFixed(6)}</Text>
          </View>
        ))}
        {locations.length === 0 && <Text style={styles.emptyText}>No history</Text>}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A0A0A', padding: 15 },
  header: { backgroundColor: '#2D0A0A', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#D4AF37' },
  deviceName: { fontSize: 22, fontWeight: 'bold', color: '#D4AF37' },
  imeiText: { color: '#C0C0C0', fontSize: 14, marginTop: 4 },
  statusText: { fontSize: 16, fontWeight: 'bold', marginTop: 4 },
  section: { backgroundColor: '#2D0A0A', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#4A0E0E' },
  sectionTitle: { color: '#D4AF37', fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  commandGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  commandBtn: { width: '48%', padding: 12, borderRadius: 8, marginBottom: 8, alignItems: 'center' },
  commandBtnText: { color: '#FFF', fontWeight: 'bold' },
  locationItem: { paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#333' },
  locationItemText: { color: '#C0C0C0', fontSize: 12 },
  locationItemCoords: { color: '#FFF', fontSize: 13, fontWeight: 'bold' },
  emptyText: { color: '#888', textAlign: 'center', paddingVertical: 20 }
});