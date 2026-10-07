import Post from '../models/Post.js';

// @desc    Create new post
// @route   POST /api/social
// @access  Private
export const createPost = async (req, res) => {
    try {
        const { caption } = req.body;

        if (!caption) {
            return res.status(400).json({ message: 'Caption is required' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'Image is required' });
        }

        const imagePath = `/${req.file.path.replace(/\\/g, '/')}`;

        const post = new Post({
            user: req.user._id,
            image: imagePath,
            caption,
        });

        const createdPost = await post.save();
        
        // Populate user for the response
        const populatedPost = await Post.findById(createdPost._id).populate('user', 'name photo role');
        
        res.status(201).json(populatedPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all posts
// @route   GET /api/social
// @access  Private
export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('user', 'name photo role')
            .populate('comments.user', 'name photo role')
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Toggle like on post
// @route   PUT /api/social/:id/like
// @access  Private
export const toggleLike = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const liked = post.likes.includes(req.user._id);

        if (liked) {
            post.likes = post.likes.filter((id) => id.toString() !== req.user._id.toString());
        } else {
            post.likes.push(req.user._id);
        }

        await post.save();
        res.json({ liked: !liked, likes: post.likes.length });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add comment to post
// @route   POST /api/social/:id/comment
// @access  Private
export const addComment = async (req, res) => {
    try {
        const { text } = req.body;
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (!text) {
            return res.status(400).json({ message: 'Comment text is required' });
        }

        const comment = {
            user: req.user._id,
            text,
        };

        post.comments.push(comment);
        await post.save();

        const updatedPost = await Post.findById(req.params.id).populate('comments.user', 'name photo role');
        res.json(updatedPost.comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete post
// @route   DELETE /api/social/:id
// @access  Private
export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Only Admin OR Post Author can delete
        const isAuthor = post.user.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';

        if (!isAuthor && !isAdmin) {
            return res.status(403).json({ message: 'Not authorized to delete this post' });
        }

        await Post.deleteOne({ _id: post._id });
        res.json({ message: 'Post removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete comment
// @route   DELETE /api/social/:postId/comment/:commentId
// @access  Private
export const deleteComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const comment = post.comments.id(req.params.commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Logic: Post Owner OR Comment Author can delete
        const isPostOwner = post.user.toString() === req.user._id.toString();
        const isCommentAuthor = comment.user.toString() === req.user._id.toString();

        if (!isPostOwner && !isCommentAuthor) {
            return res.status(403).json({ message: 'Not authorized to delete this comment' });
        }

        // Remove the comment
        post.comments.pull(req.params.commentId);
        await post.save();

        res.json({ message: 'Comment removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
