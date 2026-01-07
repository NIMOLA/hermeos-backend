import { Router } from 'express';
import { getChatResponse } from '../controllers/chatbot.controller';
import { protect } from '../middleware/auth';

const router = Router();

// Allow both guest and logged in users if needed, but let's protect it for now
router.post('/query', protect, getChatResponse);

export default router;
