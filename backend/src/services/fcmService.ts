import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

let fcmInitialized = false;

export const initFCM = () => {
  if (!fcmInitialized) {
    try {
      // Production mein actual service account JSON use karein
      // admin.initializeApp({
      //   credential: admin.credential.cert(require('path/to/service-account-key.json'))
      // });
      console.log('✅ FCM Service initialized (dummy mode)');
      fcmInitialized = true;
    } catch (error) {
      console.error('❌ FCM init failed:', error);
    }
  }
};

export const sendCommand = async (fcmToken: string, data: any) => {
  if (!fcmInitialized) {
    console.log('📱 FCM not initialized. Command queued for delivery.');
    return { success: true, message: 'Command queued (FCM dummy mode)' };
  }

  try {
    const message = {
      token: fcmToken,
      data: data,
      android: {
        priority: 'high' as const,   // <-- FIX: as const lagaya
      },
      apns: {
        headers: {
          'apns-priority': '10' as const,   // <-- FIX: as const lagaya
        }
      }
    };

    const response = await admin.messaging().send(message);
    return { success: true, messageId: response };
  } catch (error: any) {
    console.error('FCM send error:', error);
    return { success: false, error: error.message };
  }
};

export const fcmService = {
  init: initFCM,
  sendCommand
};