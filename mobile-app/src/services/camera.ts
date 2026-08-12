import { Platform, Alert } from 'react-native';
import { launchCamera, CameraOptions, ImagePickerResponse } from 'react-native-image-picker';
import { PermissionsAndroid } from 'react-native';

export const requestCameraPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'HuntOps needs camera access.',
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

export const capturePhoto = async (): Promise<string | null> => {
  try {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) { Alert.alert('Permission Denied'); return null; }

    const options: CameraOptions = {
      mediaType: 'photo',
      quality: 0.8,
      saveToPhotos: true,
      includeBase64: true
    };

    return new Promise((resolve) => {
      launchCamera(options, (response: ImagePickerResponse) => {
        if (response.didCancel) resolve(null);
        else if (response.errorMessage) { console.error(response.errorMessage); resolve(null); }
        else if (response.assets && response.assets[0]) {
          resolve(response.assets[0].base64 || response.assets[0].uri || null);
        } else resolve(null);
      });
    });
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const captureFrontCamera = async (): Promise<string | null> => {
  try {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) { Alert.alert('Permission Denied'); return null; }

    const options: CameraOptions = {
      mediaType: 'photo',
      quality: 0.8,
      saveToPhotos: true,
      includeBase64: true,
      cameraType: 'front'
    };

    return new Promise((resolve) => {
      launchCamera(options, (response: ImagePickerResponse) => {
        if (response.didCancel) resolve(null);
        else if (response.errorMessage) { console.error(response.errorMessage); resolve(null); }
        else if (response.assets && response.assets[0]) {
          resolve(response.assets[0].base64 || response.assets[0].uri || null);
        } else resolve(null);
      });
    });
  } catch (error) {
    console.error(error);
    return null;
  }
};