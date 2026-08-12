import { Server as SocketServer } from 'socket.io';
import { logger } from '../utils/logger';

export const initWebSocket = (io: SocketServer) => {
  io.on('connection', (socket) => {
    logger.info(`🟢 WebSocket Connected: ${socket.id}`);
    
    socket.on('register-device', (data) => {
      socket.join(`device-${data.imei}`);
    });

    socket.on('location-update', (data) => {
      io.to(`device-${data.imei}`).emit('location-broadcast', data);
    });

    socket.on('disconnect', () => {
      logger.info(`🔴 WebSocket Disconnected: ${socket.id}`);
    });
  });
};