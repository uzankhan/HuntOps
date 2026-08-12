import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { DeviceModel } from '../models/device';
import { LocationModel } from '../models/location';
import { EvidenceModel } from '../models/evidence';
import { CommandModel } from '../models/command';

export const getRecoveryPackage = async (req: AuthRequest, res: Response) => {
  try {
    const { imei } = req.params;
    
    const device = await DeviceModel.findByImei(imei);
    if (!device) {
      return res.status(404).json({ success: false, message: 'Device not found.' });
    }
    if (device.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized access.' });
    }

    // Collect all evidence
    const locations = await LocationModel.getHistory(imei, 1000, 168); // Last 7 days
    const commands = await CommandModel.getHistory(imei, 100);
    const evidence = await EvidenceModel.getForExport(imei);

    const recoveryPackage = {
      device: {
        name: device.device_name,
        imei: device.imei,
        model: device.model,
        manufacturer: device.manufacturer,
        status: device.status,
        last_location: {
          lat: device.last_latitude,
          lng: device.last_longitude,
          at: device.last_location_at
        }
      },
      summary: {
        total_locations: locations.length,
        total_commands: commands.length,
        total_evidence: evidence.length,
        is_locked: device.is_locked,
        is_online: device.is_online
      },
      locations: locations.slice(0, 100),
      commands: commands.slice(0, 50),
      evidence: evidence.slice(0, 50),
      generated_at: new Date().toISOString(),
      report_id: `HUNT-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    };

    res.status(200).json({ 
      success: true, 
      message: 'Recovery package generated successfully.',
      package: recoveryPackage 
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const generatePoliceReport = async (req: AuthRequest, res: Response) => {
  try {
    const { imei } = req.params;
    
    const device = await DeviceModel.findByImei(imei);
    if (!device) {
      return res.status(404).json({ success: false, message: 'Device not found.' });
    }
    if (device.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized access.' });
    }

    // Get evidence for police report
    const locations = await LocationModel.getHistory(imei, 500, 168);
    const evidence = await EvidenceModel.getForExport(imei);

    const report = {
      case_id: `HUNT-${Date.now()}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      device_owner: {
        name: req.user.username,
        email: req.user.email
      },
      device_info: {
        name: device.device_name,
        imei: device.imei,
        model: device.model,
        manufacturer: device.manufacturer,
        status: device.status
      },
      stolen_at: device.last_location_at || device.updated_at,
      last_known_location: {
        latitude: device.last_latitude,
        longitude: device.last_longitude,
        timestamp: device.last_location_at
      },
      evidence_summary: {
        locations: locations.length,
        photos: evidence.filter(e => e.type === 'photo').length,
        audio: evidence.filter(e => e.type === 'audio').length,
        screenshots: evidence.filter(e => e.type === 'screenshot').length
      },
      location_history: locations.slice(0, 50).map(l => ({
        lat: l.latitude,
        lng: l.longitude,
        time: l.timestamp
      })),
      generated_at: new Date().toISOString(),
      report_format: 'HuntOps Police Report v1.0'
    };

    res.status(200).json({ 
      success: true, 
      message: 'Police report generated successfully.',
      report 
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const reportStolen = async (req: AuthRequest, res: Response) => {
  try {
    const { imei } = req.params;
    
    const device = await DeviceModel.findByImei(imei);
    if (!device) {
      return res.status(404).json({ success: false, message: 'Device not found.' });
    }
    if (device.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized access.' });
    }

    // Update device status to stolen
    const updated = await DeviceModel.update(device.id, { status: 'stolen' });
    
    // Automatically lock device
    await DeviceModel.lockDevice(imei);
    
    // Generate recovery package
    const locations = await LocationModel.getHistory(imei, 100, 24);
    const evidence = await EvidenceModel.getForExport(imei);

    res.status(200).json({ 
      success: true, 
      message: 'Device reported as stolen. Lock initiated. Recovery package generated.',
      device: updated,
      evidence_count: evidence.length,
      location_count: locations.length,
      case_id: `STOLEN-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const reportRecovered = async (req: AuthRequest, res: Response) => {
  try {
    const { imei } = req.params;
    
    const device = await DeviceModel.findByImei(imei);
    if (!device) {
      return res.status(404).json({ success: false, message: 'Device not found.' });
    }
    if (device.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized access.' });
    }

    const updated = await DeviceModel.update(device.id, { status: 'recovered', is_locked: false });
    res.status(200).json({ 
      success: true, 
      message: 'Device marked as recovered successfully!',
      device: updated 
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};