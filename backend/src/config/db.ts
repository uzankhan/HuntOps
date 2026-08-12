import { Pool } from 'pg';
import dotenv from 'dotenv';
import { UserModel } from '../models/user';
import { DeviceModel } from '../models/device';
import { LocationModel } from '../models/location';
import { CommandModel } from '../models/command';
import { EvidenceModel } from '../models/evidence';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export const initDB = async () => {
  await UserModel.createTable();
  await DeviceModel.createTable();
  await LocationModel.createTable();
  await CommandModel.createTable();
  await EvidenceModel.createTable();
  console.log('✅ HuntOps Database initialized successfully.');
};

export default pool;