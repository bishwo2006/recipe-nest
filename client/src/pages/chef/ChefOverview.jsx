import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { FileText, Clock, CheckCircle, XCircle, Heart, Star, MessageSquare } from 'lucide-react';

const ChefOverview = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        total: 0, pending: 0, approved: 0, rejected: 0,
        totalLikes: 0, totalReviews: 0, avgRating: 0,
    });
    const [loading, setLoading] = useState(true);
    const [topRecipes, setTopRecipes] = useState([]);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('http://localhost:5000/api/recipes/my', config);
                
                const calculatedStats = data.reduce((acc, recipe) => {
                    acc.total += 1;
                    acc[recipe.status] = (acc[recipe.status] || 0) + 1;
                    acc.totalLikes += recipe.likes?.length || 0;
                    acc.totalReviews += recipe.numReviews || 0;
                    return acc;
                }, { total: 0, pending: 0, approved: 0, rejected: 0, totalLikes: 0, totalReviews: 0 });
                
                // avg rating from approved recipes
                const approvedWithRating = data.filter(r => r.status === 'approved' && r.numReviews > 0);
                calculatedStats.avgRating = approvedWithRating.length > 0
                    ? (approvedWithRating.reduce((s, r) => s + r.averageRating, 0) / approvedWithRating.length).toFixed(1)
                    : 0;

                // top 3 by likes
                const sorted = [...data].filter(r => r.status === 'approved').sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)).slice(0, 3);
                setTopRecipes(sorted);
                setStats(calculatedStats);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchRecipes();
    }, [user.token]);

    const cards = [
        { name: 'Total Recipes', value: stats.total, icon: FileText, color: 'bg-blue-500' },
        { name: 'Pending Approval', value: stats.pending, icon: Clock, color: 'bg-yellow-500' },
        { name: 'Approved', value: stats.approved, icon: CheckCircle, color: 'bg-green-500' },
        { name: 'Requires Revision', value: stats.rejected, icon: XCircle, color: 'bg-red-500' },
        { name: 'Total Likes', value: stats.totalLikes, icon: Heart, color: 'bg-rose-500' },
        { name: 'Total Reviews', value: stats.totalReviews, icon: MessageSquare, color: 'bg-purple-500' },
        { name: 'Average Rating', value: stats.avgRating || '—', icon: Star, color: 'bg-amber-500' },
    ];

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-8">
            <h2 className="text-xl font-bold text-slate-800">Welcome back, Chef {user.name}!</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card) => (
                    <div key={card.name} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex items-center space-x-4">
                        <div className={`p-4 rounded-xl ${card.color} text-white shadow-lg`}>
                            <card.icon className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">{card.name}</p>
                            <p className="text-3xl font-bold text-slate-800">{card.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Top Performing Recipes */}
            {topRecipes.length > 0 && (
                <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center"><Heart className="w-5 h-5 mr-2 text-rose-500 fill-rose-500" /> Your Most Liked Recipes</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {topRecipes.map(recipe => (
                            <div key={recipe._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                <div className="h-36 overflow-hidden">
                                    <img src={`http://localhost:5000${recipe.image}`} alt={recipe.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="p-4">
                                    <h4 className="font-bold text-slate-800 truncate mb-2">{recipe.title}</h4>
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center space-x-1 text-rose-500">
                                            <Heart className="w-4 h-4 fill-rose-500" />
                                            <span className="font-bold">{recipe.likes?.length || 0}</span>
                                        </div>
                                        <div className="flex items-center space-x-1 text-amber-500">
                                            <Star className="w-4 h-4 fill-amber-500" />
                                            <span className="font-bold">{recipe.averageRating?.toFixed(1) || '—'}</span>
                                        </div>
                                        <div className="flex items-center space-x-1 text-purple-500">
                                            <MessageSquare className="w-4 h-4" />
                                            <span className="font-bold">{recipe.numReviews || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChefOverview;
