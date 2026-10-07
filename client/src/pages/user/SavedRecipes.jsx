import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { Bookmark, Heart, Star, Trash2 } from 'lucide-react';
import ChefIcon from '../../components/ChefIcon';

const SavedRecipes = () => {
    const { user } = useAuth();
    const [saved, setSaved] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSaved = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('http://localhost:5000/api/user/saved', config);
            setSaved(data);
        } catch { toast.error('Failed to load saved recipes'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchSaved(); }, []);

    const handleUnsave = async (recipeId) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`http://localhost:5000/api/user/recipes/${recipeId}/save`, {}, config);
            setSaved(prev => prev.filter(r => r._id !== recipeId));
            toast.success('Removed from saved');
        } catch { toast.error('Failed to remove'); }
    };

    if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div></div>;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-black text-slate-800 flex items-center"><Bookmark className="w-6 h-6 mr-2 text-orange-500 fill-orange-500" /> Saved Recipes</h1>
                <p className="text-slate-500 text-sm mt-1">{saved.length} recipes saved</p>
            </div>

            {saved.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-2xl border border-slate-100">
                    <Bookmark className="w-14 h-14 mx-auto text-slate-200 mb-4" />
                    <h3 className="font-bold text-slate-700 text-lg">Nothing saved yet</h3>
                    <p className="text-slate-400 text-sm mt-1">Tap the bookmark icon on any recipe to save it here.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {saved.map(recipe => (
                        <div key={recipe._id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden group hover:shadow-lg transition-all">
                            <div className="relative h-44 overflow-hidden">
                                <img src={`http://localhost:5000${recipe.image}`} alt={recipe.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-slate-800 mb-1 line-clamp-1">{recipe.title}</h3>
                                <Link to={`/user/chef/${recipe.chef?._id}`} className="flex items-center text-sm text-slate-500 mb-3 hover:text-orange-600 transition-colors group/chef">
                                    <ChefIcon className="w-3.5 h-3.5 mr-1" />
                                    {recipe.chef?.name}
                                </Link>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-1">
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        <span className="text-sm font-bold text-slate-700">{recipe.averageRating?.toFixed(1) || '—'}</span>
                                    </div>
                                    <button
                                        onClick={() => handleUnsave(recipe._id)}
                                        className="flex items-center space-x-1 text-xs text-red-400 hover:text-red-600 hover:bg-red-50 px-2 py-1.5 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        <span>Remove</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SavedRecipes;
