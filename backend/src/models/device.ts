import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export interface IDevice {
  id?: number;
  user_id: number;
  imei: string;
  device_name: string;
  model: string;
  manufacturer: string;
  os_version: string;
  fcm_token: string;
  last_latitude?: number;
  last_longitude?: number;
  last_location_at?: Date;
  is_locked: boolean;
  is_online: boolean;
  status: 'active' | 'lost' | 'stolen' | 'recovered';
  created_at?: Date;
  updated_at?: Date;
}

export class DeviceModel {
  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS devices (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        imei VARCHAR(50) UNIQUE NOT NULL,
        device_name VARCHAR(100) NOT NULL,
        model VARCHAR(100),
        manufacturer VARCHAR(100),
        os_version VARCHAR(50),
        fcm_token TEXT,
        last_latitude DECIMAL(10, 8),
        last_longitude DECIMAL(11, 8),
        last_location_at TIMESTAMP,
        is_locked BOOLEAN DEFAULT false,
        is_online BOOLEAN DEFAULT false,
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(query);
  }

  static async create(device: Partial<IDevice>) {
    const query = `
      INSERT INTO devices (user_id, imei, device_name, model, manufacturer, os_version, fcm_token, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;
    const values = [
      device.user_id,
      device.imei,
      device.device_name,
      device.model,
      device.manufacturer,
      device.os_version,
      device.fcm_token,
      device.status || 'active'
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByImei(imei: string) {
    const query = `SELECT * FROM devices WHERE imei = $1`;
    const result = await pool.query(query, [imei]);
    return result.rows[0];
  }

  static async findByUserId(user_id: number) {
    const query = `SELECT * FROM devices WHERE user_id = $1 ORDER BY created_at DESC`;
    const result = await pool.query(query, [user_id]);
    return result.rows;
  }

  static async findById(id: number) {
    const query = `SELECT * FROM devices WHERE id = $1`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async update(id: number, data: Partial<IDevice>) {
    const fields = Object.keys(data).map((key, i) => `${key} = $${i + 1}`).join(', ');
    const values = [...Object.values(data), id];
    const query = `UPDATE devices SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = $${values.length} RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async updateLocation(imei: string, lat: number, lng: number) {
    const query = `
      UPDATE devices 
      SET last_latitude = $1, last_longitude = $2, last_location_at = CURRENT_TIMESTAMP, is_online = true, updated_at = CURRENT_TIMESTAMP
      WHERE imei = $3 
      RETURNING *;
    `;
    const result = await pool.query(query, [lat, lng, imei]);
    return result.rows[0];
  }

  static async lockDevice(imei: string) {
    const query = `
      UPDATE devices 
      SET is_locked = true, updated_at = CURRENT_TIMESTAMP 
      WHERE imei = $1 
      RETURNING *;
    `;
    const result = await pool.query(query, [imei]);
    return result.rows[0];
  }

  static async unlockDevice(imei: string) {
    const query = `
      UPDATE devices 
      SET is_locked = false, updated_at = CURRENT_TIMESTAMP 
      WHERE imei = $1 
      RETURNING *;
    `;
    const result = await pool.query(query, [imei]);
    return result.rows[0];
  }
}