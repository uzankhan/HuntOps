import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export interface IEvidence {
  id?: number;
  device_id: number;
  imei: string;
  type: 'photo' | 'audio' | 'video' | 'screenshot' | 'location' | 'contact' | 'sms' | 'call_log';
  data: any;
  file_path?: string;
  file_size?: number;
  is_uploaded: boolean;
  timestamp: Date;
  created_at?: Date;
}

export class EvidenceModel {
  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS evidence (
        id SERIAL PRIMARY KEY,
        device_id INTEGER REFERENCES devices(id) ON DELETE CASCADE,
        imei VARCHAR(50) NOT NULL,
        type VARCHAR(50) NOT NULL,
        data JSONB,
        file_path TEXT,
        file_size INTEGER,
        is_uploaded BOOLEAN DEFAULT false,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(query);
  }

  static async create(evidence: Partial<IEvidence>) {
    const query = `
      INSERT INTO evidence (device_id, imei, type, data, file_path, file_size, is_uploaded)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const values = [
      evidence.device_id,
      evidence.imei,
      evidence.type,
      evidence.data || {},
      evidence.file_path,
      evidence.file_size,
      evidence.is_uploaded || false
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getEvidence(imei: string, type?: string) {
    let query = `SELECT * FROM evidence WHERE imei = $1`;
    const values: any[] = [imei];
    if (type) {
      query += ` AND type = $2`;
      values.push(type);
    }
    query += ` ORDER BY created_at DESC`;
    const result = await pool.query(query, values);
    return result.rows;
  }

  static async getForExport(imei: string) {
    const query = `
      SELECT * FROM evidence 
      WHERE imei = $1 
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query, [imei]);
    return result.rows;
  }
}