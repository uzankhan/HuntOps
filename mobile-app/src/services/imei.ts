import DeviceInfo from 'react-native-device-info';

export const getIMEI = async (): Promise<string> => {
  try {
    // For Android - uses getDeviceId which returns IMEI (or Android ID on newer devices)
    const imei = await DeviceInfo.getDeviceId();
    return imei || '123456789012345';
  } catch (e) {
    return '123456789012345'; // fallback for testing
  }
};