import express from 'express';
import { protect } from '../middleware/auth';
import * as chatbotController from '../controllers/chatbot.controller';

const router = express.Router();

router.post('/message', protect, chatbotController.handleChat);
router.get('/broadcasts', protect, chatbotController.getBroadcasts);

export default router;
