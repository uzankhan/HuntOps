import { Pool } from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export interface IUser {
  id?: number;
  username: string;
  email: string;
  password_hash: string;
  country: string;
  role: 'user' | 'admin';
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export class UserModel {
  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        country VARCHAR(50) DEFAULT 'Pakistan',
        role VARCHAR(20) DEFAULT 'user',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(query);
  }

  static async create(user: Partial<IUser>) {
    const hashedPassword = await bcrypt.hash(user.password_hash!, 10);
    const query = `
      INSERT INTO users (username, email, password_hash, country, role)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, username, email, country, role, created_at;
    `;
    const values = [
      user.username,
      user.email,
      hashedPassword,
      user.country || 'Pakistan',
      user.role || 'user'
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByEmail(email: string) {
    const query = `SELECT * FROM users WHERE email = $1`;
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async findById(id: number) {
    const query = `SELECT id, username, email, country, role, is_active, created_at FROM users WHERE id = $1`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async update(id: number, data: Partial<IUser>) {
    const fields = Object.keys(data).map((key, i) => `${key} = $${i + 1}`).join(', ');
    const values = [...Object.values(data), id];
    const query = `UPDATE users SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = $${values.length} RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async comparePassword(plainText: string, hashed: string) {
    return await bcrypt.compare(plainText, hashed);
  }
}