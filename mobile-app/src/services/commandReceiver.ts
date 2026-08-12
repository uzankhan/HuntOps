import { DeviceEventEmitter } from 'react-native';
import { lockDevice } from './lock';
import { capturePhoto } from './camera';
import { startRecording } from './microphone';

export const listenForCommands = (token: string, imei: string) => {
  // For demo, using DeviceEventEmitter (replace with FCM listener in real app)
  DeviceEventEmitter.addListener('remote_command', async (data) => {
    const { command_type, payload } = data;
    switch (command_type) {
      case 'lock':
        await lockDevice(token, imei);
        break;
      case 'camera':
        const photo = await capturePhoto();
        // Upload photo to server
        break;
      case 'microphone':
        const audio = await startRecording(30);
        // Upload audio
        break;
      default:
        console.log('Unknown command');
    }
  });
};