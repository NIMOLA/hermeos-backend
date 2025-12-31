import { Router } from 'express';
import * as investmentController from '../controllers/investment.controller';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

router.post('/', investmentController.createInvestmentValidation, investmentController.createInvestment);
router.get('/history', investmentController.getInvestmentHistory);

export default router;
