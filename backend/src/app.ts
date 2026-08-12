import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server as SocketServer, Socket } from 'socket.io';
import { initDB } from './config/db';
import { fcmService } from './services/fcmService';
import { logger } from './utils/logger';

// Routes
import authRoutes from './routes/authRoutes';
import deviceRoutes from './routes/deviceRoutes';
import trackingRoutes from './routes/trackingRoutes';
import commandRoutes from './routes/commandRoutes';
import recoveryRoutes from './routes/recoveryRoutes';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// ============ MIDDLEWARE ============
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request logger
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, { ip: req.ip });
  next();
});

// ============ ROUTES ============
app.use('/api/auth', authRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/commands', commandRoutes);
app.use('/api/recovery', recoveryRoutes);

// Health check
app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    name: 'HuntOps API',
    version: '1.0.0',
    author: 'Uzan Khan',
    status: 'Active',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// ============ WEBSOCKET ============
io.on('connection', (socket: Socket) => {
  logger.info(`🟢 Device Connected: ${socket.id}`);
  
  socket.on('register-device', (data: { imei: string, fcm_token: string }) => {
    logger.info(`📱 Device registered: ${data.imei}`);
    socket.join(`device-${data.imei}`);
  });

  socket.on('location-update', async (data: { imei: string, latitude: number, longitude: number, accuracy?: number }) => {
    logger.info(`📍 Location update: ${data.imei} - ${data.latitude}, ${data.longitude}`);
    io.to(`device-${data.imei}`).emit('location-broadcast', data);
  });

  socket.on('command-result', (data: { command_id: number, status: string, result: any }) => {
    logger.info(`⚡ Command result: ${data.command_id} - ${data.status}`);
    io.emit(`command-${data.command_id}`, data);
  });

  socket.on('disconnect', () => {
    logger.info(`🔴 Device Disconnected: ${socket.id}`);
  });
});

// ============ START SERVER ============
const PORT = process.env.PORT || 5000;

initDB().then(() => {
  fcmService.init();
  
  server.listen(PORT, () => {
    logger.info(`🚀 HuntOps Server running on Port ${PORT}`);
    console.log(`
    ╔═══════════════════════════════════════════╗
    ║   🎯 HUNTOPS - PHONE RECOVERY SYSTEM      ║
    ║   Made by: Uzan Khan                      ║
    ║   Status: ONLINE                         ║
    ║   Port: ${PORT}                            ║
    ║   WebSocket: Active                      ║
    ╚═══════════════════════════════════════════╝
    `);
  });
}).catch(err => {
  logger.error('❌ Database connection failed:', err);
  process.exit(1);
});

export { io, server };