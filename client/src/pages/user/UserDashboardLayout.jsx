import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Bookmark, UserCircle, LogOut, Wand2, Camera } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import myLogo from '../../assets/logo.png';

const UserDashboardLayout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const navigation = [
        { name: 'Discover', href: '/user', icon: Home },
        { name: 'Saved Recipes', href: '/user/saved', icon: Bookmark },
        { name: 'Social Feed', href: '/user/social', icon: Camera },
        { name: 'AI Helper', href: '/user/ai-helper', icon: Wand2 },
        { name: 'My Profile', href: '/user/profile', icon: UserCircle },
    ];

    return (
        <div className="min-h-screen bg-amber-50/50">
            {/* Top Navbar */}
            <nav className="bg-white border-b-2 border-orange-100 sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center space-x-2">
                            <div className="p-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 shadow-md">
                                <img src={myLogo} alt="Recipe Nest" className="w-6 h-6 object-contain" />
                            </div>
                            <span className="font-black text-xl text-slate-800 tracking-tight">Recipe<span className="text-orange-500">Nest</span></span>
                        </div>

                        {/* Nav Links */}
                        <div className="hidden sm:flex items-center space-x-1">
                            {navigation.map((item) => {
                                const isActive = location.pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                            isActive
                                                ? 'bg-orange-50 text-orange-600 font-bold'
                                                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                                        }`}
                                    >
                                        <item.icon className="w-4 h-4 mr-2" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Right side */}
                        <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2">
                                {user?.photo ? (
                                    <img src={`http://localhost:5000${user.photo}`} alt={user.name} className="w-8 h-8 rounded-full object-cover border-2 border-orange-200" />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-rose-400 flex items-center justify-center text-white font-bold text-sm">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <span className="hidden md:block text-sm font-medium text-slate-700">{user?.name}</span>
                            </div>
                            <button
                                onClick={logout}
                                className="flex items-center px-3 py-2 text-sm text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <LogOut className="w-4 h-4 mr-1" />
                                <span className="hidden sm:block">Logout</span>
                            </button>
                        </div>
                    </div>

                    {/* Mobile nav */}
                    <div className="sm:hidden flex items-center space-x-1 pb-2">
                        {navigation.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <Link key={item.name} to={item.href} className={`flex-1 flex flex-col items-center py-1.5 rounded-lg text-xs font-medium transition-all ${isActive ? 'bg-orange-50 text-orange-600' : 'text-slate-500'}`}>
                                    <item.icon className="w-4 h-4 mb-0.5" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </nav>

            {/* Page Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>
        </div>
    );
};

export default UserDashboardLayout;
