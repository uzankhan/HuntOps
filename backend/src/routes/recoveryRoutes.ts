import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { 
  getRecoveryPackage, 
  generatePoliceReport, 
  reportStolen, 
  reportRecovered 
} from '../controllers/recoveryController';

const router = Router();

router.get('/:imei/package', authenticate, getRecoveryPackage);
router.get('/:imei/police-report', authenticate, generatePoliceReport);
router.post('/:imei/stolen', authenticate, reportStolen);
router.post('/:imei/recovered', authenticate, reportRecovered);

export default router;