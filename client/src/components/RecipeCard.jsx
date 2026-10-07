import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Heart, Bookmark, Star, UserCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ChefIcon from './ChefIcon';

const RecipeCard = ({ recipe, onView, savedIds, onToggleSave, compact }) => {
    const { user } = useAuth();
    const [likes, setLikes] = useState(recipe.likes?.length || 0);
    const [liked, setLiked] = useState(recipe.likes?.includes(user?._id));
    const isSaved = savedIds?.includes(recipe._id);

    const handleLike = async (e) => {
        e.stopPropagation();
        if (!user) return toast.error('Login required to like');
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.put(`http://localhost:5000/api/user/recipes/${recipe._id}/like`, {}, config);
            setLikes(data.likes);
            setLiked(data.liked);
        } catch { toast.error('Failed to update like'); }
    };

    const handleSave = async (e) => {
        e.stopPropagation();
        if (!user) return toast.error('Login required to save');
        onToggleSave(recipe._id);
    };

    return (
        <div
            onClick={() => onView(recipe)}
            className={`bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden cursor-pointer group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex-shrink-0 ${compact ? 'w-64' : 'w-full'}`}
        >
            <div className="relative h-44 overflow-hidden">
                <img src={`http://localhost:5000${recipe.image}`} alt={recipe.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <button onClick={handleSave} className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all shadow ${isSaved ? 'bg-orange-500 text-white' : 'bg-white/80 text-slate-600 hover:bg-orange-500 hover:text-white'}`}>
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
                </button>
            </div>
            <div className="p-4">
                <h3 className="font-bold text-slate-800 text-base leading-tight mb-1 line-clamp-1">{recipe.title}</h3>
                <div className="flex items-center text-slate-400 text-xs mb-3">
                    <ChefIcon className="w-3 h-3 mr-1" />
                    <Link 
                        to={`/user/chef/${recipe.chef?._id}`} 
                        className="truncate hover:text-orange-600 transition-colors cursor-pointer"
                        onClick={e => e.stopPropagation()}
                    >
                        {recipe.chef?.name || 'Chef'}
                    </Link>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-bold text-slate-700">{recipe.averageRating?.toFixed(1) || '—'}</span>
                        <span className="text-xs text-slate-400">({recipe.numReviews})</span>
                    </div>
                    <button onClick={handleLike} className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${liked ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-400'}`}>
                        <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-red-500' : ''}`} />
                        <span>{likes}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RecipeCard;
