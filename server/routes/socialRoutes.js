import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
import {
    createPost,
    getAllPosts,
    toggleLike,
    addComment,
    deletePost,
    deleteComment,
} from '../controllers/socialController.js';

const router = express.Router();

router.route('/')
    .get(protect, getAllPosts)
    .post(protect, upload.single('image'), createPost);

router.route('/:id')
    .delete(protect, deletePost);

router.put('/:id/like', protect, toggleLike);
router.post('/:id/comment', protect, addComment);
router.delete('/:postId/comment/:commentId', protect, deleteComment);

export default router;
