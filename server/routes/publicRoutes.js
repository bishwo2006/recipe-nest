import express from 'express';
import Advertisement from '../models/Advertisement.js';

const router = express.Router();

// @desc    Get all active ads
// @route   GET /api/public/advertisements
// @access  Public
router.get('/advertisements', async (req, res) => {
    try {
        const ads = await Advertisement.find({ isActive: true }).sort({ createdAt: -1 });
        res.json(ads);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
