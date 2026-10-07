import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { Users, Trash2, UserCircle, Search } from 'lucide-react';
import ChefIcon from '../../components/ChefIcon';

const ManageUsers = () => {
    const { user } = useAuth();
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all'); // 'all', 'user', 'chef'
    const [viewUser, setViewUser] = useState(null);

    const fetchUsers = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('http://localhost:5000/api/admin/users', config);
            setAllUsers(data);
        } catch (error) {
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Permanently remove this user from the platform?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.delete(`http://localhost:5000/api/admin/users/${id}`, config);
                toast.success('User removed');
                setViewUser(null);
                fetchUsers();
            } catch (error) {
                toast.error('Failed to remove user');
            }
        }
    };

    const filtered = allUsers.filter(u => {
        const matchesFilter = filter === 'all' || u.role === filter;
        const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
                              u.email.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div></div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                    <Users className="w-6 h-6 mr-2 text-indigo-500" /> Users & Chefs
                </h2>
                <div className="flex items-center gap-3">
                    {/* Filter buttons */}
                    <div className="flex bg-slate-100 rounded-lg p-1 gap-1">
                        {['all', 'user', 'chef'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-3 py-1.5 text-sm font-medium rounded-md capitalize transition-all ${
                                    filter === f ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                }`}
                            >
                                {f === 'all' ? 'All' : f === 'user' ? 'Users' : 'Chefs'}
                            </button>
                        ))}
                    </div>
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search name or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                        />
                    </div>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center space-x-4">
                    <div className="p-3 rounded-xl bg-blue-500 text-white"><Users className="w-5 h-5" /></div>
                    <div>
                        <p className="text-sm text-slate-500">Regular Users</p>
                        <p className="text-2xl font-bold text-slate-800">{allUsers.filter(u => u.role === 'user').length}</p>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center space-x-4">
                    <div className="p-3 rounded-xl bg-orange-500 text-white"><ChefIcon className="w-5 h-5" /></div>
                    <div>
                        <p className="text-sm text-slate-500">Registered Chefs</p>
                        <p className="text-2xl font-bold text-slate-800">{allUsers.filter(u => u.role === 'chef').length}</p>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                                <th className="p-4">User</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Bio</th>
                                <th className="p-4">Joined</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 text-sm text-slate-700">
                            {filtered.map((u) => (
                                <tr key={u._id} className="hover:bg-slate-50/80 transition-colors cursor-pointer" onClick={() => setViewUser(u)}>
                                    <td className="p-4">
                                        <div className="flex items-center space-x-3">
                                            {u.photo ? (
                                                <img src={`http://localhost:5000${u.photo}`} alt={u.name} className="w-9 h-9 rounded-full object-cover border-2 border-slate-100" />
                                            ) : (
                                                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-sm ${u.role === 'chef' ? 'bg-orange-400' : 'bg-indigo-400'}`}>
                                                    {u.name.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <span className="font-semibold text-slate-800">{u.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-slate-500">{u.email}</td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                                            u.role === 'chef'
                                                ? 'bg-orange-100 text-orange-700'
                                                : 'bg-indigo-100 text-indigo-700'
                                        }`}>
                                            {u.role === 'chef' ? <ChefIcon className="w-3 h-3 mr-1" /> : <UserCircle className="w-3 h-3 mr-1" />}
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-400 max-w-xs">
                                        <p className="line-clamp-1">{u.bio || '—'}</p>
                                    </td>
                                    <td className="p-4 text-slate-400 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDelete(u._id); }}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Remove user"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr><td colSpan="6" className="p-10 text-center text-slate-400">No users found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* User Detail Modal */}
            {viewUser && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setViewUser(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
                        {/* Header banner */}
                        <div className={`h-24 ${viewUser.role === 'chef' ? 'bg-gradient-to-r from-orange-400 to-rose-400' : 'bg-gradient-to-r from-indigo-400 to-purple-500'}`}></div>

                        <div className="px-6 pb-6">
                            {/* Avatar */}
                            <div className="-mt-10 mb-4 flex items-end justify-between">
                                {viewUser.photo ? (
                                    <img src={`http://localhost:5000${viewUser.photo}`} alt={viewUser.name} className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg" />
                                ) : (
                                    <div className={`w-20 h-20 rounded-full flex items-center justify-center font-black text-3xl text-white border-4 border-white shadow-lg ${viewUser.role === 'chef' ? 'bg-orange-400' : 'bg-indigo-400'}`}>
                                        {viewUser.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${
                                    viewUser.role === 'chef' ? 'bg-orange-100 text-orange-700' : 'bg-indigo-100 text-indigo-700'
                                }`}>
                                    {viewUser.role === 'chef' ? <ChefIcon className="w-3 h-3 mr-1" /> : <UserCircle className="w-3 h-3 mr-1" />}
                                    {viewUser.role}
                                </span>
                            </div>

                            <h3 className="text-xl font-black text-slate-800">{viewUser.name}</h3>
                            <p className="text-slate-500 text-sm mt-1">{viewUser.email}</p>

                            {viewUser.bio && (
                                <div className="mt-4 bg-slate-50 rounded-xl p-4">
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">About</p>
                                    <p className="text-slate-600 text-sm leading-relaxed">{viewUser.bio}</p>
                                </div>
                            )}

                            <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
                                <span>Joined: {new Date(viewUser.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>

                            <div className="mt-6 flex space-x-3">
                                <button onClick={() => setViewUser(null)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-medium transition-colors">
                                    Close
                                </button>
                                <button onClick={() => handleDelete(viewUser._id)} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors shadow-lg shadow-red-500/20">
                                    Remove User
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageUsers;
