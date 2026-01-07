import { Router } from 'express';
import * as transactionController from '../controllers/transaction.controller';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

router.get('/', transactionController.getMyTransactions);
router.get('/:id', transactionController.getTransactionById);

export default router;
