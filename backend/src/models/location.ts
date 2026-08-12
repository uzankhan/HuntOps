import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export interface ILocation {
  id?: number;
  device_id: number;
  imei: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  speed?: number;
  altitude?: number;
  heading?: number;
  is_mocked: boolean;
  timestamp: Date;
}

export class LocationModel {
  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS locations (
        id SERIAL PRIMARY KEY,
        device_id INTEGER REFERENCES devices(id) ON DELETE CASCADE,
        imei VARCHAR(50) NOT NULL,
        latitude DECIMAL(10, 8) NOT NULL,
        longitude DECIMAL(11, 8) NOT NULL,
        accuracy DECIMAL(10, 2),
        speed DECIMAL(10, 2),
        altitude DECIMAL(10, 2),
        heading DECIMAL(10, 2),
        is_mocked BOOLEAN DEFAULT false,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(query);
  }

  static async create(location: Partial<ILocation>) {
    const query = `
      INSERT INTO locations (device_id, imei, latitude, longitude, accuracy, speed, altitude, heading, is_mocked)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;
    const values = [
      location.device_id,
      location.imei,
      location.latitude,
      location.longitude,
      location.accuracy,
      location.speed,
      location.altitude,
      location.heading,
      location.is_mocked || false
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getHistory(imei: string, limit: number = 100, hours: number = 24) {
    const query = `
      SELECT * FROM locations 
      WHERE imei = $1 AND timestamp > NOW() - INTERVAL '${hours} hours'
      ORDER BY timestamp DESC
      LIMIT $2
    `;
    const result = await pool.query(query, [imei, limit]);
    return result.rows;
  }

  static async getLastLocation(imei: string) {
    const query = `
      SELECT * FROM locations 
      WHERE imei = $1 
      ORDER BY timestamp DESC 
      LIMIT 1
    `;
    const result = await pool.query(query, [imei]);
    return result.rows[0];
  }
}