import express from 'express';
import { createRecipe, getMyRecipes, updateRecipe, deleteRecipe, getRecipeById, getMyReviews } from '../controllers/recipeController.js';
import { protect, chefOnly } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, chefOnly, upload.single('image'), createRecipe);

router.route('/my')
    .get(protect, chefOnly, getMyRecipes);

router.route('/my/reviews')
    .get(protect, chefOnly, getMyReviews);

router.route('/:id')
    .get(protect, getRecipeById)
    .put(protect, chefOnly, upload.single('image'), updateRecipe)
    .delete(protect, chefOnly, deleteRecipe);

export default router;
