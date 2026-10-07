import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { Search, Heart, Bookmark, Star, X, Send, ChevronLeft, ChevronRight, Grid3X3, Sparkles, Bot, Wand2, UserCircle } from 'lucide-react';
import AdSlider from '../../components/AdSlider';
import goluIcon from '../../assets/golumolu.png';
import ChefIcon from '../../components/ChefIcon';

import StarRating from '../../components/StarRating';
import RecipeCard from '../../components/RecipeCard';
import RecipeModal from '../../components/RecipeModal';

// ========================
// All Recipes Drawer Modal
// ========================
const AllRecipesDrawer = ({ recipes, onClose, savedIds, onToggleSave, onView }) => (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
        <div className="bg-white w-full sm:rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col sm:max-w-6xl sm:mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-white sticky top-0 z-10">
                <div>
                    <h2 className="text-xl font-black text-slate-800">🍽️ All Recipes</h2>
                    <p className="text-slate-400 text-sm">{recipes.length} recipes available</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                    <X className="w-5 h-5 text-slate-500" />
                </button>
            </div>
            <div className="overflow-y-auto p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {recipes.map(recipe => (
                        <RecipeCard key={recipe._id} recipe={recipe} onView={(r) => { onClose(); onView(r); }} savedIds={savedIds} onToggleSave={onToggleSave} />
                    ))}
                    {recipes.length === 0 && (
                        <div className="col-span-full text-center py-16 text-slate-400">No recipes yet</div>
                    )}
                </div>
            </div>
        </div>
    </div>
);

