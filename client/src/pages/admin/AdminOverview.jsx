import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { FileText, Users, Clock, Image as ImageIcon, MessageSquare, CheckCircle, Heart, Star } from 'lucide-react';

const AdminOverview = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('http://localhost:5000/api/admin/analytics', config);
                setStats(data);
            } catch (error) {
                console.error("Failed to load analytics", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [user.token]);

    if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div></div>;
    
    if (!stats) return <div>Failed to load data</div>;

    const statCards = [
        { title: 'Total Users', value: stats.users, icon: Users, color: 'bg-blue-500' },
        { title: 'Total Chefs', value: stats.chefs, icon: Users, color: 'bg-indigo-500' },
        { title: 'Pending Approvals', value: stats.recipes.pending, icon: Clock, color: 'bg-amber-500' },
        { title: 'Published Recipes', value: stats.recipes.approved, icon: CheckCircle, color: 'bg-emerald-500' },
        { title: 'Total Reviews', value: stats.reviews, icon: MessageSquare, color: 'bg-purple-500' },
        { title: 'Active Ads', value: stats.ads, icon: ImageIcon, color: 'bg-rose-500' },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Platform Analytics</h2>
                <p className="text-slate-500 text-sm mt-1">Monitor Recipe Nest's global metrics and pending queues.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {statCards.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
                        <div className={`p-4 rounded-xl text-white ${stat.color} shadow-lg`}>
                            <stat.icon className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                            <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>
            
            {stats.recipes.pending > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between">
                     <div>
                        <h3 className="text-yellow-800 font-bold text-lg flex items-center"><Clock className="w-5 h-5 mr-2" /> Action Required</h3>
                        <p className="text-yellow-700 text-sm mt-1">There are {stats.recipes.pending} recipes waiting for your review.</p>
                     </div>
                     <a href="/admin/pending-recipes" className="mt-4 sm:mt-0 inline-flex items-center justify-center px-4 py-2 border border-transparent font-medium rounded-lg text-yellow-900 bg-yellow-200 hover:bg-yellow-300 transition-colors">
                        Review Recipes now
                     </a>
                </div>
            )}
        </div>
    );
};

export default AdminOverview;
