import express from 'express';
import { updateChefProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.put('/profile', protect, upload.single('photo'), updateChefProfile);

export default router;
