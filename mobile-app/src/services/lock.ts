import { Platform, Alert } from 'react-native';
import DeviceInfo from 'react-native-device-info';

export const lockDevice = async (token: string, imei: string) => {
  try {
    // For now, just simulate lock with alert (Android actual lock will be added later)
    if (Platform.OS === 'android') {
      // TODO: Add native Device Admin lock later
      Alert.alert('Lock Device', `Lock command sent to device ${imei}`);
      console.log(`[LOCK] Device ${imei} would be locked now.`);
    }
    // Report back to server
    await fetch('http://localhost:5000/api/commands/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ command_id: Date.now(), status: 'executed', result: { action: 'locked', simulated: true } })
    });
    return true;
  } catch (e) {
    console.error('Lock failed:', e);
    return false;
  }
};