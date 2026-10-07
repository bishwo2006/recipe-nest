import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { Trash2, Edit, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const MyRecipes = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewRecipe, setViewRecipe] = useState(null);

    const fetchRecipes = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('http://localhost:5000/api/recipes/my', config);
            setRecipes(data);
        } catch (error) {
            toast.error('Failed to load recipes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecipes();
    }, []);

    const deleteRecipe = async (id, e) => {
        if(e) e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this recipe?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.delete(`http://localhost:5000/api/recipes/${id}`, config);
                toast.success('Recipe deleted');
                fetchRecipes();
            } catch (error) {
                toast.error('Failed to delete recipe');
            }
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" /> Approved</span>;
            case 'rejected':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1" /> Needs Revision</span>;
            default:
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" /> Pending</span>;
        }
    };

    if (loading) return <div>Loading...</div>;

    if (recipes.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-slate-500 font-medium">You haven't added any recipes yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-800">My Recipes</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {recipes.map((recipe) => (
                    <div 
                        key={recipe._id} 
                        onClick={() => setViewRecipe(recipe)}
                        className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col group hover:shadow-md hover:border-orange-200 transition-all cursor-pointer"
                    >
                        <div className="h-48 relative overflow-hidden">
                            <img src={`http://localhost:5000${recipe.image}`} alt={recipe.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            <div className="absolute top-4 right-4">
                                {getStatusBadge(recipe.status)}
                            </div>
                        </div>
                        
                        <div className="p-5 flex-1 flex flex-col">
                            <h3 className="font-bold text-lg text-slate-800 mb-2 truncate">{recipe.title}</h3>
                            
                            <div className="flex-1">
                                {recipe.status === 'rejected' && recipe.adminFeedback && (
                                    <div className="bg-red-50 border border-red-100 rounded-lg p-3 mt-2">
                                        <p className="text-xs font-semibold text-red-800 mb-1 flex items-center">
                                            <AlertCircle className="w-3 h-3 mr-1" /> Admin Feedback:
                                        </p>
                                        <p className="text-sm text-red-700 italic">{recipe.adminFeedback}</p>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                                <span className="text-xs text-slate-400">Added: {new Date(recipe.createdAt).toLocaleDateString()}</span>
                                <div className="flex space-x-2 relative z-10">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); navigate(`/chef/edit-recipe/${recipe._id}`); }}
                                        className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors tooltip"
                                        title="Edit Recipe"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={(e) => deleteRecipe(recipe._id, e)}
                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete Recipe"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* View Recipe Modal */}
            {viewRecipe && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6" onClick={() => setViewRecipe(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col transform transition-all" onClick={e => e.stopPropagation()}>
                        <div className="relative h-64 sm:h-80 w-full overflow-hidden shrink-0">
                            <img src={`http://localhost:5000${viewRecipe.image}`} alt={viewRecipe.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                            <div className="absolute bottom-6 left-6 right-6">
                                {getStatusBadge(viewRecipe.status)}
                                <h2 className="text-3xl font-black text-white mt-3 drop-shadow-md">{viewRecipe.title}</h2>
                            </div>
                            <button onClick={() => setViewRecipe(null)} className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 backdrop-blur-md transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        
                        <div className="overflow-y-auto p-6 sm:p-8 flex-1">
                            {viewRecipe.status === 'rejected' && viewRecipe.adminFeedback && (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
                                    <h4 className="text-red-800 font-bold flex items-center mb-1"><AlertCircle className="w-4 h-4 mr-2" /> Action Required</h4>
                                    <p className="text-red-700 text-sm">{viewRecipe.adminFeedback}</p>
                                </div>
                            )}
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">Ingredients</h3>
                                    <div className="text-slate-600 whitespace-pre-wrap leading-relaxed text-sm">
                                        {viewRecipe.ingredients}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">Instructions</h3>
                                    <div className="text-slate-600 whitespace-pre-wrap leading-relaxed text-sm">
                                        {viewRecipe.instructions}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-between shrink-0 rounded-b-2xl">
                            <span className="text-sm text-slate-500">Submitted on: {new Date(viewRecipe.createdAt).toLocaleDateString()}</span>
                            <button 
                                onClick={() => {
                                    setViewRecipe(null);
                                    navigate(`/chef/edit-recipe/${viewRecipe._id}`);
                                }}
                                className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors shadow-lg shadow-orange-500/20"
                            >
                                Edit Recipe
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyRecipes;
