import Recipe from '../models/Recipe.js';
import Review from '../models/Review.js';

// @desc    Create new recipe
// @route   POST /api/recipes
// @access  Private/Chef
export const createRecipe = async (req, res) => {
    try {
        console.log('--- RECIPE SUBMISSION START ---');
        console.log('Body:', req.body);
        console.log('File:', req.file);
        console.log('User Role:', req.user?.role);

        const { title, ingredients, instructions } = req.body;

        if (!title || !ingredients || !instructions) {
            console.log('Validation Failed: Missing fields');
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        if (!req.file) {
            console.log('Validation Failed: Missing image');
            return res.status(400).json({ message: 'Please provide an image' });
        }

        const imagePath = `/${req.file.path.replace(/\\/g, '/')}`;

        const recipe = new Recipe({
            title,
            ingredients,
            instructions,
            image: imagePath,
            chef: req.user._id,
            status: 'pending', // Admins will review
        });

        console.log('Saving recipe to DB...');
        const createdRecipe = await recipe.save();
        console.log('Recipe Created Successfully:', createdRecipe._id);
        res.status(201).json(createdRecipe);
    } catch (error) {
        console.error('--- RECIPE SUBMISSION ERROR ---');
        console.error(error);
        res.status(500).json({ message: error.message || 'Internal Server Error during submission' });
    }
};

// @desc    Get logged in chef's recipes
// @route   GET /api/recipes/my
// @access  Private/Chef
export const getMyRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find({ chef: req.user._id }).sort({ createdAt: -1 });
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get recipe by ID
// @route   GET /api/recipes/:id
// @access  Private
export const getRecipeById = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        res.json(recipe);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update recipe
// @route   PUT /api/recipes/:id
// @access  Private/Chef
export const updateRecipe = async (req, res) => {
    try {
        const { title, ingredients, instructions } = req.body;
        const recipe = await Recipe.findById(req.params.id);

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        if (recipe.chef.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to edit this recipe' });
        }

        recipe.title = title || recipe.title;
        recipe.ingredients = ingredients || recipe.ingredients;
        recipe.instructions = instructions || recipe.instructions;
        
        if (req.file) {
             recipe.image = `/${req.file.path.replace(/\\/g, '/')}`;
        }

        // Reset status to pending when edited
        recipe.status = 'pending';
        recipe.adminFeedback = '';

        const updatedRecipe = await recipe.save();
        res.json(updatedRecipe);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete recipe
// @route   DELETE /api/recipes/:id
// @access  Private/Chef
export const deleteRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        if (recipe.chef.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this recipe' });
        }

        await Recipe.deleteOne({ _id: req.params.id });
        res.json({ message: 'Recipe removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all reviews for chef's recipes
// @route   GET /api/recipes/my/reviews
// @access  Private/Chef
export const getMyReviews = async (req, res) => {
    try {
        // Find all chef's recipes first
        const myRecipes = await Recipe.find({ chef: req.user._id }).select('_id title image');
        const recipeIds = myRecipes.map(r => r._id);

        // Find all visible reviews on those recipes
        const reviews = await Review.find({ recipe: { $in: recipeIds }, isHidden: false })
            .populate('user', 'name photo')
            .populate('recipe', 'title image')
            .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
