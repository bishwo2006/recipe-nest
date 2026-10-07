import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { 
    ArrowLeft, 
    MessageSquare, 
    Heart, 
    Star, 
    ChefHat, 
    UtensilsCrossed, 
    Loader2, 
    Sparkles, 
    Bookmark, 
    UserCircle,
    Share2,
    Globe
} from 'lucide-react';
import ChefIcon from '../../components/ChefIcon';
import RecipeCard from '../../components/RecipeCard';
import RecipeModal from '../../components/RecipeModal';

const ChefPublicProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [chef, setChef] = useState(null);
    const [recipes, setRecipes] = useState([]);
    const [savedIds, setSavedIds] = useState([]);
    const [viewRecipe, setViewRecipe] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChefProfile = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get(`http://localhost:5000/api/user/chef/${id}`, config);
                setChef(data.chef);
                setRecipes(data.recipes);
            } catch (error) {
                toast.error('Failed to load chef profile');
                navigate(-1);
            }
        };

        const fetchSaved = async () => {
            if (!user?.token) return;
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('http://localhost:5000/api/user/saved', config);
                setSavedIds(data.map(r => r._id));
            } catch {}
        };

        const init = async () => {
            setLoading(true);
            await Promise.all([fetchChefProfile(), fetchSaved()]);
            setLoading(false);
        };

        if (id) init();
    }, [id, user?.token, navigate]);

    const handleToggleSave = async (recipeId) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.put(`http://localhost:5000/api/user/recipes/${recipeId}/save`, {}, config);
            setSavedIds(prev => data.saved ? [...prev, recipeId] : prev.filter(mid => mid !== recipeId));
            toast.success(data.saved ? '📌 Saved!' : 'Removed from saved');
        } catch { toast.error('Failed to update'); }
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-orange-50/30 space-y-4">
            <div className="relative">
                <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
                <ChefIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-orange-600" />
            </div>
            <p className="text-slate-400 font-medium animate-pulse text-sm uppercase tracking-widest">Opening culinary portfolio...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-orange-50/20 pb-20">
            {/* Header / Hero */}
            <div className="relative h-64 bg-slate-900 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600/40 to-slate-900/80 z-10"></div>
                <img 
                    src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
                    className="w-full h-full object-cover opacity-50"
                    alt="Kitchen background"
                />
                
                <button 
                    onClick={() => navigate(-1)}
                    className="absolute top-6 left-6 z-20 p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-white transition-all border border-white/10"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
            </div>

            <div className="max-w-6xl mx-auto px-6 -mt-32 relative z-20">
                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-orange-900/5 p-8 md:p-12 overflow-hidden border border-orange-100/50">
                    <div className="flex flex-col md:flex-row md:items-end space-y-6 md:space-y-0 md:space-x-10">
                        {/* Avatar */}
                        <div className="relative group">
                            <div className="w-40 h-40 rounded-3xl overflow-hidden ring-8 ring-white shadow-xl transform transition-transform group-hover:scale-[1.02]">
                                {chef?.photo ? (
                                    <img src={`http://localhost:5000${chef.photo}`} alt={chef.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-orange-100 flex items-center justify-center text-orange-500">
                                        <UserCircle className="w-20 h-20" />
                                    </div>
                                )}
                            </div>
                            <div className="absolute -bottom-3 -right-3 bg-orange-500 text-white p-3 rounded-2xl shadow-lg border-4 border-white">
                                <ChefIcon className="w-6 h-6" />
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                                <div>
                                    <h1 className="text-4xl font-black text-slate-800 mb-2">{chef?.name}</h1>
                                    <div className="flex items-center text-orange-600 font-bold bg-orange-50 px-3 py-1 rounded-full w-fit text-sm">
                                        <Sparkles className="w-4 h-4 mr-1.5" />
                                        Certified Master Chef
                                    </div>
                                </div>
                                <div className="flex space-x-3 mt-6 md:mt-0">
                                    <button className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-orange-600 border border-slate-100">
                                        <Share2 className="w-5 h-5" />
                                    </button>
                                    <button className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-orange-600 border border-slate-100">
                                        <Globe className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            <p className="text-slate-500 leading-relaxed max-w-2xl text-lg italic">
                                "{chef?.bio || "Cooking is an art, but baking is a science. I'm here to share the secrets of the kitchen with everyone who loves good food."}"
                            </p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-12 border-t border-orange-50">
                        <div className="bg-orange-50/50 p-6 rounded-3xl text-center border border-orange-100">
                            <p className="text-3xl font-black text-orange-600 mb-1">{recipes.length}</p>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Recipes</p>
                        </div>
                        <div className="bg-amber-50/50 p-6 rounded-3xl text-center border border-amber-100">
                            <p className="text-3xl font-black text-amber-600 mb-1">{recipes.reduce((acc, r) => acc + (r.numReviews || 0), 0)}</p>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Reviews</p>
                        </div>
                        <div className="bg-rose-50/50 p-6 rounded-3xl text-center border border-rose-100">
                            <p className="text-3xl font-black text-rose-600 mb-1">{recipes.reduce((acc, r) => acc + (r.likes?.length || 0), 0)}</p>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Total Likes</p>
                        </div>
                        <div className="bg-indigo-50/50 p-6 rounded-3xl text-center border border-indigo-100">
                            <p className="text-3xl font-black text-indigo-600 mb-1">4.9</p>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Avg Rating</p>
                        </div>
                    </div>
                </div>

                {/* Recipes Grid */}
                <div className="mt-16">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-3xl font-black text-slate-800 flex items-center">
                            <UtensilsCrossed className="w-8 h-8 mr-3 text-orange-500" />
                            Culinary Creations
                        </h2>
                        <div className="h-0.5 flex-1 mx-8 bg-gradient-to-r from-orange-100 to-transparent hidden md:block"></div>
                        <p className="text-slate-400 font-bold text-sm">{recipes.length} Masterpieces</p>
                    </div>

                    {recipes.length === 0 ? (
                        <div className="bg-white rounded-[2rem] p-20 text-center border border-slate-100 border-dashed">
                             <ChefHat className="w-16 h-16 text-slate-100 mx-auto mb-4" />
                             <h3 className="text-xl font-bold text-slate-400 italic">Chef is currently perfecting new recipes...</h3>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {recipes.map((recipe) => (
                                <RecipeCard 
                                    key={recipe._id} 
                                    recipe={recipe} 
                                    onView={setViewRecipe} 
                                    savedIds={savedIds} 
                                    onToggleSave={handleToggleSave} 
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Recipe Detail Modal */}
            {viewRecipe && (
                <RecipeModal 
                    recipe={viewRecipe} 
                    onClose={() => setViewRecipe(null)} 
                    savedIds={savedIds} 
                    onToggleSave={handleToggleSave} 
                />
            )}
        </div>
    );
};

export default ChefPublicProfile;
