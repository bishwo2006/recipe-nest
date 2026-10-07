import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Heart, MessageCircle, Send, Image as ImageIcon, Loader2, Sparkles, UserCircle, Camera, Trash2 } from 'lucide-react';
import ChefIcon from '../components/ChefIcon';

// ========================
// Post Card Component
// ========================
const PostCard = ({ post, onLike, onComment, onDeletePost, onDeleteComment }) => {
    const { user } = useAuth();
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [isLiking, setIsLiking] = useState(false);
    const isLiked = post.likes.includes(user?._id);

    const handleLike = async () => {
        if (isLiking) return;
        setIsLiking(true);
        await onLike(post._id);
        setIsLiking(false);
    };

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        onComment(post._id, commentText);
        setCommentText('');
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-8 transform transition-all hover:shadow-md">
            {/* Header */}
            <div className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    {post.user?.role === 'chef' ? (
                        <Link to={`/user/chef/${post.user?._id}`} className="relative group/avatar">
                            {post.user?.photo ? (
                                <img src={`http://localhost:5000${post.user.photo}`} alt={post.user.name} className="w-10 h-10 rounded-full object-cover border-2 border-orange-100 group-hover/avatar:border-orange-300 transition-all" />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 group-hover/avatar:bg-orange-100 transition-all">
                                    <UserCircle className="w-6 h-6" />
                                </div>
                            )}
                            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                                <ChefIcon className="w-4 h-4" />
                            </div>
                        </Link>
                    ) : (
                        <div className="relative">
                            {post.user?.photo ? (
                                <img src={`http://localhost:5000${post.user.photo}`} alt={post.user.name} className="w-10 h-10 rounded-full object-cover border-2 border-orange-100" />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                                    <UserCircle className="w-6 h-6" />
                                </div>
                            )}
                        </div>
                    )}
                    {post.user?.role === 'chef' ? (
                        <Link to={`/user/chef/${post.user?._id}`} className="group/name">
                            <h3 className="font-bold text-slate-800 text-sm group-hover/name:text-orange-600 transition-colors">{post.user?.name}</h3>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">{post.user?.role}</p>
                        </Link>
                    ) : (
                        <div>
                            <h3 className="font-bold text-slate-800 text-sm">{post.user?.name}</h3>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">{post.user?.role}</p>
                        </div>
                    )}
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-400 font-medium">
                        {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                    {(user?.role === 'admin' || post.user?._id === user?._id) && (
                        <button 
                            onClick={() => onDeletePost(post._id)}
                            className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete Post"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Image */}
            <div className="relative aspect-square md:aspect-video overflow-hidden bg-slate-50">
                <img 
                    src={`http://localhost:5000${post.image}`} 
                    alt={post.caption} 
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Content & Actions */}
            <div className="p-5">
                <div className="flex items-center space-x-4 mb-4">
                    <button 
                        onClick={handleLike}
                        disabled={isLiking}
                        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full transition-all ${isLiked ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                    >
                        <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500' : ''}`} />
                        <span className="text-sm font-bold">{post.likes.length}</span>
                    </button>
                    <button 
                        onClick={() => setShowComments(!showComments)}
                        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full transition-all ${showComments ? 'bg-blue-50 text-blue-500' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                    >
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-sm font-bold">{post.comments.length}</span>
                    </button>
                </div>

                <p className="text-slate-700 text-sm leading-relaxed mb-4">
                    <span className="font-bold mr-2">{post.user?.name}</span>
                    {post.caption}
                </p>

                {/* Comments Section */}
                {showComments && (
                    <div className="mt-4 pt-4 border-t border-slate-50 space-y-4">
                        <div className="max-h-60 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
                            {post.comments.length === 0 ? (
                                <p className="text-center text-slate-400 text-xs py-4 italic">No comments yet. Be the first!</p>
                            ) : (
                                post.comments.map((comment, idx) => (
                                    <div key={idx} className="flex space-x-3 items-start">
                                        {comment.user?.role === 'chef' ? (
                                            <Link to={`/user/chef/${comment.user?._id}`}>
                                                {comment.user?.photo ? (
                                                    <img src={`http://localhost:5000${comment.user.photo}`} className="w-7 h-7 rounded-full object-cover" alt="" />
                                                ) : (
                                                    <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-400"><UserCircle className="w-4 h-4" /></div>
                                                )}
                                            </Link>
                                        ) : (
                                            <div>
                                                {comment.user?.photo ? (
                                                    <img src={`http://localhost:5000${comment.user.photo}`} className="w-7 h-7 rounded-full object-cover" alt="" />
                                                ) : (
                                                    <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-400"><UserCircle className="w-4 h-4" /></div>
                                                )}
                                            </div>
                                        )}
                                        <div className="flex-1 bg-slate-50 rounded-2xl px-4 py-2 relative group-item">
                                            <div className="flex justify-between items-start">
                                                {comment.user?.role === 'chef' ? (
                                                    <Link to={`/user/chef/${comment.user?._id}`} className="text-xs font-bold text-slate-800 mb-0.5 hover:text-orange-600">{comment.user?.name}</Link>
                                                ) : (
                                                    <p className="text-xs font-bold text-slate-800 mb-0.5">{comment.user?.name}</p>
                                                )}
                                                {(post.user?._id === user?._id || comment.user?._id === user?._id) && (
                                                    <button 
                                                        onClick={() => onDeleteComment(post._id, comment._id)}
                                                        className="text-slate-300 hover:text-red-500 p-1 -mr-2 transition-colors"
                                                        title="Delete Comment"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-600">{comment.text}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <form onSubmit={handleCommentSubmit} className="flex items-center space-x-2 mt-4">
                            <input 
                                type="text"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Add a comment..."
                                className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-orange-200 outline-none"
                            />
                            <button 
                                type="submit"
                                disabled={!commentText.trim()}
                                className="p-2 bg-orange-500 text-white rounded-xl shadow-sm hover:bg-orange-600 disabled:opacity-50 transition-colors"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

// ========================
// Main Social Feed Page
// ========================
const SocialFeed = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const fetchPosts = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('http://localhost:5000/api/social', config);
            setPosts(data);
        } catch (error) {
            toast.error('Failed to load feed');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [user.token]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handlePostSubmit = async (e) => {
        e.preventDefault();
        if (!image || !caption.trim()) {
             return toast.error('Check your image and caption!');
        }

        setSubmitting(true);
        const formData = new FormData();
        formData.append('image', image);
        formData.append('caption', caption);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}`,
                },
            };
            await axios.post('http://localhost:5000/api/social', formData, config);
            toast.success('Creation shared with the community!');
            setCaption('');
            setImage(null);
            setPreview('');
            fetchPosts();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to post');
        } finally {
            setSubmitting(false);
        }
    };

    const handleLike = async (postId) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.put(`http://localhost:5000/api/social/${postId}/like`, {}, config);
            setPosts(posts.map(p => p._id === postId ? { ...p, likes: data.liked ? [...p.likes, user._id] : p.likes.filter(id => id !== user._id) } : p));
        } catch (error) {
            toast.error('Failed to like post');
        }
    };

    const handleComment = async (postId, text) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.post(`http://localhost:5000/api/social/${postId}/comment`, { text }, config);
            setPosts(posts.map(p => p._id === postId ? { ...p, comments: data } : p));
            toast.success('Comment added');
        } catch (error) {
            toast.error('Failed to add comment');
        }
    };

    const handleDeletePost = async (postId) => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.delete(`http://localhost:5000/api/social/${postId}`, config);
            setPosts(posts.filter(p => p._id !== postId));
            toast.success('Post removed');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete post');
        }
    };

    const handleDeleteComment = async (postId, commentId) => {
        if (!window.confirm('Delete this comment?')) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.delete(`http://localhost:5000/api/social/${postId}/comment/${commentId}`, config);
            setPosts(posts.map(p => p._id === postId ? { ...p, comments: p.comments.filter(c => c._id !== commentId) } : p));
            toast.success('Comment removed');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete comment');
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
             <div className="relative">
                <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
                <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-amber-400" />
             </div>
             <p className="text-slate-400 font-medium animate-pulse text-sm uppercase tracking-widest">Fetching the community feed...</p>
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto py-6">
            <h2 className="text-3xl font-black text-slate-800 mb-8 flex items-center">
                <Camera className="w-8 h-8 mr-3 text-orange-500" /> Community Wall
            </h2>

            {/* Create Post Card */}
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 mb-12">
                <form onSubmit={handlePostSubmit} className="space-y-4">
                    <div className="flex items-center space-x-3 mb-2">
                         <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
                             <ImageIcon className="w-5 h-5" />
                         </div>
                         <h3 className="font-bold text-slate-700">Share your latest creation</h3>
                    </div>
                    
                    <textarea 
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        placeholder="What's cooking, chef? Share the secret behind this beautiful dish..."
                        className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm text-slate-700 focus:ring-2 focus:ring-orange-200 outline-none resize-none h-24"
                    />

                    {preview && (
                        <div className="relative group w-full aspect-video rounded-2xl overflow-hidden border-2 border-dashed border-slate-100">
                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                            <button 
                                type="button"
                                onClick={() => { setImage(null); setPreview(''); }}
                                className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full hover:bg-black/80 backdrop-blur-sm transition-all"
                            >
                                <Loader2 className="w-4 h-4 rotate-45" />
                            </button>
                        </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                        <label className="flex items-center space-x-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl cursor-pointer transition-colors text-sm font-bold">
                            <ImageIcon className="w-4 h-4 text-orange-500" />
                            <span>{image ? 'Change Photo' : 'Add Photo'}</span>
                            <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                        </label>

                        <button 
                            type="submit"
                            disabled={submitting || !image || !caption.trim()}
                            className="flex items-center space-x-2 px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl shadow-lg shadow-orange-600/20 disabled:opacity-50 transition-all font-bold"
                        >
                            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            <span>Post Creation</span>
                        </button>
                    </div>
                </form>
            </div>

            {/* Feed */}
            <div className="space-y-4">
                {posts.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                        <Camera className="w-16 h-16 text-slate-100 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-500">The wall is empty!</h3>
                        <p className="text-slate-400 text-sm">Be the first to share your cooking journey.</p>
                    </div>
                ) : (
                    posts.map((post) => (
                        <PostCard 
                            key={post._id} 
                            post={post} 
                            onLike={handleLike}
                            onComment={handleComment}
                            onDeletePost={handleDeletePost}
                            onDeleteComment={handleDeleteComment}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default SocialFeed;
