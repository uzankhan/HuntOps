import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { 
  registerDevice, 
  getDevices, 
  getDeviceDetail, 
  updateDevice, 
  deleteDevice 
} from '../controllers/deviceController';

const router = Router();

router.post('/register', authenticate, registerDevice);
router.get('/', authenticate, getDevices);
router.get('/:id', authenticate, getDeviceDetail);
router.put('/:id', authenticate, updateDevice);
router.delete('/:id', authenticate, deleteDevice);

export default router;