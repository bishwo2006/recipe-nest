import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, MessageSquare } from 'lucide-react';

const ManageReviews = () => {
    const { user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchReviews = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('http://localhost:5000/api/admin/reviews', config);
            setReviews(data);
        } catch (error) {
            toast.error('Failed to load reviews');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const toggleVisibility = async (id) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`http://localhost:5000/api/admin/reviews/${id}/toggle`, {}, config);
            fetchReviews();
            toast.success('Review visibility toggled');
        } catch (error) {
            toast.error('Failed to toggle visibility');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6 flex flex-col h-full">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                <MessageSquare className="w-6 h-6 mr-2 text-purple-500" /> Review Moderation
            </h2>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex-1 overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm font-medium uppercase tracking-wider">
                                <th className="p-4">Author</th>
                                <th className="p-4">Recipe</th>
                                <th className="p-4">Rating</th>
                                <th className="p-4 w-2/5">Comment</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                            {reviews.map((review) => (
                                <tr key={review._id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-4 font-medium">{review.user?.name || 'Unknown User'}</td>
                                    <td className="p-4">{review.recipe?.title || 'Unknown Recipe'}</td>
                                    <td className="p-4">
                                        <div className="flex text-yellow-500">
                                            {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <p className={`line-clamp-2 ${review.isHidden ? 'text-slate-400 line-through' : ''}`}>
                                            {review.comment}
                                        </p>
                                    </td>
                                    <td className="p-4">
                                        {review.isHidden ? (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">Hidden</span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">Visible</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button 
                                            onClick={() => toggleVisibility(review._id)}
                                            className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                            title={review.isHidden ? "Make Visible" : "Hide from users"}
                                        >
                                            {review.isHidden ? <Eye className="w-5 h-5"/> : <EyeOff className="w-5 h-5"/>}
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {reviews.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-slate-500">No reviews found on the platform yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageReviews;
