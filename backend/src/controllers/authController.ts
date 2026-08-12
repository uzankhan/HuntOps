import { Request, Response } from 'express';
import { UserModel } from '../models/user';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'huntops_secret_key';

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, country } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields (username, email, password) are required.'
      });
    }

    const newUser = await UserModel.create({
      username,
      email,
      password_hash: password,
      country: country || 'Pakistan',
      role: 'user'
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Welcome to HuntOps!',
      user: newUser
    });
  } catch (error: any) {
    if (error.code === '23505') {
      return res.status(400).json({
        success: false,
        message: 'Username or Email already exists.'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error'
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and Password are required.'
      });
    }

    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const isMatch = await UserModel.comparePassword(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful. Welcome to HuntOps!',
      token: token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        country: user.country,
        role: user.role
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error'
    });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findById((req as any).user.id);
    res.status(200).json({
      success: true,
      user
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};