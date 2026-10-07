import express from 'express';
import Recipe from '../models/Recipe.js';
import Review from '../models/Review.js';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc  Get all approved recipes (with optional search)
// @route GET /api/user/recipes?search=&sort=rating
router.get('/recipes', async (req, res) => {
    try {
        const { search, sort } = req.query;
        let query = { status: 'approved' };

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
            ];
        }

        let recipes = await Recipe.find(query)
            .populate('chef', 'name photo')
            .sort(sort === 'rating' ? { averageRating: -1 } : { createdAt: -1 });

        // If searching also by chef name, filter additionally
        if (search) {
            recipes = recipes.filter(r =>
                r.title.toLowerCase().includes(search.toLowerCase()) ||
                r.chef?.name?.toLowerCase().includes(search.toLowerCase())
            );
        }

        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc  Get a single recipe with its reviews
// @route GET /api/user/recipes/:id
router.get('/recipes/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id).populate('chef', 'name photo bio');
        if (!recipe || recipe.status !== 'approved') {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        const reviews = await Review.find({ recipe: req.params.id, isHidden: false })
            .populate('user', 'name photo')
            .sort({ createdAt: -1 });

        res.json({ recipe, reviews });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc  Like / Unlike a recipe
// @route PUT /api/user/recipes/:id/like
router.put('/recipes/:id/like', protect, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

        const alreadyLiked = recipe.likes.includes(req.user._id);
        if (alreadyLiked) {
            recipe.likes = recipe.likes.filter(id => id.toString() !== req.user._id.toString());
        } else {
            recipe.likes.push(req.user._id);
        }
        await recipe.save();
        res.json({ likes: recipe.likes.length, liked: !alreadyLiked });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc  Save / Unsave a recipe
// @route PUT /api/user/recipes/:id/save
router.put('/recipes/:id/save', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const recipeId = req.params.id;
        const alreadySaved = user.savedRecipes.includes(recipeId);

        if (alreadySaved) {
            user.savedRecipes = user.savedRecipes.filter(id => id.toString() !== recipeId);
        } else {
            user.savedRecipes.push(recipeId);
        }
        await user.save();
        res.json({ saved: !alreadySaved });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc  Get user's saved recipes
// @route GET /api/user/saved
router.get('/saved', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate({
            path: 'savedRecipes',
            populate: { path: 'chef', select: 'name photo' }
        });
        res.json(user.savedRecipes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc  Submit a review
// @route POST /api/user/recipes/:id/review
router.post('/recipes/:id/review', protect, async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

        // Check already reviewed
        const existingReview = await Review.findOne({ user: req.user._id, recipe: req.params.id });
        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this recipe' });
        }

        const review = await Review.create({
            user: req.user._id,
            recipe: req.params.id,
            rating: Number(rating),
            comment,
        });

        // Recalculate average rating
        const allReviews = await Review.find({ recipe: req.params.id });
        recipe.numReviews = allReviews.length;
        recipe.averageRating = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;
        await recipe.save();

        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc  Get chef's public profile and their approved recipes
// @route GET /api/user/chef/:id
router.get('/chef/:id', async (req, res) => {
    try {
        const chef = await User.findById(req.params.id).select('name photo bio role');
        if (!chef || chef.role !== 'chef') {
            return res.status(404).json({ message: 'Chef not found' });
        }

        const recipes = await Recipe.find({ chef: req.params.id, status: 'approved' })
            .populate('chef', 'name photo')
            .sort({ createdAt: -1 });

        res.json({ chef, recipes });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
