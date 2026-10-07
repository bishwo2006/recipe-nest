import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { LogOut, UserCircle, ShieldAlert } from 'lucide-react';
import ChefIcon from '../components/ChefIcon';
import myLogo from '../assets/logo.png';
import AdSlider from '../components/AdSlider';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;
    
    // Role-based routing
    if (user.role === 'chef') {
        return <Navigate to="/chef" />;
    }
    
    if (user.role === 'admin') {
        return <Navigate to="/admin" />;
    }
    
    if (user.role === 'user') {
        return <Navigate to="/user" />;
    }

    const getRoleStyling = () => {
        switch (user.role) {
            case 'admin':
                return {
                    bg: 'from-purple-600 to-indigo-600',
                    icon: <ShieldAlert className="w-12 h-12 text-white/90" />,
                    title: 'Admin Control Center',
                    description: 'Manage users, review pending recipes, and moderate reviews.'
                };
            case 'chef':
                return {
                    bg: 'from-orange-500 to-red-500',
                    icon: <ChefIcon className="w-12 h-12" />,
                    title: 'Chef Dashboard',
                    description: 'Publish recipes, view analytics, and respond to feedback.'
                };
            default:
                return {
                    bg: 'from-teal-500 to-emerald-500',
                    icon: <UserCircle className="w-12 h-12 text-white/90" />,
                    title: 'User Feed',
                    description: 'Explore recipes, bookmark favorites, and leave reviews.'
                };
        }
    };

    const style = getRoleStyling();

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
            <nav className="bg-white shadow border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center space-x-2">
                           <div className={`p-2 rounded-lg bg-gradient-to-r ${style.bg} shadow-md`}>
                             <img src={myLogo} alt="Recipe Nest Logo" className="h-6 w-6 object-contain" />
                           </div>
                           <span className="font-bold text-xl tracking-tight text-slate-800">Recipe Nest</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 shadow-sm shadow-inner">
                                {user.name} ({user.role})
                            </span>
                            <button
                                onClick={handleLogout}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-slate-800 hover:bg-slate-700 shadow-lg shadow-slate-200 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                {user.role === 'user' && <AdSlider />}
                
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 transform transition-all hover:shadow-2xl mt-4">
                    <div className={`bg-gradient-to-r ${style.bg} px-8 py-16 text-center relative overflow-hidden`}>
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                        <div className="flex justify-center mb-6 relative z-10">
                            {style.icon}
                        </div>
                        <h1 className="text-4xl font-extrabold text-white sm:text-5xl tracking-tight mb-4 relative z-10">
                            {style.title}
                        </h1>
                        <p className="text-xl text-white/80 max-w-2xl mx-auto font-medium relative z-10">
                            {style.description}
                        </p>
                    </div>
                    
                    <div className="p-8 sm:p-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Placeholder role-specific widgets */}
                            {[1, 2, 3].map((item) => (
                                <div key={item} className="bg-slate-50 border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                                    <div className="w-10 h-10 rounded-full bg-slate-200 mb-4 group-hover:scale-110 transition-transform flex items-center justify-center">
                                       <span className="text-slate-500 font-bold">{item}</span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Feature Module {item}</h3>
                                    <p className="text-slate-500 text-sm">Actionable area according to your specific {user.role} permissions.</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
