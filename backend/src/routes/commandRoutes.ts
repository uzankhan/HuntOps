import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { 
  sendCommand, 
  executeCommand, 
  getCommandHistory,
  getPendingCommands
} from '../controllers/commandController';

const router = Router();

router.post('/send', authenticate, sendCommand);
router.post('/execute', executeCommand); // This is called by mobile app
router.get('/:imei/history', authenticate, getCommandHistory);
router.get('/:imei/pending', authenticate, getPendingCommands);

export default router;