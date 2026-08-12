import BackgroundGeolocation from 'react-native-background-geolocation';

export const startTracking = (imei: string, token: string) => {
  // @ts-ignore - TypeScript definitions mismatch, but method exists at runtime
  BackgroundGeolocation.configure({
    // @ts-ignore
    desiredAccuracy: BackgroundGeolocation.DesiredAccuracy.High,
    distanceFilter: 10,
    stopOnTerminate: false,
    startOnBoot: true,
    debug: false,
    // @ts-ignore
    logLevel: BackgroundGeolocation.LogLevel.Verbose
  });

  // @ts-ignore
  BackgroundGeolocation.onLocation(async (location) => {
    try {
      await fetch('http://localhost:5000/api/tracking/location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          imei,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          accuracy: location.coords.accuracy
        })
      });
    } catch (e) {
      console.log('Location upload failed');
    }
  });

  // @ts-ignore
  BackgroundGeolocation.start();
};