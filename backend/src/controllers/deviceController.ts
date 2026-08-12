import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { DeviceModel } from '../models/device';
import { LocationModel } from '../models/location';
import { CommandModel } from '../models/command';

export const registerDevice = async (req: AuthRequest, res: Response) => {
  try {
    const { imei, device_name, model, manufacturer, os_version, fcm_token } = req.body;
    const user_id = req.user.id;

    if (!imei || !device_name) {
      return res.status(400).json({ success: false, message: 'IMEI and Device Name are required.' });
    }

    // Validate IMEI (15 digits)
    if (!/^\d{15}$/.test(imei)) {
      return res.status(400).json({ success: false, message: 'Invalid IMEI format. Must be 15 digits.' });
    }

    const existing = await DeviceModel.findByImei(imei);
    if (existing) {
      return res.status(400).json({ success: false, message: 'Device with this IMEI already registered.' });
    }

    const newDevice = await DeviceModel.create({
      user_id,
      imei,
      device_name,
      model: model || 'Unknown',
      manufacturer: manufacturer || 'Unknown',
      os_version: os_version || 'Unknown',
      fcm_token: fcm_token || null,
      status: 'active'
    });

    res.status(201).json({ 
      success: true, 
      message: 'Device registered successfully with HuntOps!',
      device: newDevice 
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

export const getDevices = async (req: AuthRequest, res: Response) => {
  try {
    const devices = await DeviceModel.findByUserId(req.user.id);
    res.status(200).json({ success: true, devices });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDeviceDetail = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const device = await DeviceModel.findById(parseInt(id));
    if (!device) {
      return res.status(404).json({ success: false, message: 'Device not found.' });
    }
    if (device.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized access.' });
    }
    
    // Get last location and commands
    const lastLocation = await LocationModel.getLastLocation(device.imei);
    const pendingCommands = await CommandModel.getPendingCommands(device.imei);
    
    res.status(200).json({ 
      success: true, 
      device: { ...device, lastLocation, pendingCommands }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateDevice = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { device_name, fcm_token, status } = req.body;
    
    const device = await DeviceModel.findById(parseInt(id));
    if (!device) {
      return res.status(404).json({ success: false, message: 'Device not found.' });
    }
    if (device.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized access.' });
    }

    const updated = await DeviceModel.update(parseInt(id), { device_name, fcm_token, status });
    res.status(200).json({ success: true, message: 'Device updated successfully.', device: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteDevice = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const device = await DeviceModel.findById(parseInt(id));
    if (!device) {
      return res.status(404).json({ success: false, message: 'Device not found.' });
    }
    if (device.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized access.' });
    }

    // Soft delete - status ko inactive karein
    await DeviceModel.update(parseInt(id), { status: 'recovered' });
    res.status(200).json({ success: true, message: 'Device removed successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};