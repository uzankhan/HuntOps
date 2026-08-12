import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
  ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp } from '@react-navigation/native';

type SettingsScreenProps = {
  navigation: NavigationProp<any>;
};

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const [isTrackingEnabled, setIsTrackingEnabled] = useState(true);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const [username, setUsername] = useState('');
  const [imei, setImei] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setUsername(user.username || '');
      }
      const savedImei = await AsyncStorage.getItem('device_imei');
      if (savedImei) setImei(savedImei);
    } catch (e) {
      console.error('Load settings error:', e);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('user');
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }]
            });
          }
        }
      ]
    );
  };

  const handleClearData = async () => {
    Alert.alert(
      'Clear Data',
      'This will remove all locally stored data. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('device_imei');
            await AsyncStorage.removeItem('user');
            Alert.alert('Success', 'Data cleared successfully');
            setImei('');
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>👤 Account</Text>
        <Text style={styles.detail}>Username: {username || 'Not set'}</Text>
        <Text style={styles.detail}>Device IMEI: {imei || 'Not registered'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚙️ Preferences</Text>
        
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Background Tracking</Text>
          <Switch
            value={isTrackingEnabled}
            onValueChange={setIsTrackingEnabled}
            trackColor={{ false: '#444', true: '#D4AF37' }}
            thumbColor={isTrackingEnabled ? '#D4AF37' : '#888'}
          />
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Push Notifications</Text>
          <Switch
            value={isNotificationsEnabled}
            onValueChange={setIsNotificationsEnabled}
            trackColor={{ false: '#444', true: '#D4AF37' }}
            thumbColor={isNotificationsEnabled ? '#D4AF37' : '#888'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🛡️ Security</Text>
        <TouchableOpacity style={styles.dangerBtn} onPress={handleClearData}>
          <Text style={styles.dangerBtnText}>Clear Local Data</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutBtnText}>🚪 Logout</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>HuntOps v1.0 | Made by Uzan Khan</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A0A0A',
    padding: 20
  },
  section: {
    backgroundColor: '#2D0A0A',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#4A0E0E'
  },
  sectionTitle: {
    color: '#D4AF37',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  detail: {
    color: '#C0C0C0',
    fontSize: 14,
    marginBottom: 5
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333'
  },
  switchLabel: {
    color: '#FFF',
    fontSize: 16
  },
  dangerBtn: {
    backgroundColor: '#dc3545',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5
  },
  dangerBtnText: {
    color: '#FFF',
    fontWeight: 'bold'
  },
  logoutBtn: {
    backgroundColor: '#D4AF37',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  logoutBtnText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16
  },
  footer: {
    textAlign: 'center',
    color: '#888',
    fontSize: 12,
    marginTop: 20,
    marginBottom: 30
  }
});