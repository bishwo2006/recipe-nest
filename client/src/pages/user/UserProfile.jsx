import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { User as UserIcon, Camera, Save } from 'lucide-react';

const UserProfile = () => {
    const { user, login } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [photo, setPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(user?.photo ? `http://localhost:5000${user.photo}` : null);
    const [saving, setSaving] = useState(false);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhoto(file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const formData = new FormData();
            formData.append('name', name);
            if (photo) formData.append('photo', photo);

            const config = {
                headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${user.token}` }
            };
            const { data } = await axios.put('http://localhost:5000/api/users/profile', formData, config);

            // Update local auth state - use 'userInfo' to match AuthContext.js
            const updated = { ...user, ...data }; 
            localStorage.setItem('userInfo', JSON.stringify(updated));
            
            toast.success('Profile updated!');
            setTimeout(() => window.location.reload(), 1000);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto space-y-6">
            <h1 className="text-2xl font-black text-slate-800">My Profile</h1>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Photo Upload */}
                    <div className="flex flex-col items-center">
                        <label className="cursor-pointer group relative">
                            {photoPreview ? (
                                <img src={photoPreview} alt="Profile" className="w-28 h-28 rounded-full object-cover border-4 border-orange-100 shadow-lg" />
                            ) : (
                                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-orange-400 to-rose-400 flex items-center justify-center border-4 border-orange-100 shadow-lg">
                                    <span className="text-white font-black text-4xl">{user?.name?.charAt(0).toUpperCase()}</span>
                                </div>
                            )}
                            <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="w-7 h-7 text-white" />
                            </div>
                            <input type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
                        </label>
                        <p className="text-slate-400 text-xs mt-2">Click photo to change</p>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Display Name</label>
                        <div className="relative">
                            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 text-slate-700"
                                placeholder="Your name"
                            />
                        </div>
                    </div>

                    {/* Email (readonly) */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                        <input
                            type="email"
                            value={user?.email}
                            readOnly
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-400 cursor-not-allowed"
                        />
                        <p className="text-xs text-slate-400 mt-1">Email cannot be changed</p>
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full flex items-center justify-center py-3 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-xl font-bold shadow-lg shadow-orange-500/25 hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UserProfile;
