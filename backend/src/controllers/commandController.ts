import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { DeviceModel } from '../models/device';
import { CommandModel } from '../models/command';
import { fcmService } from '../services/fcmService';

export const sendCommand = async (req: AuthRequest, res: Response) => {
  try {
    const { imei, command_type, payload } = req.body;
    const user_id = req.user.id;

    if (!imei || !command_type) {
      return res.status(400).json({ success: false, message: 'IMEI and command_type are required.' });
    }

    const device = await DeviceModel.findByImei(imei);
    if (!device) {
      return res.status(404).json({ success: false, message: 'Device not found.' });
    }
    if (device.user_id !== user_id) {
      return res.status(403).json({ success: false, message: 'Unauthorized access.' });
    }

    const validCommands = ['lock', 'unlock', 'camera', 'microphone', 'alarm', 'wipe', 'password_change', 'location', 'screenshot', 'contacts', 'sms', 'call_logs'];
    if (!validCommands.includes(command_type)) {
      return res.status(400).json({ success: false, message: 'Invalid command type.' });
    }

    const command = await CommandModel.create({
      device_id: device.id,
      imei,
      command_type,
      payload: payload || {},
      status: 'pending'
    });

    if (device.fcm_token) {
      await fcmService.sendCommand(device.fcm_token, {
        command_id: command.id,
        type: command_type,
        payload: payload || {}
      });
      await CommandModel.updateStatus(command.id, 'sent');
    } else {
      console.log(`⚠️ No FCM token for device: ${imei}. Command queued.`);
    }

    res.status(200).json({ 
      success: true, 
      message: `Command '${command_type}' sent successfully to ${device.device_name}`,
      command 
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const executeCommand = async (req: Request, res: Response) => {
  try {
    const { command_id, result, status } = req.body;
    
    if (!command_id) {
      return res.status(400).json({ success: false, message: 'command_id is required.' });
    }

    const updated = await CommandModel.updateStatus(command_id, status || 'executed', result);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Command not found.' });
    }

    // If command was 'lock' or 'wipe', update device status
    if (updated.command_type === 'lock' && status === 'executed') {
      await DeviceModel.lockDevice(updated.imei);
    }
    if (updated.command_type === 'unlock' && status === 'executed') {
      await DeviceModel.unlockDevice(updated.imei);
    }

    // <--- FIX: Remove 'return' here (just res.status...)
    res.status(200).json({ 
      success: true, 
      message: 'Command execution reported.',
      command: updated 
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCommandHistory = async (req: AuthRequest, res: Response) => {
  try {
    const { imei } = req.params;
    const { limit = 50 } = req.query;

    const device = await DeviceModel.findByImei(imei);
    if (!device) {
      return res.status(404).json({ success: false, message: 'Device not found.' });
    }
    if (device.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized access.' });
    }

    const commands = await CommandModel.getHistory(imei, parseInt(limit as string));
    res.status(200).json({ success: true, commands });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPendingCommands = async (req: AuthRequest, res: Response) => {
  try {
    const { imei } = req.params;

    const device = await DeviceModel.findByImei(imei);
    if (!device) {
      return res.status(404).json({ success: false, message: 'Device not found.' });
    }
    if (device.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized access.' });
    }

    const commands = await CommandModel.getPendingCommands(imei);
    res.status(200).json({ success: true, commands });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};