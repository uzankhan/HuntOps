import { Platform, PermissionsAndroid, Alert } from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

const audioRecorderPlayer = new AudioRecorderPlayer();

export const requestMicrophonePermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Microphone Permission',
          message: 'HuntOps needs microphone access.',
          buttonNeutral: 'Ask Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK'
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      return false;
    }
  }
  return true;
};

export const startRecording = async (duration: number = 30): Promise<string | null> => {
  try {
    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) { Alert.alert('Permission Denied'); return null; }

    const path = Platform.select({
      android: `sdcard/recording_${Date.now()}.mp3`,
      ios: `recording_${Date.now()}.mp3`
    });

    const result = await audioRecorderPlayer.startRecorder(path || '');
    console.log('Recording started:', result);

    setTimeout(async () => {
      await audioRecorderPlayer.stopRecorder();
    }, duration * 1000);

    return path || null;
  } catch (error) {
    console.error(error);
    return null;
  }
};