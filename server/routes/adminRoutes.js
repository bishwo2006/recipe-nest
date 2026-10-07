import express from 'express';
import { 
    getAnalytics, 
    getPendingRecipes, 
    approveRecipe, 
    rejectRecipe,
    getAllReviews,
    toggleReviewVisibility,
    createAdvertisement,
    deleteAdvertisement,
    getAllAdvertisements,
    getAllUsers,
    deleteUser
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Apply middleware to all routes in this file
router.use(protect, adminOnly);

// Analytics
router.get('/analytics', getAnalytics);

// Users & Chefs
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

// Recipes
router.get('/recipes/pending', getPendingRecipes);
router.put('/recipes/:id/approve', approveRecipe);
router.put('/recipes/:id/reject', rejectRecipe);

// Reviews
router.get('/reviews', getAllReviews);
router.put('/reviews/:id/toggle', toggleReviewVisibility);

// Advertisements
router.route('/advertisements')
    .get(getAllAdvertisements)
    .post(upload.single('image'), createAdvertisement);
    
router.delete('/advertisements/:id', deleteAdvertisement);

export default router;
