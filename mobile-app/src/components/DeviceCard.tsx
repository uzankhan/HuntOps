import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface DeviceCardProps {
  device: {
    id: number;
    device_name: string;
    imei: string;
    is_locked: boolean;
    last_latitude?: number;
    last_longitude?: number;
  };
  onPress: () => void;
  onLockPress?: () => void;
}

export const DeviceCard: React.FC<DeviceCardProps> = ({ device, onPress, onLockPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.header}>
        <Text style={styles.deviceName}>{device.device_name}</Text>
        <View style={[styles.statusBadge, { backgroundColor: device.is_locked ? '#dc3545' : '#28a745' }]}>
          <Text style={styles.statusText}>{device.is_locked ? '🔒 Locked' : '🟢 Active'}</Text>
        </View>
      </View>
      
      <Text style={styles.detail}>📱 IMEI: {device.imei}</Text>
      {device.last_latitude && (
        <Text style={styles.detail}>
          📍 {device.last_latitude.toFixed(4)}, {device.last_longitude?.toFixed(4)}
        </Text>
      )}
      
      {!device.is_locked && onLockPress && (
        <TouchableOpacity style={styles.lockBtn} onPress={onLockPress}>
          <Text style={styles.lockBtnText}>🔒 Lock Device</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#2D0A0A',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#4A0E0E'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  deviceName: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12
  },
  statusText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold'
  },
  detail: {
    color: '#C0C0C0',
    fontSize: 14,
    marginTop: 4
  },
  lockBtn: {
    backgroundColor: '#dc3545',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
    alignItems: 'center'
  },
  lockBtnText: {
    color: '#FFF',
    fontWeight: 'bold'
  }
});