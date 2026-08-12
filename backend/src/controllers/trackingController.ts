import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { DeviceModel } from '../models/device';
import { LocationModel } from '../models/location';

export const updateLocation = async (req: AuthRequest, res: Response) => {
  try {
    const { imei, latitude, longitude, accuracy, speed, altitude, heading } = req.body;
    
    if (!imei || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ success: false, message: 'IMEI, Latitude, and Longitude are required.' });
    }

    // Validate coordinates
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return res.status(400).json({ success: false, message: 'Invalid coordinates.' });
    }

    const device = await DeviceModel.findByImei(imei);
    if (!device) {
      return res.status(404).json({ success: false, message: 'Device not found.' });
    }

    // Update device location
    const updatedDevice = await DeviceModel.updateLocation(imei, latitude, longitude);
    
    // Save location history
    await LocationModel.create({
      device_id: device.id,
      imei,
      latitude,
      longitude,
      accuracy,
      speed,
      altitude,
      heading,
      is_mocked: false
    });

    res.status(200).json({ 
      success: true, 
      message: 'Location updated successfully.',
      device: updatedDevice 
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLocationHistory = async (req: AuthRequest, res: Response) => {
  try {
    const { imei } = req.params;
    const { limit = 100, hours = 24 } = req.query;
    
    const device = await DeviceModel.findByImei(imei);
    if (!device) {
      return res.status(404).json({ success: false, message: 'Device not found.' });
    }
    if (device.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized access.' });
    }

    const history = await LocationModel.getHistory(imei, parseInt(limit as string), parseInt(hours as string));
    res.status(200).json({ success: true, history });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCurrentLocation = async (req: AuthRequest, res: Response) => {
  try {
    const { imei } = req.params;
    
    const device = await DeviceModel.findByImei(imei);
    if (!device) {
      return res.status(404).json({ success: false, message: 'Device not found.' });
    }
    if (device.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized access.' });
    }

    const location = await LocationModel.getLastLocation(imei);
    res.status(200).json({ success: true, location, device });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getGeofenceAlerts = async (req: AuthRequest, res: Response) => {
  // Geofence implementation - will be added in next phase
  res.status(200).json({ success: true, message: 'Geofence feature coming soon.' });
};