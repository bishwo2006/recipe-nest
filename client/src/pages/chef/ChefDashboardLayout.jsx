import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, UserCircle, LogOut, MessageSquare, Home, Wand2, Camera } from 'lucide-react';
import ChefIcon from '../../components/ChefIcon';
import { useAuth } from '../../context/AuthContext';
import myLogo from '../../assets/logo.png';

const ChefDashboardLayout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const navigation = [
        { name: 'Overview', href: '/chef', icon: LayoutDashboard },
        { name: 'Discover', href: '/chef/discover', icon: Home },
        { name: 'Social Feed', href: '/chef/social', icon: Camera },
        { name: 'AI Helper', href: '/chef/ai-helper', icon: Wand2 },
        { name: 'Add Recipe', href: '/chef/add-recipe', icon: PlusCircle },
        { name: 'My Recipes', href: '/chef/my-recipes', icon: ChefIcon },
        { name: 'My Reviews', href: '/chef/reviews', icon: MessageSquare },
        { name: 'Profile', href: '/chef/profile', icon: UserCircle },
    ];

    return (
        <div className="flex h-screen bg-orange-50/40">
            {/* Sidebar */}
            <div className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 border-r border-slate-700/50 shadow-xl flex flex-col">
                <div className="h-16 flex items-center px-6 border-b border-orange-500/20 bg-orange-500/10">
                    <div className="p-1.5 bg-orange-500 rounded-lg mr-3 shadow-md shadow-orange-500/30">
                        <img src={myLogo} alt="Logo" className="w-5 h-5 object-contain" />
                    </div>
                    <span className="text-white font-bold text-lg tracking-tight">Chef <span className="text-orange-400">Portal</span></span>
                </div>
                
                <div className="flex-1 overflow-y-auto py-4">
                    <nav className="space-y-1 px-3">
                        {navigation.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all ${
                                        isActive
                                            ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                    }`}
                                >
                                    <item.icon
                                        className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${
                                            isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                                        }`}
                                    />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
                
                {/* User specific bottom */}
                <div className="p-4 border-t border-slate-800 flex items-center space-x-3">
                    <img src={user?.photo ? `http://localhost:5000${user.photo}` : 'https://via.placeholder.com/150'} alt="Profile" className="h-10 w-10 rounded-full border border-slate-700 object-cover" />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                        <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 bg-white border-b border-orange-100 flex items-center justify-between px-8 z-10 shadow-sm">
                    <div className="flex items-center space-x-3">
                        <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
                        <h1 className="text-xl font-bold text-slate-800">
                            {navigation.find(n => n.href === location.pathname)?.name || 'Dashboard'}
                        </h1>
                    </div>
                    <button
                        onClick={logout}
                        className="inline-flex items-center px-4 py-2 border border-slate-200 text-sm font-medium rounded-lg text-slate-600 bg-white hover:bg-slate-50 transition-colors focus:ring-2 focus:ring-orange-500"
                    >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                    </button>
                </header>
                <main className="flex-1 overflow-y-auto p-8 bg-orange-50/30">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default ChefDashboardLayout;
