import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileCheck, MessageSquare, Image, LogOut, Users, Camera } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import myLogo from '../../assets/logo.png';

const AdminDashboardLayout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const navigation = [
        { name: 'Analytics', href: '/admin', icon: LayoutDashboard },
        { name: 'Pending Recipes', href: '/admin/pending-recipes', icon: FileCheck },
        { name: 'Users & Chefs', href: '/admin/users', icon: Users },
        { name: 'Manage Reviews', href: '/admin/manage-reviews', icon: MessageSquare },
        { name: 'Social Feed', href: '/admin/social', icon: Camera },
        { name: 'Advertisements', href: '/admin/advertisements', icon: Image },
    ];

    return (
        <div className="flex h-screen bg-slate-100">
            {/* Sidebar */}
            <div className="w-64 bg-black border-r border-slate-800 shadow-2xl flex flex-col">
                <div className="h-16 flex items-center px-6 border-b border-yellow-500/20 bg-yellow-500/5">
                    <div className="p-1.5 bg-yellow-500 rounded-lg mr-3 shadow-md shadow-yellow-500/30">
                        <img src={myLogo} alt="Logo" className="w-5 h-5 object-contain filter brightness-0" />
                    </div>
                    <span className="font-bold text-lg tracking-tight"><span className="text-yellow-400">Admin</span> <span className="text-slate-300">Panel</span></span>
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
                                            ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-black shadow-lg shadow-yellow-500/20 font-bold'
                                            : 'text-slate-400 hover:bg-slate-900 hover:text-yellow-500'
                                    }`}
                                >
                                    <item.icon
                                        className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${
                                            isActive ? 'text-black' : 'text-slate-500 group-hover:text-yellow-500'
                                        }`}
                                    />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
                
                <div className="p-4 border-t border-yellow-900/30 flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-yellow-500 flex items-center justify-center font-bold text-black border-2 border-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.3)]">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-yellow-500 truncate">{user?.name}</p>
                        <p className="text-xs text-slate-500 truncate">System Operator</p>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 bg-white border-b border-yellow-200/60 flex items-center justify-between px-8 z-10 shadow-sm relative">
                    <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-yellow-400 via-amber-400 to-transparent opacity-50"></div>
                    <div className="flex items-center space-x-3">
                        <div className="w-1 h-6 bg-yellow-400 rounded-full"></div>
                        <h1 className="text-xl font-bold text-slate-800">
                            {navigation.find(n => n.href === location.pathname)?.name || 'Admin Dashboard'}
                        </h1>
                    </div>
                    <button
                        onClick={logout}
                        className="inline-flex items-center px-4 py-2 border border-slate-200 text-sm font-medium rounded-lg text-slate-600 bg-white hover:bg-slate-50 hover:text-red-600 transition-colors"
                    >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                    </button>
                </header>
                <main className="flex-1 overflow-y-auto p-8 bg-slate-100">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminDashboardLayout;
