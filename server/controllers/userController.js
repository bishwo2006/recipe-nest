import User from '../models/User.js';

// @desc    Update chef profile photo and bio
// @route   PUT /api/users/profile
// @access  Private/Chef
export const updateChefProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
        user.name = req.body.name || user.name;
        
        if (req.file) {
            // Re-format the path correctly to be served
            user.photo = `/${req.file.path.replace(/\\/g, '/')}`;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            photo: updatedUser.photo,
            bio: updatedUser.bio,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
