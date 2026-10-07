import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { Check, X, Clock, Scroll } from 'lucide-react';
import ChefIcon from '../../components/ChefIcon';

const PendingRecipes = () => {
    const { user } = useAuth();
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Modal states
    const [rejectingId, setRejectingId] = useState(null);
    const [feedback, setFeedback] = useState('');
    const [viewRecipe, setViewRecipe] = useState(null);

    const fetchPending = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('http://localhost:5000/api/admin/recipes/pending', config);
            setRecipes(data);
        } catch (error) {
            toast.error('Failed to load pending recipes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPending();
    }, []);

    const handleApprove = async (id) => {
        if(window.confirm('Approve and publish this recipe?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.put(`http://localhost:5000/api/admin/recipes/${id}/approve`, {}, config);
                toast.success('Recipe Approved!');
                fetchPending();
            } catch (error) {
                toast.error('Failed to approve recipe');
            }
        }
    };

    const handleReject = async (e) => {
        e.preventDefault();
        if (!feedback.trim()) {
            return toast.error('Please provide rejection feedback');
        }
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`http://localhost:5000/api/admin/recipes/${rejectingId}/reject`, { feedback }, config);
            toast.success('Recipe rejected & feedback sent');
            setRejectingId(null);
            setFeedback('');
            fetchPending();
        } catch (error) {
            toast.error('Failed to reject recipe');
        }
    };

    if (loading) return <div>Loading...</div>;

    if (recipes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <Check className="w-16 h-16 text-emerald-400 mb-4" />
                <h3 className="text-xl font-bold text-slate-800">You're all caught up!</h3>
                <p className="text-slate-500 mt-2">There are no pending recipes awaiting review.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 relative">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                <Clock className="w-6 h-6 mr-2 text-amber-500" /> Pending Review
            </h2>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {recipes.map((recipe) => (
                    <div key={recipe._id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col md:flex-row hover:shadow-md hover:border-amber-200 transition-all">
                        <div className="md:w-2/5 h-48 md:h-auto cursor-pointer" onClick={() => setViewRecipe(recipe)}>
                            <img src={`http://localhost:5000${recipe.image}`} alt={recipe.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-6 md:w-3/5 flex flex-col">
                            <div className="flex items-start justify-between mb-1">
                                <h3 className="font-bold text-xl text-slate-800">{recipe.title}</h3>
                                <button onClick={() => setViewRecipe(recipe)} title="View full details" className="ml-2 p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors shrink-0">
                                    <Scroll className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="flex items-center text-sm text-slate-500 mb-4">
                                <ChefIcon className="w-4 h-4 mr-1" /> By {recipe.chef.name}
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 mb-4 text-sm flex-1">
                                <div>
                                    <span className="font-semibold text-slate-700 block mb-1">Ingredients:</span>
                                    <p className="text-slate-600 line-clamp-3">{recipe.ingredients}</p>
                                </div>
                                <div>
                                    <span className="font-semibold text-slate-700 block mb-1">Instructions:</span>
                                    <p className="text-slate-600 line-clamp-3">{recipe.instructions}</p>
                                </div>
                            </div>

                            <div className="flex space-x-3 mt-auto border-t border-slate-100 pt-4">
                                <button
                                    onClick={() => handleApprove(recipe._id)}
                                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
                                >
                                    <Check className="w-4 h-4 mr-1" /> Approve
                                </button>
                                <button
                                    onClick={() => setRejectingId(recipe._id)}
                                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg font-medium transition-colors flex items-center justify-center border border-red-200"
                                >
                                    <X className="w-4 h-4 mr-1" /> Reject
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Rejection Modal */}
            {rejectingId && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-800">Reject Recipe</h3>
                            <button onClick={() => setRejectingId(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleReject} className="p-6">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Provide feedback for the chef:</label>
                            <textarea
                                required
                                rows="4"
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:ring-2 focus:ring-red-500"
                                placeholder="E.g., The photo is too blurry, please upload a clearer image..."
                            />
                            <div className="mt-6 flex justify-end space-x-3">
                                <button type="button" onClick={() => setRejectingId(null)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium shadow-lg shadow-red-500/30">Confirm Rejection</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Full Recipe View Modal */}
            {viewRecipe && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setViewRecipe(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="relative h-64 w-full overflow-hidden shrink-0">
                            <img src={`http://localhost:5000${viewRecipe.image}`} alt={viewRecipe.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                            <div className="absolute bottom-6 left-6 right-12">
                                <div className="flex items-center text-white/70 text-sm mb-2">
                                    <ChefIcon className="w-4 h-4 mr-1" /> By {viewRecipe.chef?.name}
                                </div>
                                <h2 className="text-3xl font-black text-white drop-shadow-md">{viewRecipe.title}</h2>
                            </div>
                            <button onClick={() => setViewRecipe(null)} className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 backdrop-blur-md transition-colors">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="overflow-y-auto p-6 flex-1">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-3 border-b border-slate-200 pb-2">Ingredients</h3>
                                    <div className="text-slate-600 whitespace-pre-wrap leading-relaxed text-sm">{viewRecipe.ingredients}</div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-3 border-b border-slate-200 pb-2">Instructions</h3>
                                    <div className="text-slate-600 whitespace-pre-wrap leading-relaxed text-sm">{viewRecipe.instructions}</div>
                                </div>
                            </div>
                        </div>
                        <div className="p-5 bg-slate-50 border-t border-slate-100 flex justify-between items-center shrink-0">
                            <span className="text-sm text-slate-500">Submitted: {new Date(viewRecipe.createdAt).toLocaleDateString()}</span>
                            <div className="flex space-x-3">
                                <button onClick={() => { setViewRecipe(null); setRejectingId(viewRecipe._id); }} className="px-4 py-2 bg-red-50 border border-red-200 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors flex items-center">
                                    <X className="w-4 h-4 mr-1" /> Reject
                                </button>
                                <button onClick={() => { setViewRecipe(null); handleApprove(viewRecipe._id); }} className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors flex items-center shadow-lg shadow-emerald-500/20">
                                    <Check className="w-4 h-4 mr-1" /> Approve
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PendingRecipes;
