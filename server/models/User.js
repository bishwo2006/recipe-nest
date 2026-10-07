import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['user', 'chef', 'admin'],
            default: 'user',
        },
        photo: {
            type: String,
            default: '',
        },
        bio: {
            type: String,
            default: '',
        },
        resetPasswordToken: String,
        resetPasswordExpire: Date,
        savedRecipes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Recipe'
        }],
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model('User', userSchema);
export default User;
