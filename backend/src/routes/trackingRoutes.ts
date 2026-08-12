import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { 
  updateLocation, 
  getLocationHistory, 
  getCurrentLocation,
  getGeofenceAlerts
} from '../controllers/trackingController';

const router = Router();

router.post('/location', authenticate, updateLocation);
router.get('/:imei/history', authenticate, getLocationHistory);
router.get('/:imei/current', authenticate, getCurrentLocation);
router.get('/:imei/geofence', authenticate, getGeofenceAlerts);

export default router;