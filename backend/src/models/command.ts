import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export interface ICommand {
  id?: number;
  device_id: number;
  imei: string;
  command_type: 'lock' | 'unlock' | 'camera' | 'microphone' | 'alarm' | 'wipe' | 'password_change' | 'location' | 'screenshot' | 'contacts' | 'sms' | 'call_logs';
  status: 'pending' | 'sent' | 'executed' | 'failed' | 'delivered';
  payload: any;
  result: any;
  sent_at?: Date;
  executed_at?: Date;
  created_at?: Date;
}

export class CommandModel {
  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS commands (
        id SERIAL PRIMARY KEY,
        device_id INTEGER REFERENCES devices(id) ON DELETE CASCADE,
        imei VARCHAR(50) NOT NULL,
        command_type VARCHAR(50) NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        payload JSONB,
        result JSONB,
        sent_at TIMESTAMP,
        executed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(query);
  }

  static async create(command: Partial<ICommand>) {
    const query = `
      INSERT INTO commands (device_id, imei, command_type, payload, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [
      command.device_id,
      command.imei,
      command.command_type,
      command.payload || {},
      command.status || 'pending'
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async updateStatus(id: number, status: string, result?: any) {
    const query = `
      UPDATE commands 
      SET status = $1, result = $2, 
          executed_at = CASE WHEN $1 IN ('executed', 'failed') THEN CURRENT_TIMESTAMP ELSE executed_at END,
          sent_at = CASE WHEN $1 = 'sent' THEN CURRENT_TIMESTAMP ELSE sent_at END
      WHERE id = $3
      RETURNING *;
    `;
    const values = [status, result || {}, id];
    const resultQuery = await pool.query(query, values);
    return resultQuery.rows[0];
  }

  static async getPendingCommands(imei: string) {
    const query = `
      SELECT * FROM commands 
      WHERE imei = $1 AND status IN ('pending', 'sent')
      ORDER BY created_at ASC
    `;
    const result = await pool.query(query, [imei]);
    return result.rows;
  }

  static async getHistory(imei: string, limit: number = 50) {
    const query = `
      SELECT * FROM commands 
      WHERE imei = $1 
      ORDER BY created_at DESC 
      LIMIT $2
    `;
    const result = await pool.query(query, [imei, limit]);
    return result.rows;
  }
}