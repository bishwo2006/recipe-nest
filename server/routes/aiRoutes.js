import express from 'express';
import { askAI } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST /api/ai/ask
// @access  Private
router.post('/ask', protect, askAI);

export default router;
