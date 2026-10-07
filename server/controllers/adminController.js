import Recipe from '../models/Recipe.js';
import User from '../models/User.js';
import Review from '../models/Review.js';
import Advertisement from '../models/Advertisement.js';

// --- User Management ---
// @desc    Get all users and chefs
// @route   GET /api/admin/users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: { $in: ['user', 'chef'] } })
            .select('-password -resetPasswordToken -resetPasswordExpire')
            .sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a user by admin
// @route   DELETE /api/admin/users/:id
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (user.role === 'admin') return res.status(403).json({ message: 'Cannot delete admin account' });

        await User.deleteOne({ _id: req.params.id });
        res.json({ message: 'User removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Analytics ---
// @desc    Get dashboard analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
export const getAnalytics = async (req, res) => {
    try {
        const userCount = await User.countDocuments({ role: 'user' });
        const chefCount = await User.countDocuments({ role: 'chef' });
        
        const approvedRecipes = await Recipe.countDocuments({ status: 'approved' });
        const pendingRecipes = await Recipe.countDocuments({ status: 'pending' });
        
        const reviewCount = await Review.countDocuments();
        const activeAds = await Advertisement.countDocuments({ isActive: true });

        res.json({
            users: userCount,
            chefs: chefCount,
            recipes: { approved: approvedRecipes, pending: pendingRecipes },
            reviews: reviewCount,
            ads: activeAds
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Recipes Moderation ---
// @desc    Get all pending recipes
// @route   GET /api/admin/recipes/pending
export const getPendingRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find({ status: 'pending' }).populate('chef', 'name email');
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Approve a recipe
// @route   PUT /api/admin/recipes/:id/approve
export const approveRecipe = async (req, res) => {
    try {
        console.log(`--- ADMIN APPROVE START: ID ${req.params.id} ---`);
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

        recipe.status = 'approved';
        recipe.adminFeedback = '';
        await recipe.save();

        res.json({ message: 'Recipe approved and published' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reject a recipe with feedback
// @route   PUT /api/admin/recipes/:id/reject
export const rejectRecipe = async (req, res) => {
    try {
        const { feedback } = req.body;
        console.log(`--- ADMIN REJECT START: ID ${req.params.id} ---`);
        console.log(`Feedback: ${feedback}`);
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

        if (!feedback) {
            return res.status(400).json({ message: 'Please provide feedback for rejection' });
        }

        recipe.status = 'rejected';
        recipe.adminFeedback = feedback;
        await recipe.save();

        res.json({ message: 'Recipe rejected with feedback' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Review Moderation ---
// @desc    Get all reviews (for moderation table)
// @route   GET /api/admin/reviews
export const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find().populate('user', 'name').populate('recipe', 'title').sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Toggle review visibility
// @route   PUT /api/admin/reviews/:id/toggle
export const toggleReviewVisibility = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ message: 'Review not found' });

        review.isHidden = !review.isHidden;
        await review.save();

        res.json({ message: `Review ${review.isHidden ? 'hidden' : 'visible'}` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Advertisements ---
// @desc    Create advertisement
// @route   POST /api/admin/advertisements
export const createAdvertisement = async (req, res) => {
    try {
        const { title, link } = req.body;

        if (!req.file || !title) {
            return res.status(400).json({ message: 'Title and image are required' });
        }

        const imagePath = `/${req.file.path.replace(/\\/g, '/')}`;

        const ad = new Advertisement({
            title,
            link: link || '#',
            image: imagePath,
        });

        await ad.save();
        res.status(201).json(ad);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete advertisement
// @route   DELETE /api/admin/advertisements/:id
export const deleteAdvertisement = async (req, res) => {
    try {
        const ad = await Advertisement.findById(req.params.id);
        if (!ad) return res.status(404).json({ message: 'Ad not found' });

        await Advertisement.deleteOne({ _id: req.params.id });
        res.json({ message: 'Advertisement deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all ads (admin view)
// @route   GET /api/admin/advertisements
export const getAllAdvertisements = async (req, res) => {
    try {
        const ads = await Advertisement.find().sort({ createdAt: -1 });
        res.json(ads);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
