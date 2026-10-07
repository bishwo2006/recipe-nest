import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        recipe: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Recipe',
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            required: true,
        },
        isHidden: {
            type: Boolean,
            default: false, // For admin moderation
        }
    },
    {
        timestamps: true,
    }
);

const Review = mongoose.model('Review', reviewSchema);
export default Review;
