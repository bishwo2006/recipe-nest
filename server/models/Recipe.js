import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        image: {
            type: String, // Public path to image
            required: true,
        },
        ingredients: {
            type: String,
            required: true,
        },
        instructions: {
            type: String,
            required: true,
        },
        chef: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
        adminFeedback: {
            type: String,
            default: '',
        },
        likes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        averageRating: {
            type: Number,
            default: 0,
        },
        numReviews: {
            type: Number,
            default: 0,
        }
    },
    {
        timestamps: true,
    }
);

const Recipe = mongoose.model('Recipe', recipeSchema);
export default Recipe;