// ========================
// Main UserHome Page
// ========================
const UserHome = () => {
    const { user } = useAuth();
    const [recipes, setRecipes] = useState([]);
    const [topRated, setTopRated] = useState([]);
    const [savedIds, setSavedIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [viewRecipe, setViewRecipe] = useState(null);
    const [showAllRecipes, setShowAllRecipes] = useState(false);
    const sliderRef = useRef(null);

    const fetchRecipes = useCallback(async (q = '') => {
        const params = q ? `?search=${q}` : '';
        const { data } = await axios.get(`http://localhost:5000/api/user/recipes${params}`);
        return data;
    }, []);

    const fetchSaved = useCallback(async () => {
        if (!user?.token) return [];
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('http://localhost:5000/api/user/saved', config);
        return data.map(r => r._id);
    }, [user?.token]);

    useEffect(() => {
        const init = async () => {
            try {
                const [all, top, saved] = await Promise.all([
                    fetchRecipes(),
                    axios.get('http://localhost:5000/api/user/recipes?sort=rating').then(r => r.data.slice(0, 5)),
                    fetchSaved(),
                ]);
                setRecipes(all);
                setTopRated(top);
                setSavedIds(saved);
            } catch { toast.error('Failed to load recipes'); }
            finally { setLoading(false); }
        };
        init();
    }, [fetchRecipes, fetchSaved]);

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const data = await fetchRecipes(search);
            setRecipes(data);
        } catch {}
    };

    const handleToggleSave = async (recipeId) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.put(`http://localhost:5000/api/user/recipes/${recipeId}/save`, {}, config);
            setSavedIds(prev => data.saved ? [...prev, recipeId] : prev.filter(id => id !== recipeId));
            toast.success(data.saved ? '📌 Saved!' : 'Removed from saved');
        } catch { toast.error('Failed to update'); }
    };

    const scroll = (dir) => {
        if (sliderRef.current) sliderRef.current.scrollBy({ left: dir === 'left' ? -280 : 280, behavior: 'smooth' });
    };

    if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div></div>;

    return (
        <div className="space-y-10">
            {/* Ad Slider */}
            <AdSlider />

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
                <div className="flex items-center shadow-xl shadow-slate-200/60 rounded-2xl overflow-hidden bg-white">
                    <Search className="ml-5 w-5 h-5 text-slate-400 shrink-0" />
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by recipe name or chef name..." className="flex-1 pl-3 pr-4 py-4 text-slate-700 bg-white outline-none text-base" />
                    {search && <button type="button" onClick={() => { setSearch(''); fetchRecipes().then(setRecipes); }} className="pr-3"><X className="w-4 h-4 text-slate-400 hover:text-slate-600" /></button>}
                    <button type="submit" className="px-6 py-4 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold text-sm hover:opacity-90 transition-opacity whitespace-nowrap">Search</button>
                </div>
            </form>

            {/* Search Results */}
            {search && (
                <section>
                    <h2 className="text-lg font-black text-slate-800 mb-4">Results for "{search}"</h2>
                    {recipes.length === 0 ? (
                        <div className="text-center py-12 text-slate-400"><Search className="w-10 h-10 mx-auto mb-2 opacity-30" /><p>No recipes found</p></div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {recipes.map(recipe => <RecipeCard key={recipe._id} recipe={recipe} onView={setViewRecipe} savedIds={savedIds} onToggleSave={handleToggleSave} />)}
                        </div>
                    )}
                </section>
            )}

            {/* Top Rated Horizontal Slider */}
            {!search && topRated.length > 0 && (
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 mr-2" />
                            <h2 className="text-xl font-black text-slate-800">Top Rated Recipes</h2>
                            <span className="ml-2 bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-0.5 rounded-full">TOP 5</span>
                        </div>
                        <div className="flex space-x-2">
                            <button onClick={() => scroll('left')} className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"><ChevronLeft className="w-5 h-5 text-slate-600" /></button>
                            <button onClick={() => scroll('right')} className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"><ChevronRight className="w-5 h-5 text-slate-600" /></button>
                        </div>
                    </div>
                    <div ref={sliderRef} className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory">
                        {topRated.map(recipe => (
                            <div key={recipe._id} className="snap-start">
                                <RecipeCard recipe={recipe} onView={setViewRecipe} savedIds={savedIds} onToggleSave={handleToggleSave} compact={true} />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* AI Kitchen Helper CTA Box */}
            {!search && (
                <section>
                    <Link
                        to="/user/ai-helper"
                        className="block group relative overflow-hidden rounded-3xl bg-slate-900 p-8 sm:p-10 shadow-2xl transition-all hover:scale-[1.01] hover:shadow-orange-500/10"
                    >
                        {/* Animated background effects */}
                        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-orange-500/20 transition-colors duration-700"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl group-hover:bg-rose-500/20 transition-colors duration-700"></div>
                        
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                                <div className="relative">
                                    <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-3xl bg-white/10 p-1 flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform overflow-hidden backdrop-blur-sm border border-white/20">
                                        <img src={goluIcon} alt="Mr. Golumolu" className="w-full h-full object-cover rounded-2xl" />
                                    </div>
                                    <div className="absolute -top-3 -right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg animate-pulse">
                                        <Sparkles className="w-5 h-5 text-orange-500" />
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-2xl sm:text-4xl font-black text-white mb-2">Meet Mr. Golumolu</h2>
                                    <p className="text-orange-100 text-sm sm:text-lg max-w-md">Your professional AI Chef! Ask for instant recipes, cooking secrets, and culinary guidance.</p>
                                </div>
                            </div>
                            <div className="shrink-0">
                                <div className="px-6 py-3 bg-white text-slate-900 rounded-xl font-bold text-sm flex items-center group-hover:bg-orange-500 group-hover:text-white transition-all shadow-lg">
                                    <Wand2 className="w-4 h-4 mr-2" />
                                    Chat Now
                                </div>
                            </div>
                        </div>
                    </Link>
                </section>
            )}

            {/* All Recipes CTA Box */}
            {!search && (
                <section>
                    <div
                        onClick={() => setShowAllRecipes(true)}
                        className="cursor-pointer group relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-rose-500 to-pink-600 p-8 sm:p-12 shadow-2xl shadow-rose-500/30 hover:shadow-rose-500/50 transition-all hover:scale-[1.01]"
                    >
                        {/* Decorative blobs */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 group-hover:scale-110 transition-transform duration-700"></div>

                        <div className="relative z-10 flex items-center justify-between">
                            <div>
                                <div className="flex items-center space-x-2 mb-3">
                                    <Grid3X3 className="w-6 h-6 text-white/80" />
                                    <span className="text-white/80 font-semibold text-sm uppercase tracking-widest">Browse</span>
                                </div>
                                <h2 className="text-3xl sm:text-4xl font-black text-white mb-2">All Recipes</h2>
                                <p className="text-white/70 text-sm sm:text-base">{recipes.length} delicious recipes waiting for you</p>
                            </div>
                            <div className="shrink-0 ml-6">
                                <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-colors shadow-inner">
                                    <ChevronRight className="w-7 h-7 sm:w-10 sm:h-10 text-white group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* All Recipes Drawer */}
            {showAllRecipes && (
                <AllRecipesDrawer
                    recipes={recipes}
                    onClose={() => setShowAllRecipes(false)}
                    savedIds={savedIds}
                    onToggleSave={handleToggleSave}
                    onView={setViewRecipe}
                />
            )}

            {/* Recipe Detail Modal */}
            {viewRecipe && (
                <RecipeModal recipe={viewRecipe} onClose={() => setViewRecipe(null)} savedIds={savedIds} onToggleSave={handleToggleSave} />
            )}
        </div>
    );
};

export default UserHome;
