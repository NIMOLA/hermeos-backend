import { Router } from 'express';
import { getBanks, verifyAndAddBankAccount } from '../controllers/bank.controller';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

router.get('/', getBanks);
router.post('/verify', verifyAndAddBankAccount);

export default router;
