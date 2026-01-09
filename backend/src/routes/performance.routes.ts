import { Router } from 'express';
import * as performanceController from '../controllers/performance.controller';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

router.get('/portfolio', performanceController.getPortfolioPerformance);
router.get('/property/:propertyId', performanceController.getPropertyPerformance);
router.get('/income-trends', performanceController.getIncomePerformance);

export default router;
