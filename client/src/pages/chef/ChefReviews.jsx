import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { MessageSquare, Star, User as UserIcon, Filter } from 'lucide-react';

const StarDisplay = ({ value }) => (
    <div className="flex items-center space-x-0.5">
        {[1, 2, 3, 4, 5].map(s => (
            <Star key={s} className={`w-3.5 h-3.5 ${s <= value ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`} />
        ))}
    </div>
);

const ChefReviews = () => {
    const { user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all' | '5' | '4' | '3' | '2' | '1'

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('http://localhost:5000/api/recipes/my/reviews', config);
                setReviews(data);
            } catch (err) {
                toast.error('Failed to load reviews');
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, [user.token]);

    const filtered = filter === 'all' ? reviews : reviews.filter(r => r.rating === Number(filter));

    // Summary stats
    const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : 0;
    const ratingCounts = [5, 4, 3, 2, 1].map(n => ({ star: n, count: reviews.filter(r => r.rating === n).length }));

    if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div></div>;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                    <MessageSquare className="w-6 h-6 mr-2 text-orange-500" /> My Reviews
                </h2>
                <p className="text-slate-500 text-sm mt-1">All customer reviews on your published recipes</p>
            </div>

            {reviews.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center py-20">
                    <MessageSquare className="w-14 h-14 text-slate-200 mb-4" />
                    <h3 className="font-bold text-slate-700 text-lg">No reviews yet</h3>
                    <p className="text-slate-400 text-sm mt-1">Once users review your approved recipes, they'll appear here.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Stats Card */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 h-fit">
                        <h3 className="font-bold text-slate-700 mb-4 text-sm uppercase tracking-wider">Rating Summary</h3>
                        <div className="flex items-end space-x-3 mb-6">
                            <span className="text-5xl font-black text-slate-800">{avgRating}</span>
                            <div className="pb-1">
                                <StarDisplay value={Math.round(Number(avgRating))} />
                                <p className="text-slate-400 text-xs mt-1">{reviews.length} total reviews</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            {ratingCounts.map(({ star, count }) => (
                                <button
                                    key={star}
                                    onClick={() => setFilter(filter === String(star) ? 'all' : String(star))}
                                    className={`w-full flex items-center space-x-2 text-sm rounded-lg px-2 py-1.5 transition-colors ${filter === String(star) ? 'bg-orange-50 border border-orange-200' : 'hover:bg-slate-50'}`}
                                >
                                    <div className="flex items-center space-x-0.5 shrink-0">
                                        {[...Array(star)].map((_, i) => <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
                                    </div>
                                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-yellow-400 rounded-full transition-all"
                                            style={{ width: reviews.length > 0 ? `${(count / reviews.length) * 100}%` : '0%' }}
                                        />
                                    </div>
                                    <span className="text-slate-500 text-xs w-4 text-right">{count}</span>
                                </button>
                            ))}
                        </div>

                        {filter !== 'all' && (
                            <button onClick={() => setFilter('all')} className="mt-4 w-full text-xs text-orange-500 hover:text-orange-600 font-medium">
                                Clear filter
                            </button>
                        )}
                    </div>

                    {/* Review List */}
                    <div className="lg:col-span-2 space-y-4">
                        {filtered.length === 0 && (
                            <div className="text-center py-12 text-slate-400 bg-white rounded-2xl border border-slate-100">
                                No {filter}-star reviews found.
                            </div>
                        )}
                        {filtered.map(review => (
                            <div key={review._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex space-x-4 hover:shadow-md transition-shadow">
                                {/* Avatar */}
                                <div className="shrink-0">
                                    {review.user?.photo ? (
                                        <img src={`http://localhost:5000${review.user.photo}`} alt={review.user.name} className="w-10 h-10 rounded-full object-cover border-2 border-orange-100" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-bold">
                                            {review.user?.name?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between flex-wrap gap-2">
                                        <div>
                                            <p className="font-semibold text-slate-800 text-sm">{review.user?.name}</p>
                                            <StarDisplay value={review.rating} />
                                        </div>
                                        {/* Recipe tag */}
                                        <div className="flex items-center space-x-2 bg-orange-50 border border-orange-100 rounded-lg px-2.5 py-1 shrink-0">
                                            {review.recipe?.image && (
                                                <img src={`http://localhost:5000${review.recipe.image}`} alt="" className="w-5 h-5 rounded object-cover" />
                                            )}
                                            <span className="text-xs font-medium text-orange-700 truncate max-w-[120px]">{review.recipe?.title}</span>
                                        </div>
                                    </div>
                                    <p className="text-slate-600 text-sm mt-2 leading-relaxed">{review.comment}</p>
                                    <p className="text-slate-400 text-xs mt-2">{new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChefReviews;
