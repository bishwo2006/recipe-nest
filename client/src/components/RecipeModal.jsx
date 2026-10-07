import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { X, Heart, Bookmark, Star, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ChefIcon from './ChefIcon';
import StarRating from './StarRating';

const RecipeModal = ({ recipe, onClose, savedIds, onToggleSave }) => {
    const { user } = useAuth();
    const [data, setData] = useState(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [likes, setLikes] = useState(recipe.likes?.length || 0);
    const [liked, setLiked] = useState(recipe.likes?.includes(user?._id));

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/user/recipes/${recipe._id}`);
                setData(res.data);
                setLikes(res.data.recipe.likes?.length || 0);
                setLiked(res.data.recipe.likes?.includes(user?._id));
            } catch {}
        };
        fetch();
    }, [recipe._id, user?._id]);

    const handleLike = async () => {
        if (!user) return toast.error('Login required to like');
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const res = await axios.put(`http://localhost:5000/api/user/recipes/${recipe._id}/like`, {}, config);
            setLikes(res.data.likes);
            setLiked(res.data.liked);
        } catch { toast.error('Failed to update like'); }
    };

    const handleReview = async (e) => {
        e.preventDefault();
        if (!user) return toast.error('Login required to review');
        if (!rating) return toast.error('Please select a star rating');
        setSubmitting(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post(`http://localhost:5000/api/user/recipes/${recipe._id}/review`, { rating, comment }, config);
            toast.success('Review submitted!');
            setRating(0);
            setComment('');
            const res = await axios.get(`http://localhost:5000/api/user/recipes/${recipe._id}`);
            setData(res.data);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit review');
        } finally { setSubmitting(false); }
    };

    const isSaved = savedIds?.includes(recipe._id);

    return (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="relative h-64 shrink-0">
                    <img src={`http://localhost:5000${recipe.image}`} alt={recipe.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <button onClick={onClose} className="absolute top-4 right-4 bg-black/40 hover:bg-black/70 text-white rounded-full p-2 backdrop-blur-sm transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-5 left-6 right-20">
                        <div className="flex items-center text-white/70 text-sm mb-2 space-x-2">
                            <ChefIcon className="w-3.5 h-3.5" />
                            <Link to={`/user/chef/${data?.recipe?.chef?._id}`} className="hover:text-white transition-colors">
                                {data?.recipe?.chef?.name}
                            </Link>
                        </div>
                        <h2 className="text-2xl font-black text-white">{recipe.title}</h2>
                    </div>
                    <div className="absolute bottom-5 right-5 flex flex-col space-y-2">
                        <button onClick={handleLike} className={`p-2.5 rounded-full backdrop-blur-sm transition-all ${liked ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-red-500'}`}>
                            <Heart className={`w-5 h-5 ${liked ? 'fill-white' : ''}`} />
                        </button>
                        <button onClick={() => onToggleSave(recipe._id)} className={`p-2.5 rounded-full backdrop-blur-sm transition-all ${isSaved ? 'bg-orange-500 text-white' : 'bg-white/20 text-white hover:bg-orange-500'}`}>
                            <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-white' : ''}`} />
                        </button>
                    </div>
                </div>

                <div className="overflow-y-auto flex-1 p-6 space-y-6">
                    <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1"><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /><span className="font-bold">{data?.recipe?.averageRating?.toFixed(1) || '0'}</span><span className="text-slate-400">({data?.recipe?.numReviews} reviews)</span></div>
                        <div className="flex items-center space-x-1 text-slate-500"><Heart className="w-4 h-4 text-red-400" /><span>{likes} likes</span></div>
                    </div>

                    {data?.recipe?.chef?.bio && (
                        <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
                            <p className="text-xs font-semibold text-orange-600 uppercase tracking-wider mb-1">About the Chef</p>
                            <p className="text-slate-600 text-sm">{data.recipe.chef.bio}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div><h3 className="font-bold text-slate-800 mb-3 pb-2 border-b border-slate-100">🥗 Ingredients</h3><div className="text-slate-600 text-sm whitespace-pre-wrap leading-relaxed">{recipe.ingredients}</div></div>
                        <div><h3 className="font-bold text-slate-800 mb-3 pb-2 border-b border-slate-100">👨‍🍳 Instructions</h3><div className="text-slate-600 text-sm whitespace-pre-wrap leading-relaxed">{recipe.instructions}</div></div>
                    </div>

                    <div>
                        <h3 className="font-bold text-slate-800 mb-4">💬 Reviews</h3>
                        {data?.reviews?.length > 0 ? (
                            <div className="space-y-3">
                                {data.reviews.map(r => (
                                    <div key={r._id} className="flex space-x-3">
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-bold text-sm shrink-0">{r.user?.name?.charAt(0).toUpperCase()}</div>
                                        <div className="flex-1 bg-slate-50 rounded-xl p-3">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-semibold text-slate-800 text-sm">{r.user?.name}</span>
                                                <div className="flex">{[1,2,3,4,5].map(s => <Star key={s} className={`w-3 h-3 ${s <= r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`} />)}</div>
                                            </div>
                                            <p className="text-slate-600 text-sm">{r.comment}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-400 text-sm text-center py-4">No reviews yet. Be the first!</p>
                        )}
                    </div>

                    {user && (
                        <div className="border-t border-slate-100 pt-6">
                            <h3 className="font-bold text-slate-800 mb-4">Leave a Review</h3>
                            <form onSubmit={handleReview} className="space-y-4">
                                <StarRating value={rating} onChange={setRating} />
                                <textarea rows="3" value={comment} onChange={e => setComment(e.target.value)} placeholder="Share your thoughts about this recipe..." className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-orange-400 resize-none" required />
                                <button type="submit" disabled={submitting} className="flex items-center px-5 py-2.5 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-xl font-semibold text-sm shadow-lg shadow-orange-500/25 hover:opacity-90 transition-opacity disabled:opacity-50">
                                    <Send className="w-4 h-4 mr-2" />
                                    {submitting ? 'Submitting...' : 'Post Review'}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecipeModal;
