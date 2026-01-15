import { Router } from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/auth';
import * as supportController from '../controllers/support.controller';

const router = Router();

router.use(protect);

// Submit support ticket
router.post('/', [
    body('category').notEmpty(),
    body('subject').notEmpty(),
    body('message').notEmpty()
], supportController.createTicket);

// Get user's tickets
router.get('/', supportController.getUserTickets);

// Reply to ticket
router.post('/:id/reply', [
    body('message').notEmpty()
], supportController.replyToTicket);

export default router;
