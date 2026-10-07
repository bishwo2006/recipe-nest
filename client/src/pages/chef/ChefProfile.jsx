import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { Camera } from 'lucide-react';

const ChefProfile = () => {
    const { user, login } = useAuth();
    const [name, setName] = useState(user.name || '');
    const [bio, setBio] = useState(user.bio || '');
    const [photo, setPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(user.photo ? `http://localhost:5000${user.photo}` : 'https://via.placeholder.com/150');
    const [loading, setLoading] = useState(false);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhoto(file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('name', name);
        formData.append('bio', bio);
        if (photo) {
            formData.append('photo', photo);
        }

        try {
            const config = { 
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}` 
                } 
            };
            const { data } = await axios.put('http://localhost:5000/api/users/profile', formData, config);
            
            // Re-store token from existing user object, since backend response might not include it
            const updatedUser = { ...data, token: user.token };
            localStorage.setItem('userInfo', JSON.stringify(updatedUser)); // Not ideal hack to update context, ideal is a context action. A reload will suffice for this demo.
            
            toast.success('Profile updated successfully!');
            setTimeout(() => window.location.reload(), 1000); // Quick hack to sync auth context
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error updating profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 max-w-3xl">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Manage Public Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                     <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-slate-100 bg-slate-50 group">
                        <img src={photoPreview} alt="Profile preview" className="h-full w-full object-cover" />
                        <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                            <Camera className="w-8 h-8 text-white mb-1" />
                            <span className="text-white text-xs font-semibold">Change</span>
                            <input type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
                        </label>
                     </div>
                     <div className="flex-1 w-full sm:w-auto mt-4 sm:mt-0">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Display Name</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-xl border border-slate-300 p-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-slate-700"
                        />
                        <p className="text-sm text-slate-500 mt-2">{user.email}</p>
                        <p className="text-sm text-orange-500 font-semibold uppercase tracking-wide mt-1">{user.role}</p>
                     </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">About me (Bio)</label>
                    <textarea
                        rows="5"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 p-4 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-slate-700"
                        placeholder="Tell food lovers about your culinary background..."
                    ></textarea>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold shadow-md shadow-orange-500/30 hover:bg-orange-600 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : 'Save Profile Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChefProfile;
